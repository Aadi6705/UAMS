from pydantic import BaseModel
from app.schemas.course import CourseResponse
from app.schemas.student import StudentResponse

class EnrollmentBase(BaseModel):
    student_id: int
    course_id: int
    academic_year: str
    semester: int

class EnrollmentCreate(EnrollmentBase):
    pass

class EnrollmentResponse(EnrollmentBase):
    id: int
    student: StudentResponse
    course: CourseResponse

    class Config:
        from_attributes = True
