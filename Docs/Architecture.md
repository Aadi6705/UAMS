# Architecture.md
## University Academic Management System (UAMS)

Three-tier, MVC-based architecture with role-based access control.

---

## 1. High-Level Architecture

```
┌──────────────────────────────────────────────┐
│               PRESENTATION LAYER              │
│              React.js + Bootstrap 5           │
│  Login │ Dashboard │ Courses │ Attendance      │
│  Marks │ Timetable │ Materials │ Reports       │
└────────────────────┬───────────────────────────┘
                      │ HTTP / REST (JSON)
                      ▼
┌──────────────────────────────────────────────┐
│           APPLICATION / MIDDLE LAYER          │
│                   FastAPI                     │
│  Controllers → Services → Validation → Auth   │
│  Business logic: attendance %, eligibility,   │
│  CGPA, authorization checks                   │
└────────────────────┬───────────────────────────┘
                      │ SQLAlchemy ORM / Repository
                      ▼
┌──────────────────────────────────────────────┐
│                  DATA LAYER                   │
│                    MySQL                      │
│  Users, Students, Faculty, Courses,           │
│  Enrollments, Attendance, Marks, Timetable,   │
│  Materials                                     │
└──────────────────────────────────────────────┘
```

**Rule of thumb:** requests never skip a layer. Routes never touch SQL directly.

```
Controller → Service → Repository → Database
```

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| UI Framework | Bootstrap 5 |
| API Framework | FastAPI (Python) |
| ORM | SQLAlchemy |
| Database | MySQL |
| Authentication | JWT |
| Password hashing | bcrypt / passlib |
| API docs | Swagger / OpenAPI (auto via FastAPI) |
| Version control | Git + GitHub |

## 3. Request Flow Example — Marking Attendance

```
React
  │ POST /api/attendance
  ▼
AttendanceController
  │
  ▼
AttendanceService
  ├── Validate faculty owns this course
  ├── Validate student is enrolled
  ├── Validate course exists
  ├── Check for duplicate entry (same date)
  ├── Apply attendance rules
  ▼
AttendanceRepository
  ▼
MySQL
```

## 4. Database Schema

### 4.1 Entity Relationship Overview

```
Departments
     │
 ┌───┴────┐
 ▼         ▼
Students  Faculty
 │         │
 └────┬────┘
      ▼
   Courses
      │
 ┌────┴────┐
 ▼         ▼
Enrollments  Timetable
 │
 ▼
Attendance
 │
 ▼
Marks
```

### 4.2 Tables

**users** — authentication
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| username | string | |
| email | string | unique |
| password_hash | string | |
| role | enum | ADMIN / FACULTY / STUDENT |
| is_active | bool | |
| created_at | datetime | |

**students**
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| user_id | FK → users | |
| student_id | string | institution ID |
| name | string | |
| department_id | FK → departments | |
| semester | int | |
| batch | string | |
| phone | string | |

**faculty**
| Column | Type | Notes |
|---|---|---|
| id | PK | |
| user_id | FK → users | |
| faculty_id | string | |
| name | string | |
| department_id | FK → departments | |
| designation | string | |

**departments**: `id`, `name`, `code`

**courses**: `id`, `course_code`, `course_name`, `credits`, `department_id (FK)`, `semester`

**enrollments** (many-to-many bridge: student ⟷ course)
| Column | Type |
|---|---|
| id | PK |
| student_id | FK → students |
| course_id | FK → courses |
| academic_year | string |
| semester | int |

**attendance**: `id`, `student_id (FK)`, `course_id (FK)`, `faculty_id (FK)`, `date`, `status` (PRESENT / ABSENT, extensible to LATE / EXCUSED)

**marks**: `id`, `student_id (FK)`, `course_id (FK)`, `exam_type`, `marks_obtained`, `max_marks`

**timetable**: `id`, `course_id (FK)`, `faculty_id (FK)`, `day`, `start_time`, `end_time`, `room`

**materials**: `id`, `course_id (FK)`, `faculty_id (FK)`, `title`, `description`, `file_path`, `uploaded_at`

**announcements**: `id`, `course_id (FK, nullable)`, `posted_by (FK → users)`, `title`, `body`, `posted_at`

## 5. API Surface

```
Auth
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout

Students
GET    /api/students
GET    /api/students/{id}
POST   /api/students
PUT    /api/students/{id}
DELETE /api/students/{id}

Courses
GET    /api/courses
POST   /api/courses
PUT    /api/courses/{id}
DELETE /api/courses/{id}

Attendance
POST   /api/attendance
GET    /api/attendance/student/{id}
GET    /api/attendance/course/{id}
PUT    /api/attendance/{id}

Marks
POST   /api/marks
GET    /api/marks/student/{id}
PUT    /api/marks/{id}

Timetable
GET    /api/timetable/student/{id}
GET    /api/timetable/faculty/{id}
POST   /api/timetable

Materials
POST   /api/materials
GET    /api/materials/course/{id}
DELETE /api/materials/{id}
```

All routes except `/auth/*` require a valid JWT. Role checks happen in the service layer, not the controller.

## 6. Backend Folder Structure

```
backend/
├── app/
│   ├── main.py
│   ├── config/
│   │   ├── database.py
│   │   └── settings.py
│   ├── models/
│   │   ├── user.py
│   │   ├── student.py
│   │   ├── faculty.py
│   │   ├── department.py
│   │   ├── course.py
│   │   ├── enrollment.py
│   │   ├── attendance.py
│   │   ├── marks.py
│   │   ├── timetable.py
│   │   └── material.py
│   ├── schemas/
│   │   ├── user.py
│   │   ├── student.py
│   │   ├── course.py
│   │   ├── attendance.py
│   │   └── marks.py
│   ├── controllers/
│   │   ├── auth_controller.py
│   │   ├── student_controller.py
│   │   ├── faculty_controller.py
│   │   ├── course_controller.py
│   │   ├── attendance_controller.py
│   │   └── marks_controller.py
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── student_service.py
│   │   ├── course_service.py
│   │   ├── attendance_service.py
│   │   └── marks_service.py
│   ├── repositories/
│   │   ├── student_repository.py
│   │   ├── course_repository.py
│   │   ├── attendance_repository.py
│   │   └── marks_repository.py
│   └── utils/
│       ├── security.py
│       └── dependencies.py
└── requirements.txt
```

## 7. Frontend Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── DataTable.jsx
│   │   ├── AttendanceCard.jsx
│   │   └── CourseCard.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Faculty.jsx
│   │   │   └── Courses.jsx
│   │   ├── faculty/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Marks.jsx
│   │   │   └── Materials.jsx
│   │   └── student/
│   │       ├── Dashboard.jsx
│   │       ├── Attendance.jsx
│   │       ├── Marks.jsx
│   │       └── Timetable.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── attendanceService.js
│   │   └── courseService.js
│   ├── context/
│   │   └── AuthContext.jsx
│   └── App.jsx
```

## 8. Authentication & Authorization Flow

```
Login (email + password)
   │
   ▼
POST /api/auth/login
   │
   ▼
FastAPI: find user → verify password → generate JWT
   │
   ▼
JWT returned to React → stored in memory/context
   │
   ▼
Every protected request sends: Authorization: Bearer <JWT>
   │
   ▼
Backend decodes JWT → extracts role → allows/denies (403 if not permitted)
```
