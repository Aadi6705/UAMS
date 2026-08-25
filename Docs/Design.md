# Design.md
## Visual design system for UAMS

Built on Bootstrap 5 defaults, customized with a focused palette so it doesn't look like an unstyled Bootstrap template.

---

## 1. Design Principles

- **Role clarity**: each role's dashboard should be visually distinct enough that a screenshot alone tells you who's logged in.
- **Data-first**: dashboards lead with numbers/status (attendance %, CGPA, counts), not decoration.
- **Consistency over novelty**: same spacing, same component patterns everywhere — a table looks like a table on every page.
- **Warn, don't hide**: low attendance / eligibility issues should be visually flagged (color + icon), never buried.

## 2. Color Palette

| Role | Purpose | Color | Hex |
|---|---|---|---|
| Primary | Brand / navbar / primary actions | Indigo Blue | `#3B4CCA` |
| Secondary | Supporting UI, sidebar | Slate Gray | `#4B5563` |
| Success | Present, eligible, on-track | Green | `#22C55E` |
| Warning | Attendance near threshold, pending | Amber | `#F59E0B` |
| Danger | Absent, ineligible, below threshold | Red | `#EF4444` |
| Background | Page background | Off-white | `#F8F9FB` |
| Surface | Cards, tables | White | `#FFFFFF` |
| Text — primary | Body text | Charcoal | `#1F2937` |
| Text — muted | Labels, secondary text | Gray | `#6B7280` |
| Border | Dividers, table borders | Light Gray | `#E5E7EB` |

### Role accent (optional, for sidebar/badge differentiation)
| Role | Accent |
|---|---|
| Admin | Indigo `#3B4CCA` |
| Faculty | Teal `#0D9488` |
| Student | Blue `#2563EB` |

## 3. Typography

| Use | Font | Weight | Size |
|---|---|---|---|
| Headings (H1) | Inter / system-ui | 700 | 28px |
| Headings (H2) | Inter / system-ui | 600 | 22px |
| Headings (H3) | Inter / system-ui | 600 | 18px |
| Body | Inter / system-ui | 400 | 15px |
| Small / labels | Inter / system-ui | 500 | 13px |
| Numeric stats (dashboard cards) | Inter / system-ui | 700 | 32px |

Fallback stack: `"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`

## 4. Layout Conventions

- **App shell**: top navbar (brand + user menu) + left sidebar (role-specific nav) + main content area.
- **Dashboard cards**: stat cards use a white surface, subtle border, 8px border-radius, and a single bold number with a muted label underneath.
- **Tables**: striped rows, sticky header on scroll, right-aligned numeric columns, status shown as a colored pill/badge rather than plain text.
- **Forms**: labels above inputs, inline validation messages in red directly under the field, primary action button bottom-right of the form.
- **Spacing scale**: 4 / 8 / 16 / 24 / 32px — no arbitrary values.

## 5. Status & Badge Conventions

| Status | Badge color | Example |
|---|---|---|
| Present | Green pill | Attendance record |
| Absent | Red pill | Attendance record |
| Eligible | Green pill | Exam eligibility |
| Not Eligible | Red pill | Exam eligibility |
| ≥85% attendance | Green text | Dashboard stat |
| 75–84% attendance | Amber text | Dashboard stat |
| <75% attendance | Red text + ⚠️ icon | Dashboard stat |

## 6. Dashboard Sketches (reference only)

**Admin**
```
Students 2,450 | Faculty 125 | Courses 86 | Departments 12
[ Attendance overview bar ]
```

**Faculty**
```
My Courses 4 | Students 186 | Classes Today 3 | Attendance Pending 1
[ Today's classes list ]
```

**Student**
```
Overall Attendance: 82% (green)
[ Per-subject attendance list, red flag on subjects <75% ]
CGPA 8.42
[ Today's classes ]
```

## 7. Accessibility

- Minimum text contrast: WCAG AA (4.5:1 for body text)
- Never use color alone to convey status — always pair with text or an icon (e.g., "⚠️ 68%" not just red text)
- All interactive elements reachable via keyboard; visible focus states (don't strip Bootstrap's default outline)
