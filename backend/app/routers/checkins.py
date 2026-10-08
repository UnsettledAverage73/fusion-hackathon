from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.checkin import CheckIn
from app.models.signal import SupportSignal
from app.schemas.checkin import CheckInCreate, CheckInResponse
from app.services.pattern_engine import evaluate_pattern

router = APIRouter()


@router.post("", response_model=CheckInResponse, status_code=status.HTTP_201_CREATED)
def submit_checkin(
    payload: CheckInCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Submits daily mood and stress check-in.
    Enforces 1 check-in per day per student: rejects duplicates with 409 Conflict.
    Triggers Pattern Engine to detect 3-day high stress streaks.
    """
    checkin_date = payload.date or date.today()
    if isinstance(checkin_date, str):
        checkin_date = date.fromisoformat(checkin_date)

    existing = (
        db.query(CheckIn)
        .filter(CheckIn.student_id == current_user.id, CheckIn.date == checkin_date)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A check-in for this date has already been submitted.",
        )

    checkin = CheckIn(
        student_id=current_user.id,
        date=checkin_date,
        mood=payload.mood,
        stress_level=payload.stress_level,
        sleep_quality=payload.sleep_quality,
        nutrition=payload.nutrition,
        physical_activity=payload.physical_activity,
        academic_pressure=payload.academic_pressure,
        social_interaction=payload.social_interaction,
        private_note=payload.private_note,
    )
    db.add(checkin)
    db.commit()
    db.refresh(checkin)

    # Fetch checkins for student to evaluate 3-day stress pattern
    all_checkins = (
        db.query(CheckIn)
        .filter(CheckIn.student_id == current_user.id)
        .order_by(CheckIn.date.asc())
        .all()
    )

    has_signal, reason, dates = evaluate_pattern(all_checkins)

    date_range_val = None
    if has_signal and dates:
        date_range_val = {"from": dates[0].isoformat(), "to": dates[1].isoformat()}
        existing_sig = (
            db.query(SupportSignal)
            .filter(
                SupportSignal.student_id == current_user.id,
                SupportSignal.status == "active",
            )
            .first()
        )
        if not existing_sig:
            sig = SupportSignal(
                student_id=current_user.id,
                date_from=dates[0],
                date_to=dates[1],
                signal_type="high_stress_streak",
                reason=reason or "High stress (>= 4) reported for 3 consecutive days",
                status="active",
            )
            db.add(sig)
            db.commit()
        else:
            existing_sig.date_to = dates[1]
            existing_sig.reason = reason or existing_sig.reason
            db.commit()

    resp = CheckInResponse.model_validate(checkin)
    resp.support_signal = has_signal
    resp.support_reason = reason if has_signal else None
    resp.date_range = date_range_val
    return resp


@router.get("", response_model=List[CheckInResponse])
def get_my_checkins(
    from_date: Optional[str] = Query(None, alias="from", description="Filter start date YYYY-MM-DD"),
    to_date: Optional[str] = Query(None, alias="to", description="Filter end date YYYY-MM-DD"),
    search: Optional[str] = Query(None, description="Search keyword in private notes"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieves check-in history for the authenticated student.
    Supports date range filtering and keyword search.
    """
    query = db.query(CheckIn).filter(CheckIn.student_id == current_user.id)

    if from_date:
        query = query.filter(CheckIn.date >= date.fromisoformat(from_date))
    if to_date:
        query = query.filter(CheckIn.date <= date.fromisoformat(to_date))
    if search:
        query = query.filter(CheckIn.private_note.ilike(f"%{search}%"))

    items = query.order_by(CheckIn.date.desc()).all()
    return items


@router.get("/{checkin_id}", response_model=CheckInResponse)
def get_checkin_by_id(
    checkin_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    RBAC Privacy check: A student can ONLY access their own check-in!
    """
    checkin = db.query(CheckIn).filter(CheckIn.id == checkin_id).first()
    if not checkin:
        raise HTTPException(status_code=404, detail="Check-in record not found")

    if checkin.student_id != current_user.id and current_user.role != "staff":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: You cannot access another student's check-in.",
        )

    return checkin


@router.delete("/{checkin_id}")
def delete_checkin(
    checkin_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    checkin = db.query(CheckIn).filter(CheckIn.id == checkin_id).first()
    if not checkin:
        raise HTTPException(status_code=404, detail="Check-in record not found")

    if checkin.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    db.delete(checkin)
    db.commit()
    return {"message": "Check-in deleted"}

