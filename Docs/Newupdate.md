# Newupdate.md
## UI/UX Enhancement Pass #2 — App-Wide Polish

**Status:** Requested, not yet built
**Builds on:** PRD.md, Architecture.md, Rules.md, Phases.md, Design.md, Memory.md, Update.md
**Hard constraint:** frontend/presentation-layer only. No changes to the database schema, the 3-tier architecture, or the API contracts beyond what's already flagged below as needing confirmation.

---

## 1. Why This Pass

Pass #1 (`Update.md`) fixed the Dashboard and Departments screens: stat cards, icons, row actions, modals, toasts. This pass extends the same professional standard **app-wide** and adds the polish that separates a "student project" look from a "real product" look — without touching the architecture.

## 2. Requested Changes

### 2.1 Navigation & Shell
- [ ] Collapsible sidebar (icon-only mode) for smaller screens, with a hamburger toggle on mobile
- [ ] Global search input in the top navbar (client-side filter across the currently visible entity list to start — a real cross-entity search is a backend addition, flag separately if wanted)
- [ ] Footer with app name + version (e.g., "UAMS v1.0")
- [ ] Favicon and per-page browser tab titles (e.g., "Departments — UAMS")
- [ ] Sidebar active-item indicator refined (current highlight kept, add a left accent bar for extra clarity)

### 2.2 Feedback & Error Handling
- [ ] Friendly branded 404 page ("Page not found" + link back to dashboard)
- [ ] Friendly 403/"Access Denied" page for role-mismatched routes, instead of a blank screen or raw error
- [ ] Session-expiry handling: if a JWT expires mid-session, show a toast ("Session expired, please log in again") and redirect to login instead of failing silently
- [ ] Disable submit buttons + show a spinner while a form is saving, to prevent double-submits
- [ ] "Unsaved changes" warning when leaving a form with edits (Add/Edit modals)

### 2.3 Forms
- [ ] Consistent inline validation styling everywhere (red border + message under the field), matching `Design.md`
- [ ] Group longer forms (e.g., future Add Faculty / Add Student) into clear labeled sections rather than one long stack of fields
- [ ] Password fields get a show/hide toggle and (on register/change-password) a strength indicator

### 2.4 Tables (apply to Departments now, and to Faculty/Students/Courses/Timetable as each is built)
- [ ] Sortable column headers (click to sort) — client-side sort on already-loaded data; only add a backend sort param if a table grows large enough to need server-side sorting (flag before doing that)
- [ ] Row hover state + zebra striping refined per `Design.md`
- [ ] "Export to CSV" button for the current table view (client-side export of loaded data — no backend change needed)
- [ ] On mobile, tables collapse into stacked cards instead of horizontal scroll

### 2.5 Visual Polish
- [ ] Subtle elevation/shadow + lift-on-hover for all cards (stat cards, quick-link cards)
- [ ] Smooth transitions for modals opening/closing and page/route changes (150–200ms, nothing flashy)
- [ ] Empty-state illustration or icon (not just text) for every list view, not only Departments
- [ ] Confirm every icon in the app comes from one single icon set (whichever was approved in Pass #1) — no mixing icon styles

### 2.6 Personalization (optional — confirm before building)
- [ ] A simple "My Profile" page: view/edit own name, change password
- [ ] Light/dark theme toggle using CSS variables (pure frontend, no schema change) — nice-to-have, not required; ask before investing time here

## 3. Explicitly Out of Scope

- No new database tables/columns
- No new API endpoints except the two optional, clearly-flagged ones above (server-side sort, real cross-entity search) — and only if I confirm I want them
- No change to roles, permissions, or the 3-tier architecture in `Architecture.md`
- No new screens beyond what `Phases.md` already schedules

## 4. Priority (if not doing everything at once)

1. Navigation & shell polish (2.1) + error/feedback handling (2.2) — biggest "feels professional" jump
2. Table improvements (2.4) — sort, export, mobile stacking
3. Visual polish (2.5) — elevation, transitions, empty states
4. Forms (2.3)
5. Personalization (2.6) — only if time allows

## 5. Notes

- Continue using whatever icon and toast library was approved during Pass #1 — don't introduce a second one.
- Log this as "UI Enhancement Pass #2" in `Memory.md`, separate from Pass #1's entry.
