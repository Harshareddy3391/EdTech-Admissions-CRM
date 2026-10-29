"""
Pydantic schemas for data validation and API request/response serialization.
"""
from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel, EmailStr, Field

# ---------------------------------------------------------------------------
# Course Schemas
# ---------------------------------------------------------------------------
class CourseBase(BaseModel):
    code: str
    title: str
    department: str
    level: str
    duration_weeks: int
    tuition_fee: float
    max_seats: int
    enrolled_seats: int
    next_cohort_date: date
    delivery_mode: str
    prerequisites: Optional[str] = None
    is_active: bool = True

class CourseResponse(CourseBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Counselor Schemas
# ---------------------------------------------------------------------------
class CounselorBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    role: str
    department: str
    target_enrollments: int
    active_leads_count: int
    avatar_color: str
    is_active: bool = True

class CounselorResponse(CounselorBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Activity & Task Schemas
# ---------------------------------------------------------------------------
class ActivityCreate(BaseModel):
    activity_type: str = Field(..., description="CALL, EMAIL, WHATSAPP, COUNSELING_DEMO, NOTE, STATUS_CHANGE")
    summary: str
    details: Optional[str] = None
    outcome: Optional[str] = None
    counselor_id: Optional[str] = None

class ActivityResponse(BaseModel):
    id: str
    inquiry_id: str
    counselor_id: Optional[str] = None
    activity_type: str
    summary: str
    details: Optional[str] = None
    outcome: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class FollowUpTaskResponse(BaseModel):
    id: str
    inquiry_id: str
    counselor_id: str
    title: str
    due_date: date
    priority: str
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Inquiry Schemas
# ---------------------------------------------------------------------------
class InquiryCreate(BaseModel):
    student_name: str
    email: EmailStr
    phone: str
    city: str
    highest_qualification: str
    current_status: str
    course_id: str
    preferred_batch: str
    lead_source: Optional[str] = "Website Inquiry Form"
    tuition_budget: Optional[str] = "Self-Funded / Immediate"
    scholarship_applied: bool = False
    notes: Optional[str] = None

class InquiryStageUpdate(BaseModel):
    stage: str = Field(..., description="NEW, CONTACTED, COUNSELING_SCHEDULED, APPLICATION_SUBMITTED, ENROLLED, DROPPED")
    dropped_reason: Optional[str] = None
    enrolled_at: Optional[datetime] = None
    demo_scheduled_at: Optional[datetime] = None

class InquiryCounselorUpdate(BaseModel):
    assigned_counselor_id: str

class InquiryResponse(BaseModel):
    id: str
    tracking_code: str
    student_name: str
    email: str
    phone: str
    city: str
    highest_qualification: str
    current_status: str
    course_id: str
    preferred_batch: str
    lead_source: str
    stage: str
    lead_score: int
    assigned_counselor_id: Optional[str] = None
    tuition_budget: str
    scholarship_applied: bool
    demo_scheduled_at: Optional[datetime] = None
    enrolled_at: Optional[datetime] = None
    dropped_reason: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    course: Optional[CourseResponse] = None
    counselor: Optional[CounselorResponse] = None
    activities: List[ActivityResponse] = []
    tasks: List[FollowUpTaskResponse] = []

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Analytics Schemas
# ---------------------------------------------------------------------------
class StageCount(BaseModel):
    stage: str
    count: int
    conversion_rate_pct: float

class LeadSourceMetric(BaseModel):
    source: str
    count: int
    percentage: float

class CounselorPerformance(BaseModel):
    counselor_id: str
    name: str
    assigned_leads: int
    enrolled_leads: int
    conversion_rate_pct: float
    avg_response_hours: float

class AnalyticsDashboardResponse(BaseModel):
    total_inquiries: int
    active_inquiries: int
    total_enrolled: int
    conversion_rate_pct: float
    funnel_stages: List[StageCount]
    sources: List[LeadSourceMetric]
    counselor_performance: List[CounselorPerformance]
    total_pipeline_value: float
    confirmed_revenue: float
