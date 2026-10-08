from datetime import date, datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Date as SqlDate, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class SupportSignal(Base):
    """Tracks staff outreach actions and high stress streaks without exposing student private notes."""

    __tablename__ = "support_signals"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    student_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    date_from = Column(SqlDate, nullable=False)
    date_to = Column(SqlDate, nullable=False)
    signal_type = Column(String(100), default="high_stress_streak", nullable=False)
    reason = Column(String(500), nullable=False)
    status = Column(String(50), default="active", nullable=False, index=True)  # "active", "acknowledged", "resolved"
    counselor_notes = Column(String(500), nullable=True)  # Staff notes about outreach
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    student = relationship("User", back_populates="support_signals")


SupportSignalLog = SupportSignal

