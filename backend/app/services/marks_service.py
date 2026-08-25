from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

from app.models.marks import Marks
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.schemas.marks import MarksCreate, StudentCGPAResponse, CourseMarksSummary

def upload_marks(db: Session, faculty_id: int, marks_data: MarksCreate) -> Marks:
    # Optional: verify faculty is assigned to the course. For simplicity, we just upload.
    existing = db.query(Marks).filter(
        Marks.student_id == marks_data.student_id,
        Marks.course_id == marks_data.course_id,
        Marks.exam_type == marks_data.exam_type
    ).first()
    
    if existing:
        existing.marks_obtained = marks_data.marks_obtained
        existing.max_marks = marks_data.max_marks
        db.commit()
        db.refresh(existing)
        return existing
        
    new_marks = Marks(**marks_data.model_dump())
    db.add(new_marks)
    db.commit()
    db.refresh(new_marks)
    return new_marks

def get_cgpa_for_student(db: Session, student_id: int) -> StudentCGPAResponse:
    marks_records = db.query(Marks).filter(Marks.student_id == student_id).all()
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).all()
    
    course_ids = [e.course_id for e in enrollments]
    courses = db.query(Course).filter(Course.id.in_(course_ids)).all()
    course_map = {c.id: c for c in courses}
    
    course_marks = {}
    for cid in course_ids:
        course_marks[cid] = {"obtained": 0.0, "max": 0.0}
        
    for record in marks_records:
        cid = record.course_id
        if cid in course_marks:
            course_marks[cid]["obtained"] += record.marks_obtained
            course_marks[cid]["max"] += record.max_marks
            
    summaries = []
    total_credit_points = 0.0
    total_credits = 0
    
    def get_grade_info(percentage: float):
        if percentage >= 90: return "O", 10.0
        if percentage >= 80: return "A+", 9.0
        if percentage >= 70: return "A", 8.0
        if percentage >= 60: return "B+", 7.0
        if percentage >= 50: return "B", 6.0
        if percentage >= 40: return "C", 5.0
        return "F", 0.0

    for cid, m_data in course_marks.items():
        if m_data["max"] == 0:
            continue
            
        percentage = (m_data["obtained"] / m_data["max"]) * 100
        grade, gp = get_grade_info(percentage)
        c = course_map[cid]
        
        total_credit_points += gp * c.credits
        total_credits += c.credits
        
        summaries.append(CourseMarksSummary(
            course_id=c.id,
            course_code=c.course_code,
            course_name=c.course_name,
            credits=c.credits,
            total_obtained=m_data["obtained"],
            total_max=m_data["max"],
            percentage=round(percentage, 2),
            grade=grade,
            grade_point=gp
        ))
        
    cgpa = (total_credit_points / total_credits) if total_credits > 0 else 0.0
    
    return StudentCGPAResponse(
        student_id=student_id,
        cgpa=round(cgpa, 2),
        total_credits=total_credits,
        courses=summaries
    )
