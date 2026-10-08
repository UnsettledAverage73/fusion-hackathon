from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class UserResponse(BaseModel):
    """Schema for returning user account details."""

    id: int
    email: str
    full_name: Optional[str] = None
    picture: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AuthResponse(BaseModel):
    """Response returned upon successful authentication."""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class GoogleTokenVerifyRequest(BaseModel):
    """Payload sent by frontend containing Google OAuth credential/ID token."""

    credential: str


class GoogleConfigResponse(BaseModel):
    """Client ID and auth config for frontend Google SDK initialization."""

    client_id: str
    auth_uri: str
    redirect_uri: str
