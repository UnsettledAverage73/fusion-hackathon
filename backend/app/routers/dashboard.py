from datetime import date, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_student
from app.database import get_db
from app.models.checkin import CheckIn
from app.models.signal import SupportSignal
from app.models.user import User
from app.schemas.dashboard import (
    DashboardSummaryResponse,
    DashboardTrendsResponse,
    DayTrendItem,
    TodayStatus,
)
from app.services.pattern_engine import (
    calculate_checkin_streak,
    calculate_stress_trend,
    evaluate_pattern,
    generate_wellbeing_insight,
)

router = APIRouter()


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
    summary="Get student dashboard summary",
    description="Calculates today's check-in status, streak, trend, weekly average, and non-diagnostic insight.",
)
def get_dashboard_summary(
    student: User = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    today = date.today()
    checkins = db.query(CheckIn).filter(
        CheckIn.student_id == student.id
    ).order_by(CheckIn.date.desc()).all()

    # Today's status
    today_entry = next((c for c in checkins if c.date == today), None)
    today_status = TodayStatus(
        completed=today_entry is not None,
        mood=today_entry.mood if today_entry else None,
        stress_level=today_entry.stress_level if today_entry else None,
        sleep_quality=today_entry.sleep_quality if today_entry else None,
    )

    streak = calculate_checkin_streak(checkins, today)
    trend = calculate_stress_trend(checkins)

    # Weekly stats
    last_7_days = today - timedelta(days=7)
    week_checkins = [c for c in checkins if c.date >= last_7_days]
    week_count = len(week_checkins)

    if week_checkins:
        avg_stress = round(sum(c.stress_level for c in week_checkins) / week_count, 1)
    else:
        avg_stress = 2.5

    # Check high stress streak
    has_signal, _, _ = evaluate_pattern(checkins)

    # Check active support signal in DB
    active_signal = db.query(SupportSignal).filter(
        SupportSignal.student_id == student.id,
        SupportSignal.status == "active",
    ).first()

    high_streak = 0
    for c in checkins:
        if c.stress_level >= 4:
            high_streak += 1
        else:
            break

    insight = generate_wellbeing_insight(
        has_signal=has_signal or (active_signal is not None),
        trend=trend,
        avg_stress=avg_stress,
        high_stress_streak=high_streak,
    )

    first_name = student.name.split()[0] if student.name else "Student"

    return DashboardSummaryResponse(
        student_name=first_name,
        today_status=today_status,
        streak_days=streak,
        stress_trend=trend,
        average_stress=avg_stress,
        week_checkins_count=week_count,
        wellbeing_insight=insight,
    )


@router.get(
    "/trends",
    response_model=DashboardTrendsResponse,
    summary="Get 7-day mood and stress trend progression",
)
def get_dashboard_trends(
    student: User = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    today = date.today()
    checkins = db.query(CheckIn).filter(
        CheckIn.student_id == student.id
    ).order_by(CheckIn.date.desc()).all()

    # Map past 7 calendar days
    history_7d = []
    checkins_by_date = {c.date: c for c in checkins}

    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        day_str = d.strftime("%a")  # Mon, Tue, etc.
        entry = checkins_by_date.get(d)
        if entry:
            history_7d.append(
                DayTrendItem(
                    day=day_str,
                    date=d.isoformat(),
                    mood=entry.mood,
                    stress=entry.stress_level,
                    sleep=entry.sleep_quality,
                )
            )
        else:
            history_7d.append(
                DayTrendItem(
                    day=day_str,
                    date=d.isoformat(),
                    mood="neutral",
                    stress=0,
                    sleep=0,
                )
            )

    trend = calculate_stress_trend(checkins)

    # Active signal
    active_signal = db.query(SupportSignal).filter(
        SupportSignal.student_id == student.id,
        SupportSignal.status == "active",
    ).first()

    high_streak = 0
    for c in checkins:
        if c.stress_level >= 4:
            high_streak += 1
        else:
            break

    return DashboardTrendsResponse(
        history_7d=history_7d,
        stress_trend=trend,
        high_stress_streak=high_streak,
        support_signal_active=active_signal is not None,
    )
