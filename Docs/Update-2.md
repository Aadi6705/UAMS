# Update.md
## UI/UX Enhancement Pass — Admin Dashboard & Departments

**Status:** Requested, not yet built
**Builds on:** PRD.md, Architecture.md, Rules.md, Phases.md, Design.md, Memory.md — does not replace any of them

---

## 1. Current State (from screenshots)

**Admin Dashboard**
- Sidebar: Dashboard, Departments, Faculty, Students, Courses, Timetable — text only, no icons
- Top bar: "Welcome, admin" + a static "ADMIN" pill + a separate "Logout" button
- Main content: three plain cards (Departments, Faculty, Students) — each just a title, a sentence of description, and a "Go to X" button
- No live counts, no charts, no activity — and a large empty area below the cards

**Manage Departments**
- Sidebar same as above
- "+ Add Department" button (solid, top right)
- A plain table: ID, CODE (gray pill), Department Name
- No edit/delete actions, no search, no pagination, no empty state

**Assessment:** functionally correct, but reads as an early wireframe rather than a finished admin panel. The core gaps are (a) no real data/interactivity on the dashboard, (b) no row-level actions on tables, (c) no feedback (toasts/confirmations/loading), (d) no icons or user-menu polish.

## 2. Goals for This Pass

- Make it look and feel like a professional admin panel
- Add real interactivity: modals, row actions, confirmations, feedback
- Turn the dashboard into an actual data-driven view, not three static cards
- Apply `Design.md` more completely (icons, badges, spacing, hierarchy)

## 3. Requested Changes

### 3.1 Global / Layout
- [ ] Icons on every sidebar nav item, left of the label
- [ ] Replace the "ADMIN" pill + separate "Logout" with one user-menu dropdown (avatar/initials, name, role, Logout inside)
- [ ] Breadcrumb trail under the top bar (e.g., `Home / Departments`)
- [ ] Hover states on sidebar items, buttons, and table rows
- [ ] Loading/skeleton state instead of a blank flash while data fetches
- [ ] Toast notifications for success/error on create, update, and delete

### 3.2 Admin Dashboard
- [ ] Convert the three description cards into **stat cards** with a live count + icon (Departments, Faculty, Students), per the `Design.md` dashboard sketch
- [ ] Add a fourth stat card: **Courses** (currently missing entirely)
- [ ] Fill the empty space below the stat cards with one chart (e.g., students per department) or a simple overview widget
- [ ] Add a small "Recent Activity" or "Quick Links" panel below/beside the stats
- [ ] Keep "Go to X" as a secondary, compact action — not the main content of the page

### 3.3 Manage Departments (apply the same pattern later to Faculty/Students/Courses tables)
- [ ] Edit and Delete actions per row (icon buttons)
- [ ] Delete confirmation modal ("Are you sure you want to delete Computer Science & Engineering?")
- [ ] Search/filter input above the table
- [ ] Pagination once the list can exceed one page
- [ ] "+ Add Department" opens a modal form instead of navigating to a separate page
- [ ] Empty-state message/illustration for zero departments

### 3.4 Consistency Pass
- [ ] Status/code pills follow `Design.md` badge conventions everywhere, not just on department codes
- [ ] Spacing follows the 4/8/16/24/32px scale from `Design.md` — current dashboard card margins look inconsistent
- [ ] Typography matches `Design.md` (Inter, defined weight/size scale)

## 4. Out of Scope for This Pass

- New backend endpoints beyond small, additive ones needed for search/pagination/counts
- Any change to the database schema
- New roles, permissions, or screens not already built (Faculty/Students/Courses/Timetable stay on `Phases.md`'s order)

## 5. Notes

- No new library (icons, charts, toasts) should be added without checking it against `Rules.md`'s approved stack first — see the kickoff prompt's decision-making rule.
- This is a UI-only enhancement round, not a numbered phase — log it in `Memory.md` as its own entry so it's clear it sits outside `Phases.md`'s sequence.
