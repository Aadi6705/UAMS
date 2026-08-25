from pydantic import BaseModel
from typing import Optional
from app.schemas.department import DepartmentResponse

class CourseBase(BaseModel):
    course_code: str
    course_name: str
    credits: int
    department_id: int
    semester: int

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int
    department: DepartmentResponse

    class Config:
        from_attributes = True
