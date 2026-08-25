from pydantic import BaseModel, EmailStr
from typing import Optional
from app.schemas.department import DepartmentResponse
from app.schemas.user import UserResponse

class StudentBase(BaseModel):
    student_id: str
    name: str
    department_id: int
    semester: int
    batch: str
    phone: Optional[str] = None

class StudentCreate(StudentBase):
    email: EmailStr
    password: str

class StudentResponse(StudentBase):
    id: int
    user_id: int
    user: UserResponse
    department: DepartmentResponse

    class Config:
        from_attributes = True
