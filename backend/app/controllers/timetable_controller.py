from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.models.user import User, UserRole
from app.models.faculty import Faculty
from app.models.student import Student
from app.utils.dependencies import get_current_user
from app.schemas.timetable import TimetableResponse
from app.services import timetable_service

router = APIRouter(
    prefix="/api/timetable",
    tags=["Timetable"]
)

@router.get("", response_model=List[TimetableResponse])
def get_timetable(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == UserRole.ADMIN:
        return timetable_service.get_timetable_for_admin(db)
    elif current_user.role == UserRole.FACULTY:
        faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
        if not faculty: return []
        return timetable_service.get_timetable_for_faculty(db, faculty.id)
    elif current_user.role == UserRole.STUDENT:
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if not student: return []
        return timetable_service.get_timetable_for_student(db, student.id)
    return []
