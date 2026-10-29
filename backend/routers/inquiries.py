"""
Inquiries & Admissions Pipeline Router for EdTech CRM FastAPI Backend.
"""
import uuid
import random
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Inquiry, Course, Counselor, InquiryActivity, FollowUpTask
from backend.schemas import (
    InquiryCreate,
    InquiryResponse,
    InquiryStageUpdate,
    InquiryCounselorUpdate,
    ActivityCreate,
    ActivityResponse
)

router = APIRouter(prefix="/api/inquiries", tags=["Inquiries"])

def calculate_initial_lead_score(inquiry: InquiryCreate) -> int:
    """
    Transparent 4-dimensional lead scoring algorithm:
    1. Academic & Background Match (max 25)
    2. Urgency & Preferred Timing (max 25)
    3. Budget / Financial Readiness (max 25)
    4. Contact completeness & notes depth (max 25)
    """
    score = 40 # Base baseline score

    # Factor 1: Qualification fit
    qual = (inquiry.highest_qualification or "").lower()
    if any(k in qual for k in ["b.s.", "b.tech", "computer science", "engineering", "m.s."]):
        score += 20
    elif any(k in qual for k in ["degree", "diploma", "bca", "b.a."]):
        score += 15
    else:
        score += 10

    # Factor 2: Budget readiness
    budget = (inquiry.tuition_budget or "").lower()
    if "self-funded" in budget or "immediate" in budget or "company" in budget:
        score += 20
    elif "installment" in budget:
        score += 15
    else:
        score += 10

    # Factor 3: Application completeness & notes
    if inquiry.notes and len(inquiry.notes) > 30:
        score += 10
    if inquiry.scholarship_applied:
        score += 5

    return min(max(score, 20), 99)


@router.get("", response_model=List[InquiryResponse])
def get_inquiries(
    stage: Optional[str] = Query(None, description="Filter by stage"),
    course_id: Optional[str] = Query(None, description="Filter by course ID"),
    counselor_id: Optional[str] = Query(None, description="Filter by assigned counselor ID"),
    search: Optional[str] = Query(None, description="Search by name, email, or tracking code"),
    db: Session = Depends(get_db)
):
    """List inquiries with optional multi-attribute filtering."""
    query = db.query(Inquiry)

    if stage and stage != "ALL":
        query = query.filter(Inquiry.stage == stage)
    if course_id and course_id != "ALL":
        query = query.filter(Inquiry.course_id == course_id)
    if counselor_id and counselor_id != "ALL":
        query = query.filter(Inquiry.assigned_counselor_id == counselor_id)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Inquiry.student_name.ilike(search_pattern)) |
            (Inquiry.email.ilike(search_pattern)) |
            (Inquiry.tracking_code.ilike(search_pattern)) |
            (Inquiry.city.ilike(search_pattern))
        )

    inquiries = query.order_by(Inquiry.created_at.desc()).all()
    return inquiries


@router.get("/track/{tracking_code}", response_model=InquiryResponse)
def track_inquiry(tracking_code: str, db: Session = Depends(get_db)):
    """Public portal status lookup by tracking code."""
    inquiry = db.query(Inquiry).filter(Inquiry.tracking_code == tracking_code.strip().upper()).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry tracking code not found")
    return inquiry


@router.get("/{inquiry_id}", response_model=InquiryResponse)
def get_inquiry(inquiry_id: str, db: Session = Depends(get_db)):
    """Get complete inquiry details, including activity history and counselor information."""
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry


