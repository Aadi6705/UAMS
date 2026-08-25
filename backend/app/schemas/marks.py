from pydantic import BaseModel
from typing import List, Optional
from app.schemas.course import CourseResponse

class MarksBase(BaseModel):
    student_id: int
    course_id: int
    exam_type: str
    marks_obtained: float
    max_marks: float

class MarksCreate(MarksBase):
    pass

class MarksResponse(MarksBase):
    id: int
    course: CourseResponse

    class Config:
        from_attributes = True

class CourseMarksSummary(BaseModel):
    course_id: int
    course_code: str
    course_name: str
    credits: int
    total_obtained: float
    total_max: float
    percentage: float
    grade: str
    grade_point: float

class StudentCGPAResponse(BaseModel):
    student_id: int
    cgpa: float
    total_credits: int
    courses: List[CourseMarksSummary]
