"""
Counselor Management Router for EdTech CRM FastAPI Backend.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Counselor
from backend.schemas import CounselorResponse

router = APIRouter(prefix="/api/counselors", tags=["Counselors"])

@router.get("", response_model=List[CounselorResponse])
def get_counselors(db: Session = Depends(get_db)):
    """Fetch all admissions counselors with active workloads."""
    counselors = db.query(Counselor).filter(Counselor.is_active == True).all()
    return counselors

@router.get("/{counselor_id}", response_model=CounselorResponse)
def get_counselor(counselor_id: str, db: Session = Depends(get_db)):
    """Fetch profile for a single counselor."""
    counselor = db.query(Counselor).filter(Counselor.id == counselor_id).first()
    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")
    return counselor
