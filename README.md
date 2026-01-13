# Eretz Realty Admin

**Listing Management & Drip Campaign Automation System**

## Quick Start

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

**Login**: `admin@eretzrealty.com` / `admin123`

---

## Overview

Full-stack application for managing property listings with:
- Next.js 16 (App Router) + TypeScript
- SQLite backend with Drizzle ORM
- JWT authentication with secure sessions
- Shadcn UI components

---

## Core Business Logic: The Cycle

Properties are sent in three curated waves per month:
- **Week 1** → Day 1
- **Week 2** → Day 15  
- **Week 3** → Day 25

### Status Fields

| Field | TRUE | FALSE |
|-------|------|-------|
| `on_market` | Shows "NEW" badge | No badge (still for sale) |
| `is_active` | Active in system | Archived |

---

## Database Schema

### Auth Tables
- `users` - Admin accounts (email, password, role)
- `sessions` - JWT refresh tokens

### Core Tables
- `listings` - Properties with cycle_group, on_market, is_active
- `property_types`, `conditions`, `zonings`, `features` - Lookups
- `listing_features` - Many-to-many pivot
- `cycle_schedules` - Send day configuration

---

## Auth System

- **JWT tokens**: 15min access, 7d refresh
- **bcrypt**: 12 rounds password hashing
- **httpOnly cookies**: XSS protection
- **Middleware**: Protects all routes except /login

---

## Project Structure

```
app/
  api/auth/     - Login, logout, session APIs
  login/        - Login page
  listings/     - Listings management
  settings/     - Scheduler settings
  page.tsx      - Dashboard

lib/
  auth/         - JWT, passwords, sessions
  db/           - Schema, queries, migrations
  actions.ts    - Server actions
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run db:generate` | Generate migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Drizzle Studio |
