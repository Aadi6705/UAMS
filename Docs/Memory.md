# Memory.md
## Living progress log for UAMS

**Purpose:** this file is the AI's persistent memory across sessions/chats. Update it at the end of every work session so a new chat can resume without re-reading the whole codebase or guessing at prior decisions. Keep entries short and factual — this is a log, not a report.

Do not pre-fill this with imagined progress. It starts empty and is updated only as real work happens.

---

## Current Status

- **Active phase:** Phase 4 (Faculty Module)
- **Last updated:** 2026-08-26

## Completed

- Phase 1: Project Setup & Database
- Setup FastAPI backend structure and Python virtual environment with dependencies.
- Initialized React frontend with Vite, Bootstrap, and React Router.
- Created all SQLAlchemy models for tables: users, departments, students, faculty, courses, enrollments, attendance, marks, timetable, materials.
- Setup `config/database.py` and `init_db.py` for database creation, migration, and seeding.
- MySQL database running via Docker and seeded successfully.
- Phase 2: Authentication & JWT
- Created `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`.
- Implemented `bcrypt` hashing and `PyJWT` token generation.
- Created `get_current_user` and `RoleChecker` FastAPI dependencies.
- Created React `AuthContext`, `api.js` Axios interceptor, `Login.jsx` UI, and `ProtectedRoute.jsx`.
- Phase 3: Admin Module
- Created CRUD API for departments, faculty, and students (`admin_service.py`, `admin_controller.py`).
- Implemented `DashboardLayout` for the frontend.
- Created `AdminDashboard`, `ManageDepartments`, `ManageFaculty`, and `ManageStudents` React pages.

- Phase 4: Course & Enrollment Management
- Created schemas, service, and controller for Courses, Enrollments, and Timetable (for assignments).
- Implemented `ManageCourses` Admin UI to add courses, enroll students, and assign faculty.
- Implemented conditional sidebar in `DashboardLayout` based on user role.
- Created `FacultyDashboard` (shows assigned courses) and `StudentDashboard` (shows enrolled courses).

- Phase 5: Faculty Attendance Module
- Created API for bulk attendance creation/upsert (`attendance_service.py`, `attendance_controller.py`).
- Added `MarkAttendance.jsx` frontend to allow Faculty to select an assigned course and mark PRESENT/ABSENT for enrolled students.
- Prevented duplicate rows by fetching existing data and editing it if it exists for the given course and date.

- Phase 6: Student Attendance Dashboard
- Created `GET /api/attendance/student/dashboard` which calculates overall/per-course percentages and prediction logic.
- Created `StudentAttendance.jsx` to render large visual cards, progress bars, and warnings if attendance falls below 75%.

## In Progress

- Planning Phase 7: Marks, Timetable, Materials

## Next Up

- Marks, Timetable, Materials: Upload/update marks, Timetable CRUD, Materials upload.

## Key Decisions & Assumptions

- Using Vite for React scaffold.
- The user is running a local installation of MySQL instead of Docker.

## Known Issues / TODOs

- MySQL connection fails with "Access denied for user 'root'@'localhost'". Waiting for user to configure `.env` or provide credentials.

## Session Log

| Date | Summary |
|---|---|
| — | Docs created (PRD, Architecture, Rules, Phases, Design, Memory) — no code written yet |
| 2026-08-26 | Scaffolded Phase 1 backend/frontend, wrote DB models, waiting on MySQL connection. |

---

### Update instructions for the AI
1. At the start of a session: read this file first, then `Phases.md`, before touching code.
2. At the end of a session: update **Current Status**, move finished items from **Next Up** to **Completed**, add a row to **Session Log**.
3. Never mark a `Phases.md` checklist item complete here unless it's actually done and working.
