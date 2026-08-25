from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.models.user import User, UserRole
from app.models.faculty import Faculty
from app.models.student import Student
from app.utils.dependencies import RoleChecker, get_current_user
from app.schemas.course import CourseCreate, CourseResponse
from app.schemas.enrollment import EnrollmentCreate, EnrollmentResponse
from app.schemas.timetable import TimetableCreate, TimetableResponse
from app.services import course_service

router = APIRouter(
    prefix="/api/courses",
    tags=["Courses"]
)

@router.get("", response_model=List[CourseResponse])
def get_courses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get courses scoped by user role:
    - ADMIN: all courses
    - FACULTY: courses they are assigned to teach
    - STUDENT: courses they are enrolled in
    """
    if current_user.role == UserRole.ADMIN:
        return course_service.get_all_courses(db)
    elif current_user.role == UserRole.FACULTY:
        faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
        if not faculty:
            return []
        return course_service.get_courses_for_faculty(db, faculty.id)
    elif current_user.role == UserRole.STUDENT:
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if not student:
            return []
        return course_service.get_courses_for_student(db, student.id)
    
    return []

@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(RoleChecker([UserRole.ADMIN]))])
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    return course_service.create_course(db, course)

@router.post("/assign", response_model=TimetableResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(RoleChecker([UserRole.ADMIN]))])
def assign_faculty(assignment: TimetableCreate, db: Session = Depends(get_db)):
    """
    Assign a faculty to a course (creates a timetable slot).
    """
    return course_service.assign_faculty(db, assignment)

@router.post("/enroll", response_model=EnrollmentResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(RoleChecker([UserRole.ADMIN]))])
def enroll_student(enrollment: EnrollmentCreate, db: Session = Depends(get_db)):
    """
    Enroll a student in a course.
    """
    return course_service.enroll_student(db, enrollment)
