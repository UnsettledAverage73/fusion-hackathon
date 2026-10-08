from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.models.checkin import CheckIn
from app.models.signal import SupportSignal
from app.models.user import User


def seed_wellbeing_demo_data(db: Session) -> None:
    """Seed hackathon demo accounts, 7-day check-in histories, and support signals."""
    # 1. Staff Account
    staff = db.query(User).filter(User.email == "staff@codeforge.local").first()
    if not staff:
        staff = User(
            id="usr-staff-01",
            name="Dr. Radhika Sharma",
            email="staff@codeforge.local",
            password_hash=hash_password("staff123"),
            role="staff",
        )
        db.add(staff)
        db.commit()

    # 2. Student Account (Atharva) with 3-Day High Stress Escalation
    student_atharva = db.query(User).filter(User.email == "student@codeforge.local").first()
    if not student_atharva:
        student_atharva = User(
            id="usr-student-01",
            name="Atharva Dev",
            email="student@codeforge.local",
            password_hash=hash_password("student123"),
            role="student",
        )
        db.add(student_atharva)
        db.commit()

        # Generate 7-day sequence ending today
        today = date.today()
        history = [
            (today - timedelta(days=6), "good", 2, 3, 4, 3, 2, 4, "Feeling energetic and on top of lectures."),
            (today - timedelta(days=5), "neutral", 3, 2, 3, 3, 3, 3, "Normal classes, minor assignment workload."),
            (today - timedelta(days=4), "neutral", 3, 2, 3, 2, 3, 3, "Started prep for system design midterm."),
            (today - timedelta(days=3), "low", 4, 2, 2, 2, 4, 2, "Long lab hours and falling behind on reading."),
            (today - timedelta(days=2), "very_low", 5, 1, 2, 1, 5, 1, "Pulled an all-nighter for project checkpoint."),
            (today - timedelta(days=1), "low", 4, 1, 2, 1, 5, 1, "Back-to-back presentations and high tension."),
            (today, "very_low", 5, 1, 1, 1, 5, 1, "Final code submission due tonight. Feeling overwhelmed."),
        ]

        for entry_date, mood, stress, sleep, nutr, phys, acad, soc, note in history:
            checkin = CheckIn(
                student_id=student_atharva.id,
                date=entry_date,
                mood=mood,
                stress_level=stress,
                sleep_quality=sleep,
                nutrition=nutr,
                physical_activity=phys,
                academic_pressure=acad,
                social_interaction=soc,
                private_note=note,
            )
            db.add(checkin)

        # Trigger Support Signal for Atharva
        signal = SupportSignal(
            student_id=student_atharva.id,
            date_from=today - timedelta(days=2),
            date_to=today,
            signal_type="high_stress_streak",
            reason="High stress (>= 4) reported for 3 consecutive days",
            status="active",
        )
        db.add(signal)
        db.commit()

    # 3. Student Account (Priya) with Steady / Improving Trajectory
    student_priya = db.query(User).filter(User.email == "priya@codeforge.local").first()
    if not student_priya:
        student_priya = User(
            id="usr-student-02",
            name="Priya Patel",
            email="priya@codeforge.local",
            password_hash=hash_password("student123"),
            role="student",
        )
        db.add(student_priya)
        db.commit()

        today = date.today()
        priya_history = [
            (today - timedelta(days=4), "low", 4, 2, 3, 2, 4, 2, "Midterm week starting."),
            (today - timedelta(days=3), "neutral", 3, 2, 3, 3, 3, 3, "Study group helped a lot."),
            (today - timedelta(days=2), "neutral", 3, 3, 3, 3, 3, 4, "Submitted report on time."),
            (today - timedelta(days=1), "good", 2, 3, 4, 4, 2, 4, "Relaxing weekend review."),
            (today, "great", 2, 3, 4, 4, 2, 5, "Excited for hackathon presentations!"),
        ]

        for entry_date, mood, stress, sleep, nutr, phys, acad, soc, note in priya_history:
            checkin = CheckIn(
                student_id=student_priya.id,
                date=entry_date,
                mood=mood,
                stress_level=stress,
                sleep_quality=sleep,
                nutrition=nutr,
                physical_activity=phys,
                academic_pressure=acad,
                social_interaction=soc,
                private_note=note,
            )
            db.add(checkin)
        db.commit()
