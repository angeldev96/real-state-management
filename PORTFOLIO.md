# Eretz Realty Admin — Listing Management & Drip Campaign Automation

## Project Overview

**Industry:** Real Estate (Brooklyn, NY)
**Role:** Full-Stack Developer (Solo)
**Timeline:** Design, development, and deployment
**Status:** In Production

A real estate agent in New York was managing hundreds of property listings manually through spreadsheets and sending weekly email campaigns by hand — a tedious, error-prone, and time-consuming process. I was hired to build a complete web-based platform that centralizes listing management, automates weekly email campaigns through an intelligent cycle rotation engine, and provides a multi-user admin dashboard with role-based access control.

**The result:** What used to take hours of manual work every week now runs entirely on autopilot.

---

## The Problem

- Property listings were tracked in spreadsheets with no structure or validation.
- Weekly email campaigns were composed manually, selecting which properties to send each week.
- No system existed to rotate property groups across weeks, leading to inconsistent outreach.
- Recipient lists were managed in scattered documents.
- No visibility into campaign history or delivery status.

## The Solution

A full-stack web application that:

1. **Centralizes all property listings** in a normalized, searchable database with full CRUD operations.
2. **Automates weekly email campaigns** through a 3-cycle rotation engine that sends curated property batches on a configurable schedule.
3. **Generates professionally styled HTML emails** with properties grouped by type, responsive tables, and branding.
4. **Provides a multi-user admin dashboard** with authentication, role-based access, and a settings panel.

---

## Key Features

### Property Listings Management
- Full CRUD operations with form validation.
- Advanced filtering by cycle group, property type, condition, zoning, and active status.
- Search by address or location description.
- Multi-select tagging for property features (Detached, Parking, Garage, Brick, etc.).
- Toggle "On Market" status — automatically displays a **NEW** badge in email campaigns.
- Toggle active/inactive to archive listings without deleting them.
- Paginated data tables for efficient navigation through large datasets.

### Automated Cycle Rotation Engine
- Properties are assigned to **Cycle 1, 2, or 3** by the admin.
- The system automatically rotates through cycles weekly: 1 → 2 → 3 → 1 → ...
- Configurable send day (Monday–Sunday) and time.
- Timezone-aware scheduling (America/New_York).
- Powered by a cron job that checks every 5 minutes and triggers when conditions are met.
- Full audit log of every cycle run (scheduled time, sent time, status, errors).

### Email Campaign Automation
- Automated HTML email generation with professionally styled tables.
- Properties grouped by type (1 Family, Condo, Co-op, etc.) with styled headers.
- Zebra-striped rows and unique row IDs (prevents Gmail from collapsing rows).
- Smart price formatting ($2,700,000 → $2.7M).
- Customizable intro text, agent information, and legal disclaimers.
- Test email functionality to preview before live sends.
- Recipient list management with active/inactive toggles.

### Authentication & Security
- JWT-based authentication with httpOnly secure cookies (XSS-safe).
- bcrypt password hashing (12 salt rounds).
- Dual-token strategy (access token + refresh token with DB-backed sessions).
- Role-based access control (Admin / User).
- Session invalidation on password reset or account deactivation.
- Protected API routes and server actions with auth guards.
- Comprehensive security headers (HSTS, X-Frame-Options, CSP, Referrer-Policy).

### User Management (Admin Panel)
- Create, edit, and deactivate user accounts.
- Reset passwords with automatic session invalidation across all devices.
- Self-deletion and self-deactivation prevention safeguards.
- Last login tracking.

### Settings & Configuration
- Cycle rotation schedule (day of week, send hour/minute).
- Lookup table management (property types, conditions, zonings, features).
- Email template settings (intro text, agent info, legal disclaimer).
- Current cycle status and next scheduled send date.

