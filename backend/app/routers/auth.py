import json
import logging
import urllib.request
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import create_access_token, get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    GoogleConfigResponse,
    GoogleTokenVerifyRequest,
    UserResponse,
)

router = APIRouter()
logger = logging.getLogger("auth_router")
settings = get_settings()


@router.get(
    "/google/config",
    response_model=GoogleConfigResponse,
    summary="Get Google OAuth client configuration",
)
def get_google_config() -> GoogleConfigResponse:
    """Returns the Google OAuth Client ID for frontend GIS initialization."""
    return GoogleConfigResponse(
        client_id=settings.GOOGLE_CLIENT_ID,
        auth_uri="https://accounts.google.com/o/oauth2/auth",
        redirect_uri=settings.GOOGLE_REDIRECT_URI,
    )


@router.post(
    "/google/verify",
    response_model=AuthResponse,
    summary="Verify Google OAuth ID Token",
)
def verify_google_token(
    payload: GoogleTokenVerifyRequest,
    db: Session = Depends(get_db),
) -> AuthResponse:
    """Verifies a Google OAuth ID Token / GIS credential and logs in the user."""
    credential = payload.credential.strip()
    if not credential:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google credential token cannot be empty.",
        )

    user_info = None

    # Method 1: Verify using google-auth library if available
    try:
        from google.auth.transport import requests as google_requests
        from google.oauth2 import id_token

        client_id = settings.GOOGLE_CLIENT_ID if settings.GOOGLE_CLIENT_ID else None
        user_info = id_token.verify_oauth2_token(
            credential, google_requests.Request(), client_id
        )
    except Exception as err:
        logger.warning("google-auth offline verification failed, trying Google tokeninfo API: %s", err)

    # Method 2: Fallback to Google Tokeninfo HTTP endpoint
    if not user_info:
        try:
            url = f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}"
            req = urllib.request.Request(url, headers={"User-Agent": "FusionHackathon-Auth/1.0"})
            with urllib.request.urlopen(req, timeout=5) as resp:
                if resp.status == 200:
                    user_info = json.loads(resp.read().decode("utf-8"))
        except Exception as err:
            logger.error("Tokeninfo endpoint failed: %s", err)

    if not user_info or "email" not in user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to verify Google token with Google Identity Services.",
        )

    email = user_info.get("email")
    full_name = user_info.get("name") or email.split("@")[0]
    picture = user_info.get("picture")
    google_id = user_info.get("sub")

    # Find or create user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email,
            full_name=full_name,
            picture=picture,
            google_id=google_id,
            role="participant",
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update profile info if changed
        updated = False
        if picture and user.picture != picture:
            user.picture = picture
            updated = True
        if full_name and user.full_name != full_name:
            user.full_name = full_name
            updated = True
        if google_id and user.google_id != google_id:
            user.google_id = google_id
            updated = True
        if updated:
            db.commit()
            db.refresh(user)

    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return AuthResponse(access_token=token, user=UserResponse.model_validate(user))


@router.post(
    "/demo",
    response_model=AuthResponse,
    summary="1-Click Demo Login for presentations",
)
def demo_login(db: Session = Depends(get_db)) -> AuthResponse:
    """Instantly logs in a demo hackathon user for live judge demonstrations."""
    demo_email = "judge.demo@fusion-hackathon.dev"
    user = db.query(User).filter(User.email == demo_email).first()
    if not user:
        user = User(
            email=demo_email,
            full_name="Hackathon Evaluator",
            picture="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            role="judge",
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return AuthResponse(access_token=token, user=UserResponse.model_validate(user))


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current authenticated user profile",
)
def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    """Returns profile for currently authenticated Bearer token."""
    return UserResponse.model_validate(current_user)
