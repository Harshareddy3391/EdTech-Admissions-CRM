"""
Course Catalog Router for EdTech CRM FastAPI Backend.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Course
from backend.schemas import CourseResponse

router = APIRouter(prefix="/api/courses", tags=["Courses"])

@router.get("", response_model=List[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    """Fetch all active educational courses and bootcamps."""
    courses = db.query(Course).filter(Course.is_active == True).all()
    return courses

@router.get("/{course_id}", response_model=CourseResponse)
def get_course(course_id: str, db: Session = Depends(get_db)):
    """Fetch details for a single course."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course
