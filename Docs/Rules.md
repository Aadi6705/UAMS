# Rules.md
## Boundaries for the AI while building UAMS

These rules apply to any AI tool (Claude Code, Cursor, etc.) working on this codebase. `Architecture.md` and `PRD.md` define *what* to build; this file defines *how* to behave while building it.

---

## 1. Always Read First

Before writing code in a new session, the AI must read, in order:
1. `Memory.md` — current progress, what's done, what's next
2. `Phases.md` — which phase is active
3. `Architecture.md` — structure/stack for the relevant layer
4. `Rules.md` (this file)

Never re-scan the entire codebase from scratch if `Memory.md` already summarizes state — trust it, but verify against the actual files if something seems inconsistent.

## 2. Architecture Boundaries

- **Never** put database queries or business logic directly in a route/controller. Always go Controller → Service → Repository → DB.
- **Never** collapse the three tiers into one file "for simplicity." The layered structure is a stated project requirement, not optional.
- Keep frontend, middle layer, and database concerns in their own folders as defined in `Architecture.md` — don't invent a different structure mid-project.
- Any new table needs a corresponding SQLAlchemy model, Pydantic schema, repository, service, and controller — don't skip a layer.

## 3. Approved Stack — Don't Substitute Without Asking

| Layer | Use | Do not introduce |
|---|---|---|
| Frontend | React.js, Bootstrap 5 | Vue, Angular, Tailwind (unless explicitly approved) |
| Backend | FastAPI, Python | Flask, Django, Node/Express |
| ORM | SQLAlchemy | Raw `mysql-connector` queries, Prisma |
| Database | MySQL | SQLite, PostgreSQL, MongoDB |
| Auth | JWT + passlib/bcrypt | Session cookies, third-party auth (Auth0, Firebase) |
| State (frontend) | React Context / hooks | Redux, MobX (unless the project clearly grows to need it) |

If a task seems to genuinely require a library outside this table, **stop and ask** before adding it to `requirements.txt` / `package.json`.

## 4. Error Handling

- Every API endpoint returns a consistent JSON error shape: `{"detail": "message"}` with the correct HTTP status code (400/401/403/404/409/500).
- Validation errors (bad input) → `422` via Pydantic schemas, not manual `if` checks scattered in controllers.
- Authorization failures → `403 Forbidden`, never a silent no-op or a `200` with empty data.
- Unauthenticated requests to protected routes → `401 Unauthorized`.
- Never swallow exceptions silently (`except: pass`). Log the error and return an appropriate status.
- Frontend: every API call must handle the error case (toast/inline message), not just the happy path.

## 5. Security Rules

- Passwords are **always** hashed (bcrypt/passlib) — never stored or logged in plaintext.
- JWT secret comes from an environment variable, never hardcoded in source.
- Every non-auth route checks the JWT and the caller's role server-side. **Never trust a role sent from the frontend.**
- SQL is only ever executed through SQLAlchemy — no string-concatenated queries (SQL injection risk).
- File uploads (materials) are validated by type/size before saving.

## 6. Code Style & Conventions

- Python: PEP 8, type hints on function signatures, docstrings on services.
- React: functional components + hooks only (no class components).
- Naming: `snake_case` for Python, `camelCase` for JS/React, `PascalCase` for React components.
- One responsibility per file — don't grow a single controller or service file to handle unrelated entities.
- Environment-specific config (DB URL, JWT secret) lives in `.env`, never committed to Git.

## 7. What the AI Should Do

- Follow `Phases.md` in order — don't jump ahead to Phase 6 features while Phase 3 is incomplete.
- After finishing a meaningful chunk of work, update `Memory.md` with what changed and what's next.
- Ask before making an architectural decision that isn't already specified (e.g., "should attendance status support LATE/EXCUSED now or later?").
- Write code that a student could explain in a viva — prefer clarity over cleverness.
- Add minimal inline comments for non-obvious business logic (e.g., attendance % / eligibility calculations).

## 8. What the AI Should NOT Do

- Don't add features not listed in `PRD.md` or `Phases.md` without flagging them first.
- Don't restructure existing folders/files "for cleanliness" mid-project without asking.
- Don't silently change the tech stack (e.g., swapping MySQL for SQLite because it's easier to set up locally) — surface the trade-off and ask.
- Don't generate placeholder/fake data as if it were real functionality (e.g., a hardcoded CGPA instead of a real calculation).
- Don't skip authentication/authorization checks "to make testing easier" and leave them out.
- Don't mark a phase complete in `Memory.md` if any of its checklist items are unfinished.

## 9. When Uncertain

If a requirement is ambiguous (e.g., exact attendance eligibility threshold, exact CGPA formula), state the assumption explicitly in code comments and in `Memory.md`, rather than guessing silently.
