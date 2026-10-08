from datetime import date, datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple
from app.models.checkin import CheckIn


def calculate_checkin_streak(checkins: List[CheckIn], today: Optional[date] = None) -> int:
    """Calculates consecutive active check-in days backwards from today or yesterday."""
    if not checkins:
        return 0
    if today is None:
        today = date.today()

    checkin_dates = set()
    for c in checkins:
        d = c.date if isinstance(c.date, date) else date.fromisoformat(c.date)
        checkin_dates.add(d)

    curr = today
    if curr not in checkin_dates:
        curr = today - timedelta(days=1)
        if curr not in checkin_dates:
            return 0

    streak = 0
    while curr in checkin_dates:
        streak += 1
        curr -= timedelta(days=1)
    return streak


def calculate_stress_trend(checkins: List[CheckIn]) -> str:
    """Computes stress trajectory: 'increasing', 'improving', or 'stable'."""
    if len(checkins) < 2:
        return "stable"

    sorted_items = sorted(
        checkins,
        key=lambda x: x.date if isinstance(x.date, date) else date.fromisoformat(x.date),
    )
    scores = [c.stress_level for c in sorted_items]

    mid = len(scores) // 2
    first_half = sum(scores[:mid]) / max(mid, 1)
    second_half = sum(scores[mid:]) / max(len(scores) - mid, 1)

    diff = second_half - first_half
    if diff >= 0.5:
        return "increasing"
    elif diff <= -0.5:
        return "improving"
    return "stable"


def evaluate_pattern(
    checkins: List[CheckIn],
) -> Tuple[bool, Optional[str], Optional[Tuple[date, date]]]:
    """
    Evaluates if student has reported stress >= 4 for 3 or more consecutive calendar entries.
    Returns (has_signal, reason, (from_date, to_date)).
    """
    if not checkins:
        return False, None, None

    sorted_items = sorted(
        checkins,
        key=lambda x: x.date if isinstance(x.date, date) else date.fromisoformat(x.date),
    )

    max_streak = 0
    current_streak = 0
    streak_start = None
    streak_end = None
    active_streak_start = None

    for item in sorted_items:
        item_date = item.date if isinstance(item.date, date) else date.fromisoformat(item.date)
        if item.stress_level >= 4:
            current_streak += 1
            if current_streak == 1:
                active_streak_start = item_date
            if current_streak >= 3:
                max_streak = current_streak
                streak_start = active_streak_start
                streak_end = item_date
        else:
            current_streak = 0
            active_streak_start = None

    if max_streak >= 3 and streak_start and streak_end:
        reason = f"High stress (>= 4) reported for {max_streak} consecutive days"
        return True, reason, (streak_start, streak_end)

    return False, None, None


def analyze_consecutive_high_stress(
    checkins: List[CheckIn],
) -> Tuple[bool, int, Optional[str], List[int]]:
    """Legacy helper returning (support_signal, streak_count, date_range_str, recent_levels)."""
    if not checkins:
        return False, 0, None, []

    sorted_items = sorted(
        checkins,
        key=lambda x: x.date if isinstance(x.date, date) else date.fromisoformat(x.date),
    )

    max_streak = 0
    current_streak = 0
    streak_start = None
    streak_end = None
    active_streak_start = None
    streak_levels: List[int] = []
    active_streak_levels: List[int] = []

    for item in sorted_items:
        item_date = item.date if isinstance(item.date, date) else date.fromisoformat(item.date)
        if item.stress_level >= 4:
            current_streak += 1
            if current_streak == 1:
                active_streak_start = item_date
            active_streak_levels.append(item.stress_level)
            if current_streak >= 3:
                max_streak = current_streak
                streak_start = active_streak_start
                streak_end = item_date
                streak_levels = list(active_streak_levels)
        else:
            current_streak = 0
            active_streak_start = None
            active_streak_levels = []

    date_range_str = None
    if streak_start and streak_end:
        d1 = streak_start.strftime("%b %d")
        d2 = streak_end.strftime("%b %d")
        date_range_str = f"{d1} – {d2}" if d1 != d2 else d1

    support_signal = max_streak >= 3
    return support_signal, max_streak, date_range_str, streak_levels


def generate_wellbeing_insight(
    support_signal: bool = False,
    streak: int = 0,
    trend: str = "stable",
    avg_stress: float = 2.5,
    has_signal: bool = False,
    high_stress_streak: int = 0,
    **kwargs: Any,
) -> str:
    """Generates non-diagnostic, supportive recommendations."""
    flagged = support_signal or has_signal
    active_streak = streak or high_stress_streak

    if flagged:
        prefix = "Elevated stress pattern detected"
        if active_streak >= 3:
            prefix += f" for {active_streak} consecutive days"
        return (
            f"{prefix}. Consider taking a short break, talking to someone you trust, "
            "or reaching out to your campus support services."
        )

    if "increas" in trend.lower():
        return (
            "Your stress has been trending upward this week. "
            "Try scheduling small moments of rest or light movement between study sessions."
        )
    if "improv" in trend.lower() or "decreas" in trend.lower():
        return "Your stress levels have been steadily improving this week. Keep up the restorative habits!"

    if avg_stress <= 2.5:
        return "You are maintaining a calm, balanced routine. Great job taking care of your wellbeing!"

    return "Consistent daily check-ins help you build self-awareness and notice patterns before burnout sets in."

