# Phases.md
## Build order for UAMS

Build in this order. Do not start a phase until the previous one's checklist is fully checked off in `Memory.md`. Each phase should leave the app in a runnable state.

---

### Phase 1 — Project Setup & Database
- [ ] Initialize `backend/` (FastAPI project structure per `Architecture.md`) and `frontend/` (React app)
- [ ] Set up MySQL database and connection config (`.env`, `config/database.py`)
- [ ] Create SQLAlchemy models for all tables: users, students, faculty, departments, courses, enrollments, attendance, marks, timetable, materials
- [ ] Run initial migration / create tables
- [ ] Seed minimal demo data (a few departments, one admin user)

### Phase 2 — Authentication & JWT
- [ ] `POST /api/auth/register` (admin-created users only, or open register for demo)
- [ ] `POST /api/auth/login` — verify password, issue JWT with embedded role
- [ ] `POST /api/auth/logout`
- [ ] JWT verification dependency/middleware
- [ ] Role-based route guard (decorator/dependency) reusable across controllers
- [ ] React: Login page, AuthContext, protected route wrapper

### Phase 3 — Admin Module
- [ ] CRUD: departments
- [ ] CRUD: students
- [ ] CRUD: faculty
- [ ] Admin dashboard (counts: students, faculty, courses, departments)
- [ ] Activate/deactivate user accounts

### Phase 4 — Course & Enrollment Management
- [ ] CRUD: courses (admin)
- [ ] Assign faculty to course
- [ ] Enroll students in courses (many-to-many via `enrollments`)
- [ ] Course list views (admin + faculty + student, scoped appropriately)

### Phase 5 — Faculty Attendance Module
- [ ] Faculty: view assigned courses + enrolled students
- [ ] Mark attendance (per course, per date)
- [ ] Edit/correct attendance entries
- [ ] Prevent duplicate attendance entries for the same student/course/date
- [ ] Attendance % calculation service

### Phase 6 — Student Attendance Dashboard
- [ ] Student: view overall + per-subject attendance
- [ ] Eligibility flag (≥75% threshold)
- [ ] Attendance prediction ("attend X more classes to reach 75%")
- [ ] Low-attendance warning UI

### Phase 7 — Marks, Timetable, Materials
- [ ] Faculty: upload/update marks (internal, mid-sem, end-sem) per student/course
- [ ] Student: view marks + computed CGPA
- [ ] Timetable CRUD (admin) + views (faculty/student)
- [ ] Materials upload (faculty) + download (student)

### Phase 8 — Reports & Analytics
- [ ] Student attendance report
- [ ] Course attendance report
- [ ] Faculty report
- [ ] Marks report
- [ ] Department-level report (admin)

### Phase 9 — Polish, Testing, Deployment
- [ ] UI polish pass (consistent spacing, empty states, loading states)
- [ ] Manual test pass against `TestCases.md` (if/when created)
- [ ] Error handling audit (per `Rules.md` §4)
- [ ] Basic deployment (local or single free-tier host) for demo/viva
- [ ] Final README with setup instructions

---

## How to use this file with `Memory.md`

At the end of each work session, mark completed checklist items and update `Memory.md` with:
- Which phase is active
- What was just completed
- What's next
- Any open questions/assumptions
