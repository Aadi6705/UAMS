# Memory.md
## Living progress log for UAMS

**Purpose:** this file is the AI's persistent memory across sessions/chats. Update it at the end of every work session so a new chat can resume without re-reading the whole codebase or guessing at prior decisions. Keep entries short and factual — this is a log, not a report.

Do not pre-fill this with imagined progress. It starts empty and is updated only as real work happens.

---

## Current Status

- **Active phase:** Phase 2 (Authentication & JWT)
- **Last updated:** 2026-08-26

## Completed

- Phase 1: Project Setup & Database
- Setup FastAPI backend structure and Python virtual environment with dependencies.
- Initialized React frontend with Vite, Bootstrap, and React Router.
- Created all SQLAlchemy models for tables: users, departments, students, faculty, courses, enrollments, attendance, marks, timetable, materials.
- Setup `config/database.py` and `init_db.py` for database creation, migration, and seeding.
- MySQL database running via Docker and seeded successfully.

## In Progress

- Planning Phase 2: Authentication & JWT endpoints

## Next Up

- `POST /api/auth/register` and `POST /api/auth/login`
- JWT verification middleware/dependencies

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
