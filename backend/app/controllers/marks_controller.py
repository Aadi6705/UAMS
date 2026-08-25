from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.models.user import User, UserRole
from app.models.faculty import Faculty
from app.models.student import Student
from app.utils.dependencies import RoleChecker, get_current_user
from app.schemas.marks import MarksCreate, MarksResponse, StudentCGPAResponse
from app.services import marks_service

router = APIRouter(
    prefix="/api/marks",
    tags=["Marks"]
)

@router.post("", response_model=MarksResponse, dependencies=[Depends(RoleChecker([UserRole.FACULTY]))])
def upload_marks(marks_data: MarksCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if not faculty:
        raise HTTPException(status_code=403, detail="Only faculty can upload marks")
    return marks_service.upload_marks(db, faculty.id, marks_data)

@router.get("/student/dashboard", response_model=StudentCGPAResponse, dependencies=[Depends(RoleChecker([UserRole.STUDENT]))])
def get_student_cgpa_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return marks_service.get_cgpa_for_student(db, student.id)
