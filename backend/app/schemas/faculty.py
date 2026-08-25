from pydantic import BaseModel, EmailStr
from typing import Optional
from app.schemas.department import DepartmentResponse
from app.schemas.user import UserResponse

class FacultyBase(BaseModel):
    faculty_id: str
    name: str
    designation: str
    department_id: int

class FacultyCreate(FacultyBase):
    email: EmailStr
    password: str

class FacultyResponse(FacultyBase):
    id: int
    user_id: int
    user: UserResponse
    department: DepartmentResponse

    class Config:
        from_attributes = True
