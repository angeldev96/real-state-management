# 🏠 Eretz Realty Admin
**Definitive README (Frontend Only, Mock Data)**

This document summarizes what was built, why, and how to extend it. It is ready to share with the Product Owner.

---

## 1) Executive Overview
- Goal: Centralize messy listing spreadsheets into a normalized system, enable curated weekly drip emails, and keep exclusivity over the data.
- Status: Frontend built in Next.js (App Router) with Tailwind/Shadcn. Uses mock data from `legacy.csv` and `dropdown.txt`. No backend yet.
- Core pillars:
  - **Curation over automation**: Eretz manually assigns each property to a “cycle group” (Week 1/2/3).
  - **Data integrity by design**: All categorizable fields use dropdowns/lookups; no free text for categories.
  - **Scheduler-first**: The email cycle is the heart of the product.

---

## 2) Core Business Logic: “The Cycle”
The system sends listings in three curated waves per month:
- **Week 1** → default day `1`
- **Week 2** → default day `15`
- **Week 3** → default day `25` (safer than 30 for February)

Key rules:
1) No “blast all”. Properties are rotated across weeks.
2) Manual curation: Eretz picks the cycle for each property to keep a balanced mix.
3) `is_active` ≠ “which week”. `is_active` controls the “NEW LISTING” badge; `cycle_group` controls when it’s emailed.
4) Dates are configurable in **Settings** (`cycle_schedules`).

Workflow:
1) Eretz creates/edits a listing, picks `cycle_group` (1/2/3), and toggles `is_active`.
2) Scheduler (future backend) sends the listings for that group on the configured day.

---

## 3) Database Design (PostgreSQL)
Even though we’re currently using mock data, the schema is ready for a real DB. Mirrors `database.sql`.

Lookup tables (feed dropdowns):
- `property_types` (id, name)
- `conditions` (id, name)
- `zonings` (id, code)
- `features` (id, name)

Core tables:
- `listings`
  - `id`, `address`, `location_description`, `dimensions`
  - `rooms` (nullable), `square_footage` (nullable), `price` (nullable)
  - `is_active` (bool), `cycle_group` (1|2|3)
  - FKs: `property_type_id`, `condition_id`, `zoning_id`
  - Timestamps
- `listing_features` (pivot many-to-many)
- `cycle_schedules` (week_number PK, day_of_month, description)

Index in `database.sql`:
- `idx_listings_cycle_active` on (`cycle_group`, `is_active`) to speed up scheduler queries.

---

## 4) Frontend Implementation
Tech stack:
- **Next.js 16 (App Router) + TypeScript**
- **Tailwind v4 + Shadcn UI + Lucide icons**
- **Mock data**: `lib/mock-data.ts` (parsed/cleaned from `legacy.csv` and `dropdown.txt`)

Key screens:
- **Cycle Manager (Dashboard)** `app/page.tsx`
  - Tabs Week 1/2/3 with cards per property.
  - Cycle stat cards: total vs active, next send date, “next up” badge.
- **All Listings** `app/listings/page.tsx`
  - Table view (sortable) and Grid view (cards).
  - Faceted filters: cycle, type, zoning, condition, status, search by address.
- **Settings** `app/settings/page.tsx`
  - Edit cycle send days (1–31) for Week 1/2/3.
  - Shows next computed date based on today.

Shared components:
- `listing-form` (create/edit) with strict dropdowns and multi-select features.
- `listings-table` (sorting, actions), `listing-card`, `listing-filters`, `multi-select`.
- `sidebar`, `page-header`, `cycle-stats-card`.

Theme:
- Custom Tailwind theme (emerald/gold accents), responsive, with subtle animations and data-friendly layout.

---

## 5) Mock Data & Types
- Types live in `lib/types.ts`.
- Mock data + helpers in `lib/mock-data.ts`:
  - Lookup seeds from `dropdown.txt`.
  - 18 cleaned listings from `legacy.csv` with enriched relations.
  - Helpers to format price/sqft, compute next send date, and resolve relations.

---

---

## 7) Next Steps (Backend & Scheduler)
- Add API Routes (Next.js) or a small service to:
  - CRUD listings and lookups.
  - Persist filters/pagination.
  - Expose a scheduler endpoint to be triggered by cron/queue.
- Implement email sender (Resend/SendGrid/SMTP).
- Apply `database.sql` to Postgres and wire Prisma/Drizzle.
- Add authentication/roles and audit logs.

---

