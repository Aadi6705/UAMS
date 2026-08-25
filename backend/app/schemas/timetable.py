from pydantic import BaseModel
from datetime import time
from typing import Optional
from app.schemas.course import CourseResponse
from app.schemas.faculty import FacultyResponse

class TimetableBase(BaseModel):
    course_id: int
    faculty_id: int
    day: str
    start_time: time
    end_time: time
    room: Optional[str] = None

class TimetableCreate(TimetableBase):
    pass

class TimetableResponse(TimetableBase):
    id: int
    course: CourseResponse
    faculty: FacultyResponse

    class Config:
        from_attributes = True
