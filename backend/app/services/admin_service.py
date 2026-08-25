from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List

from app.models.department import Department
from app.models.faculty import Faculty
from app.models.student import Student
from app.models.user import User, UserRole
from app.schemas.department import DepartmentCreate
from app.schemas.faculty import FacultyCreate
from app.schemas.student import StudentCreate
from app.utils.security import get_password_hash

# --- Departments ---
def get_departments(db: Session) -> List[Department]:
    return db.query(Department).all()

def create_department(db: Session, department: DepartmentCreate) -> Department:
    db_dept = db.query(Department).filter(Department.code == department.code).first()
    if db_dept:
        raise HTTPException(status_code=400, detail="Department code already exists")
    
    new_dept = Department(name=department.name, code=department.code)
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    return new_dept

# --- Faculty ---
def get_faculty_list(db: Session) -> List[Faculty]:
    return db.query(Faculty).all()

def create_faculty(db: Session, faculty: FacultyCreate) -> Faculty:
    # Check user email
    if db.query(User).filter(User.email == faculty.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    # Check faculty ID
    if db.query(Faculty).filter(Faculty.faculty_id == faculty.faculty_id).first():
        raise HTTPException(status_code=400, detail="Faculty ID already exists")

    # Create User
    new_user = User(
        username=faculty.name,
        email=faculty.email,
        password_hash=get_password_hash(faculty.password),
        role=UserRole.FACULTY
    )
    db.add(new_user)
    db.flush() # get user id without committing

    # Create Faculty
    new_faculty = Faculty(
        user_id=new_user.id,
        faculty_id=faculty.faculty_id,
        name=faculty.name,
        department_id=faculty.department_id,
        designation=faculty.designation
    )
    db.add(new_faculty)
    db.commit()
    db.refresh(new_faculty)
    return new_faculty

# --- Students ---
def get_students_list(db: Session) -> List[Student]:
    return db.query(Student).all()

def create_student(db: Session, student: StudentCreate) -> Student:
    # Check user email
    if db.query(User).filter(User.email == student.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    # Check student ID
    if db.query(Student).filter(Student.student_id == student.student_id).first():
        raise HTTPException(status_code=400, detail="Student ID already exists")

    # Create User
    new_user = User(
        username=student.name,
        email=student.email,
        password_hash=get_password_hash(student.password),
        role=UserRole.STUDENT
    )
    db.add(new_user)
    db.flush() # get user id without committing

    # Create Student
    new_student = Student(
        user_id=new_user.id,
        student_id=student.student_id,
        name=student.name,
        department_id=student.department_id,
        semester=student.semester,
        batch=student.batch,
        phone=student.phone
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student
