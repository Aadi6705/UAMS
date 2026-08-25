from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List
from datetime import time

from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.timetable import Timetable
from app.schemas.course import CourseCreate
from app.schemas.enrollment import EnrollmentCreate
from app.schemas.timetable import TimetableCreate

def get_all_courses(db: Session) -> List[Course]:
    return db.query(Course).all()

def create_course(db: Session, course: CourseCreate) -> Course:
    db_course = db.query(Course).filter(Course.course_code == course.course_code).first()
    if db_course:
        raise HTTPException(status_code=400, detail="Course code already exists")
    
    new_course = Course(**course.model_dump())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

def assign_faculty(db: Session, assignment: TimetableCreate) -> Timetable:
    # Check if already assigned for this specific time slot
    existing = db.query(Timetable).filter(
        Timetable.course_id == assignment.course_id,
        Timetable.faculty_id == assignment.faculty_id,
        Timetable.day == assignment.day,
        Timetable.start_time == assignment.start_time
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Faculty already assigned to this slot")
        
    new_assignment = Timetable(**assignment.model_dump())
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    return new_assignment

def enroll_student(db: Session, enrollment: EnrollmentCreate) -> Enrollment:
    # Check if already enrolled
    existing = db.query(Enrollment).filter(
        Enrollment.student_id == enrollment.student_id,
        Enrollment.course_id == enrollment.course_id,
        Enrollment.academic_year == enrollment.academic_year,
        Enrollment.semester == enrollment.semester
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Student already enrolled in this course for this semester")
        
    new_enrollment = Enrollment(**enrollment.model_dump())
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return new_enrollment

def get_courses_for_faculty(db: Session, faculty_id: int) -> List[Course]:
    # Distinct courses assigned to this faculty
    timetables = db.query(Timetable).filter(Timetable.faculty_id == faculty_id).all()
    # Extract unique courses
    course_ids = set([t.course_id for t in timetables])
    courses = db.query(Course).filter(Course.id.in_(course_ids)).all()
    return courses

def get_courses_for_student(db: Session, student_id: int) -> List[Course]:
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).all()
    course_ids = [e.course_id for e in enrollments]
    courses = db.query(Course).filter(Course.id.in_(course_ids)).all()
    return courses
