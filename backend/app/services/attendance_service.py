from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List
from datetime import date

from app.models.attendance import Attendance, AttendanceStatus
from app.models.enrollment import Enrollment
from app.models.student import Student
from app.models.course import Course
from app.schemas.attendance import AttendanceBulkCreate, StudentAttendanceDashboard, CourseAttendanceSummary

def get_enrolled_students(db: Session, course_id: int) -> List[Student]:
    enrollments = db.query(Enrollment).filter(Enrollment.course_id == course_id).all()
    student_ids = [e.student_id for e in enrollments]
    return db.query(Student).filter(Student.id.in_(student_ids)).all()

def get_attendance(db: Session, course_id: int, target_date: date) -> List[Attendance]:
    return db.query(Attendance).filter(
        Attendance.course_id == course_id,
        Attendance.date == target_date
    ).all()

def mark_attendance(db: Session, faculty_id: int, bulk_data: AttendanceBulkCreate) -> List[Attendance]:
    course_id = bulk_data.course_id
    target_date = bulk_data.date
    
    # Fetch existing attendance for this course and date
    existing_records = db.query(Attendance).filter(
        Attendance.course_id == course_id,
        Attendance.date == target_date
    ).all()
    
    # Create a map of student_id -> existing_record for fast lookup
    existing_map = {record.student_id: record for record in existing_records}
    
    updated_records = []
    
    for record_data in bulk_data.records:
        status_enum = AttendanceStatus.PRESENT if record_data.status.upper() == "PRESENT" else AttendanceStatus.ABSENT
        
        if record_data.student_id in existing_map:
            # Update existing
            existing = existing_map[record_data.student_id]
            existing.status = status_enum
            existing.faculty_id = faculty_id
            updated_records.append(existing)
        else:
            # Create new
            new_record = Attendance(
                student_id=record_data.student_id,
                course_id=course_id,
                faculty_id=faculty_id,
                date=target_date,
                status=status_enum
            )
            db.add(new_record)
            updated_records.append(new_record)
            
    db.commit()
    
    # Refresh newly added records
    for record in updated_records:
        db.refresh(record)
        
    return updated_records

def calculate_student_dashboard(db: Session, student_id: int) -> StudentAttendanceDashboard:
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).all()
    if not enrollments:
        return StudentAttendanceDashboard(overall_percentage=0.0, courses=[])
        
    course_ids = [e.course_id for e in enrollments]
    courses = db.query(Course).filter(Course.id.in_(course_ids)).all()
    course_map = {c.id: c for c in courses}
    
    attendance_records = db.query(Attendance).filter(Attendance.student_id == student_id).all()
    
    course_stats = {}
    for cid in course_ids:
        course_stats[cid] = {"total": 0, "attended": 0}
        
    for record in attendance_records:
        cid = record.course_id
        if cid in course_stats:
            course_stats[cid]["total"] += 1
            if record.status == AttendanceStatus.PRESENT:
                course_stats[cid]["attended"] += 1
                
    summaries = []
    total_classes_overall = 0
    total_attended_overall = 0
    
    for cid, stats in course_stats.items():
        total = stats["total"]
        attended = stats["attended"]
        
        total_classes_overall += total
        total_attended_overall += attended
        
        percentage = (attended / total * 100) if total > 0 else 100.0
        is_eligible = percentage >= 75.0
        
        prediction = ""
        if total > 0 and not is_eligible:
            # How many more consecutive classes needed to reach 75%?
            # (attended + x) / (total + x) = 0.75
            # attended + x = 0.75 * total + 0.75 * x
            # 0.25 * x = 0.75 * total - attended
            # x = 3 * total - 4 * attended
            required_classes = (3 * total) - (4 * attended)
            if required_classes > 0:
                prediction = f"Attend {required_classes} more class{'es' if required_classes > 1 else ''} consecutively to reach 75%."
        elif total == 0:
            prediction = "No classes held yet."
            
        c = course_map[cid]
        summaries.append(CourseAttendanceSummary(
            course_id=c.id,
            course_code=c.course_code,
            course_name=c.course_name,
            total_classes=total,
            classes_attended=attended,
            attendance_percentage=round(percentage, 2),
            is_eligible=is_eligible,
            prediction_message=prediction
        ))
        
    overall_percentage = (total_attended_overall / total_classes_overall * 100) if total_classes_overall > 0 else 100.0
    
    return StudentAttendanceDashboard(
        overall_percentage=round(overall_percentage, 2),
        courses=summaries
    )
