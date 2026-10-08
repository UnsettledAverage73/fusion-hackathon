from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Full name")
    email: str = Field(..., description="Valid email address")
    password: str = Field(..., min_length=6, description="Password (min 6 chars)")
    role: Literal["student", "staff"] = Field(default="student", description="Account role")


class LoginRequest(BaseModel):
    email: str
    password: str



class DemoLoginRequest(BaseModel):
    role: Literal["student", "staff"] = Field(default="student", description="Role to assume")


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    picture: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GoogleTokenVerifyRequest(BaseModel):
    credential: Optional[str] = Field(None, description="Google Identity Services credential / ID token")
    token: Optional[str] = Field(None, description="Alias for credential")


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class GoogleConfigResponse(BaseModel):
    client_id: Optional[str] = None
    auth_uri: str = "https://accounts.google.com/o/oauth2/auth"
    redirect_uri: Optional[str] = None


class GoogleAuthUrlResponse(BaseModel):
    url: str
