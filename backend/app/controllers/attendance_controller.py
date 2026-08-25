from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.config.database import get_db
from app.models.user import User, UserRole
from app.models.faculty import Faculty
from app.models.student import Student
from app.utils.dependencies import RoleChecker, get_current_user
from app.schemas.attendance import AttendanceBulkCreate, AttendanceResponse, StudentAttendanceDashboard
from app.schemas.student import StudentResponse
from app.services import attendance_service

router = APIRouter(
    prefix="/api/attendance",
    tags=["Attendance"]
)

@router.get("/courses/{course_id}/students", response_model=List[StudentResponse], dependencies=[Depends(RoleChecker([UserRole.FACULTY, UserRole.ADMIN]))])
def get_enrolled_students(course_id: int, db: Session = Depends(get_db)):
    return attendance_service.get_enrolled_students(db, course_id)

@router.get("/courses/{course_id}", response_model=List[AttendanceResponse], dependencies=[Depends(RoleChecker([UserRole.FACULTY, UserRole.ADMIN]))])
def get_attendance(course_id: int, target_date: date = Query(..., alias="date"), db: Session = Depends(get_db)):
    return attendance_service.get_attendance(db, course_id, target_date)

@router.post("", response_model=List[AttendanceResponse], dependencies=[Depends(RoleChecker([UserRole.FACULTY]))])
def mark_attendance(bulk_data: AttendanceBulkCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if not faculty:
        raise HTTPException(status_code=403, detail="Only faculty can mark attendance")
        
    return attendance_service.mark_attendance(db, faculty.id, bulk_data)

@router.get("/student/dashboard", response_model=StudentAttendanceDashboard, dependencies=[Depends(RoleChecker([UserRole.STUDENT]))])
def get_student_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    return attendance_service.calculate_student_dashboard(db, student.id)
