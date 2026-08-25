from pydantic import BaseModel
from datetime import date
from typing import List
from app.schemas.student import StudentResponse

class AttendanceRecordBase(BaseModel):
    student_id: int
    status: str

class AttendanceBulkCreate(BaseModel):
    course_id: int
    date: date
    records: List[AttendanceRecordBase]

class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    faculty_id: int
    date: date
    status: str
    student: StudentResponse

    class Config:
        from_attributes = True

class CourseAttendanceSummary(BaseModel):
    course_id: int
    course_code: str
    course_name: str
    total_classes: int
    classes_attended: int
    attendance_percentage: float
    is_eligible: bool
    prediction_message: str

class StudentAttendanceDashboard(BaseModel):
    overall_percentage: float
    courses: List[CourseAttendanceSummary]
