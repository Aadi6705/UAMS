from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.course import CourseResponse
from app.schemas.faculty import FacultyResponse

class MaterialBase(BaseModel):
    course_id: int
    title: str
    description: Optional[str] = None
    file_path: str # Will hold URL or link

class MaterialCreate(MaterialBase):
    pass

class MaterialResponse(MaterialBase):
    id: int
    faculty_id: int
    uploaded_at: datetime
    course: CourseResponse
    faculty: FacultyResponse

    class Config:
        from_attributes = True
