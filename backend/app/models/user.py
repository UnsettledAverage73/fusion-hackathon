from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, String
from sqlalchemy.orm import relationship
from app.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def generate_user_id() -> str:
    return f"usr-{uuid.uuid4().hex[:8]}"


class User(Base):
    """User account model supporting Student and Staff roles and Google OAuth."""

    __tablename__ = "users"

    id = Column(String(50), primary_key=True, default=generate_user_id, index=True)
    google_id = Column(String(255), unique=True, index=True, nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(50), default="student", nullable=False, index=True)  # 'student' | 'staff'
    picture = Column(String(1024), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    checkins = relationship("CheckIn", back_populates="student", cascade="all, delete-orphan")
    support_signals = relationship("SupportSignal", back_populates="student", cascade="all, delete-orphan")
