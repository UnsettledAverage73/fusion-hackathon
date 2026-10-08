import urllib.parse
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import RedirectResponse
import httpx
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    GoogleAuthUrlResponse,
    GoogleConfigResponse,
    GoogleTokenVerifyRequest,
    LoginRequest,
    DemoLoginRequest,
    RegisterRequest,
    UserResponse,
)

router = APIRouter()
settings = get_settings()


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new student or staff account",
)
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    user = User(
        name=payload.name.strip(),
        email=email_clean,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post(
    "/login",
    response_model=AuthResponse,
    summary="Authenticate with email and password",
)
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post(
    "/demo-login",
    response_model=AuthResponse,
    summary="One-click demo authentication for student and counselor roles",
)
def demo_login(payload: DemoLoginRequest, db: Session = Depends(get_db)):
    if payload.role == "staff":
        user = db.query(User).filter(User.role == "staff").first()
        if not user:
            user = User(
                id="usr-counselor",
                email="counselor@campus.edu",
                name="Dr. Aris Thorne (Counselor)",
                role="staff",
            )
            db.add(user)
            db.commit()
            db.refresh(user)
    else:
        user = db.query(User).filter(User.role == "student").first()
        if not user:
            user = User(
                id="usr-atharva",
                email="atharva@student.edu",
                name="Atharva Bodade",
                role="student",
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current authenticated user profile",
)
def get_me(user: User = Depends(get_current_user)):
    return UserResponse.model_validate(user)


# Google OAuth integration endpoints
@router.get(
    "/google/config",
    response_model=GoogleConfigResponse,
    summary="Get Google OAuth client configuration",
)
def get_google_config() -> GoogleConfigResponse:
    return GoogleConfigResponse(
        client_id=settings.GOOGLE_CLIENT_ID,
        auth_uri="https://accounts.google.com/o/oauth2/auth",
        redirect_uri=settings.GOOGLE_REDIRECT_URI,
    )


@router.get(
    "/google/url",
    response_model=GoogleAuthUrlResponse,
    summary="Generate Google OAuth redirect URL",
)
def get_google_auth_url() -> GoogleAuthUrlResponse:
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google Client ID is not configured on the backend.",
        )

    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account",
    }
    encoded_params = urllib.parse.urlencode(params)
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{encoded_params}"
    return GoogleAuthUrlResponse(url=url)


@router.post(
    "/google/verify",
    response_model=AuthResponse,
    summary="Verify Google ID token from frontend sign-in",
)
def verify_google_token(
    payload: GoogleTokenVerifyRequest,
    db: Session = Depends(get_db),
) -> AuthResponse:
    token = payload.credential or payload.token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing Google credential/token in request body.",
        )

    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google Client ID is not configured on the backend.",
        )

    try:
        id_info = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google token verification failed: {str(e)}",
        )

    google_sub = id_info.get("sub")
    email = id_info.get("email")
    name = id_info.get("name") or "Google User"
    picture = id_info.get("picture")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account did not return an email address.",
        )

    user = db.query(User).filter((User.google_id == google_sub) | (User.email == email)).first()
    if not user:
        user = User(
            google_id=google_sub,
            email=email,
            name=name,
            role="student",
            picture=picture,
        )
        db.add(user)
    else:
        user.google_id = google_sub
        user.name = name or user.name
        user.picture = picture or user.picture

    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.get(
    "/google/callback",
    summary="Google OAuth2 redirect callback handler",
)
def google_callback(
    code: str = Query(..., description="Authorization code from Google"),
    db: Session = Depends(get_db),
):
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth credentials are not fully configured.",
        )

    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    try:
        with httpx.Client(timeout=10.0) as client:
            token_resp = client.post(token_url, data=data)
            token_data = token_resp.json()

        raw_id_token = token_data.get("id_token")
        if not raw_id_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Google token exchange failed: {token_data.get('error_description', 'No ID token received')}",
            )

        id_info = id_token.verify_oauth2_token(
            raw_id_token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process Google authentication: {str(e)}",
        )

    google_sub = id_info.get("sub")
    email = id_info.get("email")
    name = id_info.get("name") or "Google User"
    picture = id_info.get("picture")

    user = db.query(User).filter((User.google_id == google_sub) | (User.email == email)).first()
    if not user:
        user = User(
            google_id=google_sub,
            email=email,
            name=name,
            role="student",
            picture=picture,
        )
        db.add(user)
    else:
        user.google_id = google_sub
        user.name = name or user.name
        user.picture = picture or user.picture

    db.commit()
    db.refresh(user)

    jwt_token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    target_redirect = f"{settings.FRONTEND_URL}/?auth_token={jwt_token}"
    return RedirectResponse(url=target_redirect)
