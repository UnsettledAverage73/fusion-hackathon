from datetime import date, datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, Date as SqlDate, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class CheckIn(Base):
    """Daily mood and stress check-in model."""

    __tablename__ = "checkins"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    student_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(SqlDate, nullable=False, index=True)
    mood = Column(String(20), nullable=False)  # "great", "good", "neutral", "low", "very_low"
    stress_level = Column(Integer, nullable=False)  # 1 to 5
    sleep_quality = Column(Integer, nullable=True)  # 1 (Poor) to 3 (Good)
    nutrition = Column(Integer, nullable=True)  # 1 to 5
    physical_activity = Column(Integer, nullable=True)  # 1 to 5
    academic_pressure = Column(Integer, nullable=True)  # 1 to 5
    social_interaction = Column(Integer, nullable=True)  # 1 to 5
    private_note = Column(Text, nullable=True)  # Strictly private to student!
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    student = relationship("User", back_populates="checkins")

    __table_args__ = (
        UniqueConstraint("student_id", "date", name="uq_student_date_checkin"),
    )

