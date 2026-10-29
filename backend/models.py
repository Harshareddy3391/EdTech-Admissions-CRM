"""
SQLAlchemy ORM Models representing database entities in EdTech CRM.
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(String(36), primary_key=True, index=True)
    code = Column(String(20), unique=True, nullable=False)
    title = Column(String(150), nullable=False)
    department = Column(String(100), nullable=False)
    level = Column(String(50), default="Beginner to Intermediate")
    duration_weeks = Column(Integer, nullable=False)
    tuition_fee = Column(Float, nullable=False)
    max_seats = Column(Integer, default=40)
    enrolled_seats = Column(Integer, default=0)
    next_cohort_date = Column(Date, nullable=False)
    delivery_mode = Column(String(50), default="Hybrid / Live Online")
    prerequisites = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    inquiries = relationship("Inquiry", back_populates="course")


class Counselor(Base):
    __tablename__ = "counselors"

    id = Column(String(36), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    phone = Column(String(30), nullable=False)
    role = Column(String(50), default="Senior Admissions Counselor")
    department = Column(String(100), default="Admissions & Student Success")
    target_enrollments = Column(Integer, default=15)
    active_leads_count = Column(Integer, default=0)
    avatar_color = Column(String(20), default="#1e3a8a")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    inquiries = relationship("Inquiry", back_populates="counselor")
    activities = relationship("InquiryActivity", back_populates="counselor")
    tasks = relationship("FollowUpTask", back_populates="counselor")


class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(String(36), primary_key=True, index=True)
    tracking_code = Column(String(30), unique=True, nullable=False, index=True)
    student_name = Column(String(120), nullable=False)
    email = Column(String(120), nullable=False)
    phone = Column(String(30), nullable=False)
    city = Column(String(100), nullable=False)
    highest_qualification = Column(String(100), nullable=False)
    current_status = Column(String(80), default="Final Year Student")
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False, index=True)
    preferred_batch = Column(String(50), default="Weekend Intensive")
    lead_source = Column(String(60), default="Website Inquiry Form", index=True)
    stage = Column(String(40), default="NEW", index=True)
    lead_score = Column(Integer, default=50)
    assigned_counselor_id = Column(String(36), ForeignKey("counselors.id"), nullable=True, index=True)
    tuition_budget = Column(String(50), default="Self-Funded / Immediate")
    scholarship_applied = Column(Boolean, default=False)
    demo_scheduled_at = Column(DateTime, nullable=True)
    enrolled_at = Column(DateTime, nullable=True)
    dropped_reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    course = relationship("Course", back_populates="inquiries")
    counselor = relationship("Counselor", back_populates="inquiries")
    activities = relationship("InquiryActivity", back_populates="inquiry", cascade="all, delete-orphan")
    tasks = relationship("FollowUpTask", back_populates="inquiry", cascade="all, delete-orphan")


class InquiryActivity(Base):
    __tablename__ = "inquiry_activities"

    id = Column(String(36), primary_key=True, index=True)
    inquiry_id = Column(String(36), ForeignKey("inquiries.id", ondelete="CASCADE"), nullable=False, index=True)
    counselor_id = Column(String(36), ForeignKey("counselors.id", ondelete="SET NULL"), nullable=True)
    activity_type = Column(String(40), nullable=False) # CALL, EMAIL, WHATSAPP, COUNSELING_DEMO, NOTE, STATUS_CHANGE
    summary = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    outcome = Column(String(80), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    inquiry = relationship("Inquiry", back_populates="activities")
    counselor = relationship("Counselor", back_populates="activities")


class FollowUpTask(Base):
    __tablename__ = "follow_up_tasks"

    id = Column(String(36), primary_key=True, index=True)
    inquiry_id = Column(String(36), ForeignKey("inquiries.id", ondelete="CASCADE"), nullable=False, index=True)
    counselor_id = Column(String(36), ForeignKey("counselors.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    due_date = Column(Date, nullable=False)
    priority = Column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH, URGENT
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    inquiry = relationship("Inquiry", back_populates="tasks")
    counselor = relationship("Counselor", back_populates="tasks")
