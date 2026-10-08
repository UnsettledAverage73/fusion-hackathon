from typing import List, Optional
from pydantic import BaseModel
from app.schemas.checkin import CheckInResponse


class TodayStatus(BaseModel):
    completed: bool
    mood: Optional[str] = None
    stress_level: Optional[int] = None
    sleep_quality: Optional[int] = None


class DayTrendItem(BaseModel):
    day: str
    date: str
    mood: str
    stress: int
    sleep: Optional[int] = None


class DashboardSummaryResponse(BaseModel):
    student_name: str
    today_status: TodayStatus
    streak_days: int
    stress_trend: str
    average_stress: float
    week_checkins_count: int
    wellbeing_insight: str


class DashboardTrendsResponse(BaseModel):
    history_7d: List[DayTrendItem]
    stress_trend: str
    high_stress_streak: int
    support_signal_active: bool


# Compatibility aliases
TrendDay = DayTrendItem


class StudentDashboardResponse(BaseModel):
    student_id: str
    student_name: str
    today_completed: bool
    today_checkin: Optional[CheckInResponse] = None
    trends_7d: List[TrendDay]
    avg_stress_7d: float
    stress_trend: str
    consecutive_high_stress_days: int
    support_signal: bool
    wellbeing_insight: str