### SEO & Performance
- Server-side rendering with Next.js App Router for fast initial loads.
- Image optimization with AVIF/WebP format support and responsive device sizes.
- Compression enabled for all responses.
- Efficient database queries using Drizzle ORM with JOINs (no N+1 queries).
- Metadata configuration for proper indexing and crawlability.
- Strict security headers for trust signals and protection.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5.9 (strict mode) |
| **Frontend** | React 19, Tailwind CSS 4, Shadcn UI, Radix UI |
| **Backend** | Next.js API Routes + Server Actions |
| **Database** | SQLite (dev) / Turso (production — managed SQLite) |
| **ORM** | Drizzle ORM |
| **Authentication** | JWT (jose), bcryptjs, httpOnly cookies |
| **Email Service** | Resend API |
| **Scheduling** | Vercel Cron Jobs |
| **Testing** | Vitest (unit), Playwright (E2E) |
| **Deployment** | Vercel (serverless) |
| **Icons** | Lucide React |
| **Notifications** | Sonner (toast notifications) |
| **Date/Time** | Luxon (timezone-aware) |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT (Browser)                  │
│  React 19 + Shadcn UI + Tailwind CSS                │
│  Client Components for interactivity                │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              NEXT.JS APP ROUTER                     │
│  Server Components ──── Data fetching (SSR)         │
│  Server Actions ─────── Mutations (create/update)   │
│  API Routes ─────────── REST endpoints              │
│  Middleware ─────────── JWT verification on every    │
│                         request                     │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              BUSINESS LOGIC LAYER                   │
│  Auth Guards ────────── requireAuth / requireAdmin   │
│  Cycle Engine ───────── Rotation state machine       │
│  Email Generator ────── HTML template engine         │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              DATA LAYER (Drizzle ORM)               │
│  Type-safe queries ── JOINs, relations, filters     │
│  Schema-driven ────── Migrations & seed data        │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              DATABASE                               │
│  SQLite (local) / Turso (production)                │
│  12 tables — users, listings, cycles, emails, etc.  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                      │
│  Resend ─────────── Email delivery                  │
│  Vercel Cron ────── Scheduled cycle rotation        │
│  Turso ──────────── Managed database hosting        │
└─────────────────────────────────────────────────────┘
```

---

## Database Schema (12 Tables)

| Table | Purpose |
|-------|---------|
| `users` | Admin and user accounts with roles |
| `sessions` | Refresh token storage for session management |
| `listings` | Property listings with all details |
| `listingFeatures` | Many-to-many pivot for listing ↔ feature |
| `propertyTypes` | Catalog: 1 Family, Condo, Co-op, Lot, etc. |
| `conditions` | Catalog: Needs Work, Good, Great, Luxury, etc. |
| `zonings` | Catalog: R5, R6, etc. |
| `features` | Catalog: Detached, Parking, Garage, Brick, etc. |
| `cycleSchedules` | Week number and send day mapping |
| `cycleRotationConfig` | Singleton config for rotation schedule |
| `cycleRotationState` | Current cycle, last run, next run |
| `cycleRuns` | Audit log of every campaign sent |
| `emailSettings` | Customizable email template content |
| `emailRecipients` | Managed distribution list |

---

## UI / UX Highlights

- **Dark mode support** with system preference detection.
- **Command palette** for quick navigation and search.
- **Collapsible sidebar** with persistent state.
- **Toast notifications** for real-time feedback on all actions.
- **Confirmation dialogs** for destructive operations (delete, deactivate).
- **Responsive design** — fully functional on desktop, tablet, and mobile.
- **Accessible components** built on Radix UI primitives (WCAG compliant).
- **Loading states** and optimistic UI for smooth interactions.

---

## Security Measures

- **Authentication:** JWT with httpOnly + Secure + SameSite cookies.
- **Password Storage:** bcrypt with 12 salt rounds.
- **Session Management:** DB-backed refresh tokens with cascade invalidation.
- **API Protection:** Auth middleware on all routes + admin-only guards.
- **Headers:** HSTS, X-Frame-Options (DENY), X-Content-Type-Options, XSS Protection, strict Referrer-Policy, Permissions-Policy.
- **CSRF Protection:** SameSite cookie policy.
- **Input Validation:** Server-side validation on all mutations.
- **Self-harm Prevention:** Admins cannot delete or deactivate their own account.

---

## Outcome

| Metric | Before | After |
|--------|--------|-------|
| Weekly email preparation | 2-3 hours manual work | Fully automated |
| Listing management | Scattered spreadsheets | Centralized dashboard |
| Campaign consistency | Inconsistent, error-prone | Predictable 3-cycle rotation |
| Recipient management | Manual email lists | Managed with active/inactive toggles |
| Multi-user access | Single spreadsheet owner | Role-based admin panel |
| Delivery tracking | No visibility | Full audit log per cycle |

---

## Skills Demonstrated

- Full-stack application architecture and development
- Database design and normalization (relational schema with 12+ tables)
- Authentication and authorization system design (JWT, RBAC)
- Automated workflow engine (cycle rotation state machine)
- Email template engineering (HTML emails compatible with Gmail, Outlook)
- API design (RESTful endpoints + Server Actions)
- Responsive UI development with component library integration
- Production deployment and DevOps (Vercel, Turso, Cron Jobs)
- Testing strategy (unit + E2E)
- Security best practices (OWASP-aligned)