@router.post("", response_model=InquiryResponse, status_code=201)
def create_inquiry(inquiry_data: InquiryCreate, db: Session = Depends(get_db)):
    """
    Public student inquiry submission endpoint.
    Creates new lead, calculates lead score, assigns next available counselor, and logs activity.
    """
    # Verify course exists
    course = db.query(Course).filter(Course.id == inquiry_data.course_id).first()
    if not course:
        raise HTTPException(status_code=400, detail="Invalid course ID selected")

    # Workload-balanced auto-assignment
    counselor = db.query(Counselor).filter(Counselor.is_active == True).order_by(Counselor.active_leads_count.asc()).first()
    counselor_id = counselor.id if counselor else None

    # Generate tracking code and unique ID
    unique_num = random.randint(1000, 9999)
    tracking_code = f"INQ-2026-{unique_num}"
    inquiry_id = f"inq_{uuid.uuid4().hex[:8]}"

    lead_score = calculate_initial_lead_score(inquiry_data)

    new_inquiry = Inquiry(
        id=inquiry_id,
        tracking_code=tracking_code,
        student_name=inquiry_data.student_name,
        email=inquiry_data.email,
        phone=inquiry_data.phone,
        city=inquiry_data.city,
        highest_qualification=inquiry_data.highest_qualification,
        current_status=inquiry_data.current_status,
        course_id=inquiry_data.course_id,
        preferred_batch=inquiry_data.preferred_batch,
        lead_source=inquiry_data.lead_source or "Website Inquiry Form",
        stage="NEW",
        lead_score=lead_score,
        assigned_counselor_id=counselor_id,
        tuition_budget=inquiry_data.tuition_budget or "Self-Funded / Immediate",
        scholarship_applied=inquiry_data.scholarship_applied,
        notes=inquiry_data.notes,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(new_inquiry)

    # Increment counselor active leads count
    if counselor:
        counselor.active_leads_count += 1

    # Log initial creation activity
    initial_activity = InquiryActivity(
        id=f"act_{uuid.uuid4().hex[:8]}",
        inquiry_id=inquiry_id,
        counselor_id=counselor_id,
        activity_type="STATUS_CHANGE",
        summary="Inquiry Submitted via Public Portal",
        details=f"Inquired for {course.title}. Preferred batch: {inquiry_data.preferred_batch}.",
        outcome="Lead Captured",
        created_at=datetime.utcnow()
    )
    db.add(initial_activity)

    db.commit()
    db.refresh(new_inquiry)
    return new_inquiry


@router.patch("/{inquiry_id}/stage", response_model=InquiryResponse)
def update_inquiry_stage(inquiry_id: str, stage_data: InquiryStageUpdate, db: Session = Depends(get_db)):
    """Move an inquiry across the 6 admissions funnel stages."""
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    old_stage = inquiry.stage
    new_stage = stage_data.stage

    inquiry.stage = new_stage
    inquiry.updated_at = datetime.utcnow()

    if stage_data.dropped_reason:
        inquiry.dropped_reason = stage_data.dropped_reason
    if stage_data.enrolled_at:
        inquiry.enrolled_at = stage_data.enrolled_at
    elif new_stage == "ENROLLED" and not inquiry.enrolled_at:
        inquiry.enrolled_at = datetime.utcnow()
        # Increment course enrolled seats
        if inquiry.course:
            inquiry.course.enrolled_seats += 1

    if stage_data.demo_scheduled_at:
        inquiry.demo_scheduled_at = stage_data.demo_scheduled_at

    # Audit log entry for stage transition
    activity = InquiryActivity(
        id=f"act_{uuid.uuid4().hex[:8]}",
        inquiry_id=inquiry_id,
        counselor_id=inquiry.assigned_counselor_id,
        activity_type="STATUS_CHANGE",
        summary=f"Funnel Stage Changed: {old_stage} ➔ {new_stage}",
        details=stage_data.dropped_reason or "Stage advanced by counselor in Admissions Pipeline.",
        outcome=new_stage,
        created_at=datetime.utcnow()
    )
    db.add(activity)

    db.commit()
    db.refresh(inquiry)
    return inquiry


@router.patch("/{inquiry_id}/counselor", response_model=InquiryResponse)
def reassign_counselor(inquiry_id: str, update_data: InquiryCounselorUpdate, db: Session = Depends(get_db)):
    """Reassign an inquiry to a different counselor."""
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    new_counselor = db.query(Counselor).filter(Counselor.id == update_data.assigned_counselor_id).first()
    if not new_counselor:
        raise HTTPException(status_code=404, detail="Target counselor not found")

    old_counselor_name = inquiry.counselor.name if inquiry.counselor else "Unassigned"
    inquiry.assigned_counselor_id = new_counselor.id
    inquiry.updated_at = datetime.utcnow()

    # Log reassignment activity
    activity = InquiryActivity(
        id=f"act_{uuid.uuid4().hex[:8]}",
        inquiry_id=inquiry_id,
        counselor_id=new_counselor.id,
        activity_type="NOTE",
        summary=f"Lead Reassigned from {old_counselor_name} to {new_counselor.name}",
        details="Counselor workload reallocation.",
        outcome="Reassigned",
        created_at=datetime.utcnow()
    )
    db.add(activity)

    db.commit()
    db.refresh(inquiry)
    return inquiry


@router.post("/{inquiry_id}/activities", response_model=ActivityResponse)
def add_activity(inquiry_id: str, act_data: ActivityCreate, db: Session = Depends(get_db)):
    """Log a counselor touchpoint (Call, WhatsApp, Email, Counseling Demo, or Note)."""
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    activity = InquiryActivity(
        id=f"act_{uuid.uuid4().hex[:8]}",
        inquiry_id=inquiry_id,
        counselor_id=act_data.counselor_id or inquiry.assigned_counselor_id,
        activity_type=act_data.activity_type,
        summary=act_data.summary,
        details=act_data.details,
        outcome=act_data.outcome,
        created_at=datetime.utcnow()
    )
    db.add(activity)

    # Slight score boost for active engagement
    if inquiry.lead_score < 95:
        inquiry.lead_score += 2

    inquiry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(activity)
    return activity
