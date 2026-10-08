from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.seeder import seed_wellbeing_demo_data

router = APIRouter()


@router.post("", summary="Reset and seed demo hackathon data")
def seed_demo_data(db: Session = Depends(get_db)):
    """
    Seeds comprehensive realistic hackathon demo data per API_CONTRACT.md.
    Pre-seeds:
    - student@codeforge.local (Atharva Dev - 7-day escalating stress, 3-day active signal)
    - priya@codeforge.local (Priya Patel - steady/improving)
    - staff@codeforge.local (Dr. Radhika Sharma - Staff counselor)
    """
    seed_wellbeing_demo_data(db)
    return {
        "message": "Demo data successfully seeded!",
        "accounts": [
            {"email": "student@codeforge.local", "password": "student123", "role": "student", "state": "High stress streak"},
            {"email": "priya@codeforge.local", "password": "student123", "role": "student", "state": "Improving / Calm"},
            {"email": "staff@codeforge.local", "password": "staff123", "role": "staff", "state": "Staff counselor"},
        ],
    }

