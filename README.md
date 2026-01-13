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

---

## Deployment to Vercel

### Environment Variables (Required)

In **Vercel Dashboard → Project Settings → Environment Variables**, add:

| Variable | Value | Required |
|----------|-------|----------|
| `JWT_SECRET` | Generate with `openssl rand -base64 32` | ✅ Yes |
| `NODE_ENV` | `production` | Auto-set by Vercel |

### Generate JWT Secret

```bash
# Run this in your terminal and copy the output
openssl rand -base64 32
```

### Database: Turso Setup

⚠️ **SQLite does NOT work on Vercel** - use Turso instead.

#### Step 1: Install Turso CLI

```bash
# macOS
brew install tursodatabase/tap/turso

# Or with curl
curl -sSfL https://get.tur.so/install.sh | bash
```

#### Step 2: Login & Create Database

```bash
turso auth login
turso db create eretz-realty
```

#### Step 3: Get Credentials

```bash
# Get database URL
turso db show eretz-realty --url

# Create auth token
turso db tokens create eretz-realty
```

#### Step 4: Add to Vercel Environment Variables

| Variable | Value |
|----------|-------|
| `JWT_SECRET` | Your generated secret |
| `TURSO_DATABASE_URL` | `libsql://eretz-realty-YOUR_USERNAME.turso.io` |
| `TURSO_AUTH_TOKEN` | Token from step 3 |

#### Step 5: Push Schema to Turso

```bash
# Generate SQL from your schema
npx drizzle-kit push
```

### Deploy Steps

1. Push code to GitHub
2. Connect repo in Vercel Dashboard
3. Add environment variables (JWT_SECRET, TURSO_*)
4. Deploy!
5. Run migrations on Turso (see Step 5 above)

---

## Local Development

Create `.env.local`:

```env
# Optional for local dev (has fallback)
JWT_SECRET=any-secret-for-local-development
```
