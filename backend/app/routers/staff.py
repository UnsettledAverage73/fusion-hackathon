from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.security import get_current_staff
from app.models.user import User
from app.models.checkin import CheckIn
from app.models.signal import SupportSignal
from app.schemas.signal import SupportSignalResponse, UpdateSignalStatusRequest
from app.services.pattern_engine import evaluate_pattern

router = APIRouter()


@router.get("/support-signals", response_model=List[SupportSignalResponse])
def get_flagged_students(
    db: Session = Depends(get_db),
    current_staff: User = Depends(get_current_staff),
):
    """
    Evaluates ALL students across the institution and returns active support signals
    for students flagged with 3+ consecutive high stress days.

    PRIVACY GUARANTEE:
    Only student identification, date ranges, and reason metrics are returned.
    ZERO personal notes or reflections are EVER exposed to the staff endpoint!
    """
    # Scan students to ensure any newly qualified signals are recorded
    students = db.query(User).filter(User.role == "student").all()
    for student in students:
        checkins = (
            db.query(CheckIn)
            .filter(CheckIn.student_id == student.id)
            .order_by(CheckIn.date.asc())
            .all()
        )
        has_signal, reason, dates = evaluate_pattern(checkins)
        if has_signal and dates:
            existing = (
                db.query(SupportSignal)
                .filter(
                    SupportSignal.student_id == student.id,
                    SupportSignal.status == "active",
                )
                .first()
            )
            if not existing:
                sig = SupportSignal(
                    student_id=student.id,
                    date_from=dates[0],
                    date_to=dates[1],
                    signal_type="high_stress_streak",
                    reason=reason or "High stress (>= 4) reported for 3 consecutive days",
                    status="active",
                )
                db.add(sig)
                db.commit()

    # Query all support signals
    signals = db.query(SupportSignal).order_by(SupportSignal.created_at.desc()).all()
    results = []
    for s in signals:
        student = s.student or db.query(User).filter(User.id == s.student_id).first()
        results.append(
            SupportSignalResponse(
                id=s.id,
                student_id=s.student_id,
                student_name=student.name if student else "Student",
                student_email=student.email if student else "",
                date_from=s.date_from,
                date_to=s.date_to,
                signal_type=s.signal_type,
                reason=s.reason,
                status=s.status,
                created_at=s.created_at,
            )
        )
    return results


@router.get("/support-signals/{signal_id}", response_model=SupportSignalResponse)
def get_signal_by_id(
    signal_id: int,
    db: Session = Depends(get_db),
    current_staff: User = Depends(get_current_staff),
):
    s = db.query(SupportSignal).filter(SupportSignal.id == signal_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Support signal not found")
    student = s.student or db.query(User).filter(User.id == s.student_id).first()
    return SupportSignalResponse(
        id=s.id,
        student_id=s.student_id,
        student_name=student.name if student else "Student",
        student_email=student.email if student else "",
        date_from=s.date_from,
        date_to=s.date_to,
        signal_type=s.signal_type,
        reason=s.reason,
        status=s.status,
        created_at=s.created_at,
    )


@router.put("/support-signals/{signal_id}/status", response_model=SupportSignalResponse)
def update_signal_status(
    signal_id: int,
    payload: UpdateSignalStatusRequest,
    db: Session = Depends(get_db),
    current_staff: User = Depends(get_current_staff),
):
    s = db.query(SupportSignal).filter(SupportSignal.id == signal_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Support signal not found")
    s.status = payload.status
    db.commit()
    db.refresh(s)
    student = s.student or db.query(User).filter(User.id == s.student_id).first()
    return SupportSignalResponse(
        id=s.id,
        student_id=s.student_id,
        student_name=student.name if student else "Student",
        student_email=student.email if student else "",
        date_from=s.date_from,
        date_to=s.date_to,
        signal_type=s.signal_type,
        reason=s.reason,
        status=s.status,
        created_at=s.created_at,
    )

