# Product Requirements Document (PRD)
## University Academic Management System (UAMS)

**Version:** 1.0
**Type:** University full-stack assignment
**Author:** Aadi

---

## 1. Purpose

Build a role-based web application that lets a university's **Admin**, **Faculty**, and **Students** manage and view academic operations — courses, enrollment, attendance, marks, timetable, and materials — from one centralized system.

The project exists to demonstrate, for assignment/viva purposes:
- A proper **3-tier architecture** (Frontend → Middle Layer → Backend)
- **Role-based access control**
- **CRUD operations** across related entities
- **Relational database design** with real foreign-key relationships
- **Business logic** that goes beyond simple CRUD (attendance %, eligibility, etc.)

## 2. Problem Statement

Academic data (attendance, marks, timetable, materials) is often scattered across spreadsheets, notice boards, and verbal communication. There's no single system where a student can see their standing, a faculty member can manage their courses, and an admin can oversee the institution — with each role seeing only what they should.

## 3. Target Users

| Role | Who they are | Primary need |
|---|---|---|
| **Admin** | University/department administrator | Manage users, departments, courses, and see institution-wide data |
| **Faculty** | Teaching staff | Manage their assigned courses: attendance, marks, materials |
| **Student** | Enrolled student | View their own attendance, marks, timetable, CGPA, materials |

## 4. Goals

- Deliver a working full-stack app (not just a frontend hitting generic CRUD endpoints)
- Demonstrate clean separation of concerns (Controller → Service → Repository)
- Implement real authentication (JWT) and authorization (role checks)
- Model realistic academic relationships (many-to-many enrollment, 1:many attendance/marks)
- Include at least one non-trivial business-logic feature (attendance eligibility, prediction, etc.)

## 5. Non-Goals (Out of Scope)

- Payment/fee management
- Mobile app (web-responsive only)
- Real-time chat/notifications (push-based)
- Multi-university / multi-tenant support
- Production-grade deployment (CI/CD, load balancing) — a working local/dev deployment is sufficient for the assignment

## 6. Functional Requirements

### 6.1 Authentication
- Users log in with email + password
- Passwords stored hashed (bcrypt/passlib)
- JWT issued on login, sent as `Authorization: Bearer <token>` on protected requests
- Role (`ADMIN` / `FACULTY` / `STUDENT`) embedded in token and enforced server-side

### 6.2 Admin
- CRUD: students, faculty, departments, courses, semesters
- Assign faculty to courses
- Manage timetable
- View institution-wide attendance and marks
- Generate reports
- Activate/deactivate user accounts

### 6.3 Faculty
- View assigned courses and enrolled students
- Mark and edit attendance (per course, per date)
- View attendance percentage per student/course
- Upload and update marks (internal, mid-sem, end-sem)
- Upload study materials (PDF/PPT/notes/assignments)
- View their timetable
- Generate course-level reports

### 6.4 Student
- View profile, enrolled courses, timetable
- View attendance (overall + per subject) and eligibility status
- View marks and computed CGPA
- Download study materials
- View announcements

### 6.5 Core Business Logic
- **Attendance %** = (classes present / total classes) × 100
- **Eligibility**: attendance ≥ 75% → eligible for exam; else flagged
- **Attendance prediction**: classes needed to reach 75% threshold
- **CGPA calculation** from marks across courses

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Security | Passwords hashed, JWT-based auth, role-based route protection |
| Usability | Simple, role-specific dashboards; no unnecessary clutter per role |
| Performance | Reasonable response times for a small-scale academic dataset (hundreds–low thousands of records) |
| Maintainability | Layered backend (Controller/Service/Repository); no business logic in routes |
| Data integrity | Foreign-key constraints enforced at the database level |

## 8. Success Criteria

- [ ] All three roles can log in and see only their permitted data/actions
- [ ] Admin can create a course, assign a faculty member, and enroll students
- [ ] Faculty can mark attendance and upload marks for their course
- [ ] Student dashboard correctly reflects attendance %, eligibility, and CGPA
- [ ] Unauthorized actions (e.g., student deleting a course) return `403 Forbidden`
- [ ] Codebase follows the layered structure defined in `Architecture.md`

## 9. Assumptions & Constraints

- Single university, single academic year at a time (no historical multi-year archiving required for v1)
- Deployed/run locally or on a single free-tier host for demo purposes
- Dataset is seeded/demo data, not real student records
