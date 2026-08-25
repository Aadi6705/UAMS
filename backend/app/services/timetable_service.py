from sqlalchemy.orm import Session
from typing import List
from app.models.timetable import Timetable
from app.models.enrollment import Enrollment

def get_timetable_for_admin(db: Session) -> List[Timetable]:
    return db.query(Timetable).all()

def get_timetable_for_faculty(db: Session, faculty_id: int) -> List[Timetable]:
    return db.query(Timetable).filter(Timetable.faculty_id == faculty_id).all()

def get_timetable_for_student(db: Session, student_id: int) -> List[Timetable]:
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).all()
    course_ids = [e.course_id for e in enrollments]
    return db.query(Timetable).filter(Timetable.course_id.in_(course_ids)).all()
