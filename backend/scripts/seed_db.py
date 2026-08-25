import sys
import os
from datetime import date, timedelta
from passlib.context import CryptContext

# Add the project root to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config.database import SessionLocal, engine, Base
from app.models.user import User, UserRole
from app.models.department import Department
from app.models.faculty import Faculty
from app.models.student import Student
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.timetable import Timetable
from app.models.attendance import Attendance, AttendanceStatus
from app.models.marks import Marks
from app.models.material import Material

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def seed_db():
    print("Creating tables if they don't exist...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        print("Clearing existing data...")
        # Note: Delete order matters due to foreign keys!
        db.query(Material).delete()
        db.query(Marks).delete()
        db.query(Attendance).delete()
        db.query(Timetable).delete()
        db.query(Enrollment).delete()
        db.query(Course).delete()
        db.query(Student).delete()
        db.query(Faculty).delete()
        db.query(Department).delete()
        db.query(User).delete()
        
        print("Seeding Users...")
        # Users
        admin_user = User(username="admin", email="admin@uams.edu", password_hash=get_password_hash("admin123"), role=UserRole.ADMIN)
        fac1_user = User(username="fac1", email="prof.smith@uams.edu", password_hash=get_password_hash("faculty123"), role=UserRole.FACULTY)
        fac2_user = User(username="fac2", email="prof.jones@uams.edu", password_hash=get_password_hash("faculty123"), role=UserRole.FACULTY)
        stu1_user = User(username="stu1", email="student1@uams.edu", password_hash=get_password_hash("student123"), role=UserRole.STUDENT)
        stu2_user = User(username="stu2", email="student2@uams.edu", password_hash=get_password_hash("student123"), role=UserRole.STUDENT)
        
        db.add_all([admin_user, fac1_user, fac2_user, stu1_user, stu2_user])
        db.commit()
        
        print("Seeding Departments...")
        cse_dept = Department(name="Computer Science & Engineering", code="CSE")
        ee_dept = Department(name="Electrical Engineering", code="EE")
        db.add_all([cse_dept, ee_dept])
        db.commit()
        
        print("Seeding Faculty & Students...")
        fac1 = Faculty(user_id=fac1_user.id, faculty_id="FAC001", name="Dr. Alice Smith", designation="Professor", department_id=cse_dept.id)
        fac2 = Faculty(user_id=fac2_user.id, faculty_id="FAC002", name="Dr. Bob Jones", designation="Associate Professor", department_id=ee_dept.id)
        stu1 = Student(user_id=stu1_user.id, student_id="STU001", name="John Doe", semester=1, batch="2021", department_id=cse_dept.id)
        stu2 = Student(user_id=stu2_user.id, student_id="STU002", name="Jane Roe", semester=1, batch="2022", department_id=ee_dept.id)
        db.add_all([fac1, fac2, stu1, stu2])
        db.commit()
        
        print("Seeding Courses...")
        c1 = Course(course_code="CS101", course_name="Intro to Programming", credits=3, department_id=cse_dept.id, semester=1)
        c2 = Course(course_code="CS201", course_name="Data Structures", credits=4, department_id=cse_dept.id, semester=1)
        c3 = Course(course_code="EE101", course_name="Basic Electronics", credits=3, department_id=ee_dept.id, semester=1)
        db.add_all([c1, c2, c3])
        db.commit()
        
        print("Seeding Enrollments...")
        e1 = Enrollment(student_id=stu1.id, course_id=c1.id, academic_year="2026", semester=1)
        e2 = Enrollment(student_id=stu1.id, course_id=c2.id, academic_year="2026", semester=1)
        e3 = Enrollment(student_id=stu2.id, course_id=c1.id, academic_year="2026", semester=1)
        e4 = Enrollment(student_id=stu2.id, course_id=c3.id, academic_year="2026", semester=1)
        db.add_all([e1, e2, e3, e4])
        db.commit()
        
        print("Seeding Timetable (which also acts as Faculty assignment)...")
        t1 = Timetable(course_id=c1.id, faculty_id=fac1.id, day="Monday", start_time="09:00", end_time="10:30", room="Room 101")
        t2 = Timetable(course_id=c2.id, faculty_id=fac1.id, day="Tuesday", start_time="11:00", end_time="12:30", room="Lab 1")
        t3 = Timetable(course_id=c3.id, faculty_id=fac2.id, day="Wednesday", start_time="10:00", end_time="11:30", room="Room 205")
        db.add_all([t1, t2, t3])
        db.commit()
        
        print("Seeding Attendance...")
        today = date.today()
        yesterday = today - timedelta(days=1)
        a1 = Attendance(student_id=stu1.id, course_id=c1.id, faculty_id=fac1.id, date=today, status=AttendanceStatus.PRESENT)
        a2 = Attendance(student_id=stu2.id, course_id=c1.id, faculty_id=fac1.id, date=today, status=AttendanceStatus.ABSENT)
        a3 = Attendance(student_id=stu1.id, course_id=c1.id, faculty_id=fac1.id, date=yesterday, status=AttendanceStatus.PRESENT)
        a4 = Attendance(student_id=stu1.id, course_id=c2.id, faculty_id=fac1.id, date=yesterday, status=AttendanceStatus.PRESENT)
        db.add_all([a1, a2, a3, a4])
        db.commit()
        
        print("Seeding Marks...")
        m1 = Marks(student_id=stu1.id, course_id=c1.id, exam_type="Mid-Sem", marks_obtained=85, max_marks=100)
        m2 = Marks(student_id=stu2.id, course_id=c1.id, exam_type="Mid-Sem", marks_obtained=92, max_marks=100)
        m3 = Marks(student_id=stu1.id, course_id=c2.id, exam_type="Mid-Sem", marks_obtained=78, max_marks=100)
        db.add_all([m1, m2, m3])
        db.commit()
        
        print("Seeding Materials...")
        mat1 = Material(course_id=c1.id, faculty_id=fac1.id, title="Lecture 1 Slides", description="Intro to Python", file_path="https://example.com/slides1.pdf")
        mat2 = Material(course_id=c2.id, faculty_id=fac1.id, title="Array Notes", description="Chapter 2 notes", file_path="https://example.com/arrays.pdf")
        db.add_all([mat1, mat2])
        db.commit()
        
        print("\nDatabase seeded successfully!")
        print("Test Credentials:")
        print("Admin:   admin@uams.edu / admin123")
        print("Faculty: prof.smith@uams.edu / faculty123")
        print("Student: student1@uams.edu / student123")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
