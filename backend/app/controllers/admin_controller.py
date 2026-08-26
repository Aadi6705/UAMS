from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.models.user import UserRole
from app.utils.dependencies import RoleChecker
from app.schemas.department import DepartmentCreate, DepartmentUpdate, DepartmentResponse
from app.schemas.faculty import FacultyCreate, FacultyResponse
from app.schemas.student import StudentCreate, StudentResponse
from app.services import admin_service

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
    dependencies=[Depends(RoleChecker([UserRole.ADMIN]))]
)

# --- Departments ---
@router.get("/departments", response_model=List[DepartmentResponse])
def get_departments(db: Session = Depends(get_db)):
    return admin_service.get_departments(db)

@router.post("/departments", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
def create_department(department: DepartmentCreate, db: Session = Depends(get_db)):
    return admin_service.create_department(db, department)

@router.put("/departments/{dept_id}", response_model=DepartmentResponse)
def update_department(dept_id: int, department: DepartmentUpdate, db: Session = Depends(get_db)):
    return admin_service.update_department(db, dept_id, department)

@router.delete("/departments/{dept_id}")
def delete_department(dept_id: int, db: Session = Depends(get_db)):
    return admin_service.delete_department(db, dept_id)

# --- Faculty ---
@router.get("/faculty", response_model=List[FacultyResponse])
def get_faculty(db: Session = Depends(get_db)):
    return admin_service.get_faculty_list(db)

@router.post("/faculty", response_model=FacultyResponse, status_code=status.HTTP_201_CREATED)
def create_faculty(faculty: FacultyCreate, db: Session = Depends(get_db)):
    return admin_service.create_faculty(db, faculty)

# --- Students ---
@router.get("/students", response_model=List[StudentResponse])
def get_students(db: Session = Depends(get_db)):
    return admin_service.get_students_list(db)

@router.post("/students", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    return admin_service.create_student(db, student)
