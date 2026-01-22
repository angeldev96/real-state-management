# System Architecture

This document provides a comprehensive overview of the Eretz Realty Admin System architecture, including technology stack, architectural patterns, and system design.

## Technology Stack

### Frontend Layer

**Core Framework**
- **React 19.2.3**: Latest React with concurrent features and automatic batching
- **Next.js 16.1.1**: Full-stack React framework with App Router
- **TypeScript 5.9.3**: Type-safe development with strict mode

**UI & Styling**
- **Tailwind CSS 4.0**: Utility-first CSS framework with JIT compiler
- **Radix UI**: Unstyled, accessible component primitives
  - Dialog, Select, Dropdown, Tooltip, Tabs, Switch, Popover
- **Lucide React 0.562.0**: Modern icon library (562+ icons)
- **clsx + tailwind-merge**: Conditional className utilities

**State Management & Data Fetching**
- **TanStack Query (React Query) v5.90.16**: Server state management
- **React Hook Form**: Form state and validation
- **Zustand** (if needed): Lightweight client state (not currently used)

**UI Enhancements**
- **Sonner 2.0.7**: Toast notification system
- **next-themes 0.4.6**: Dark/light mode with system preference
- **cmdk 1.1.1**: Command palette component

### Backend Layer

**Server Framework**
- **Next.js 16.1.1**: Server-side rendering, API routes, Server Components
- **Node.js 18+**: JavaScript runtime environment

**Database & ORM**
- **SQLite**: Embedded relational database (via better-sqlite3)
- **Drizzle ORM 0.45.1**: Type-safe SQL query builder
- **better-sqlite3 12.6.0**: Native Node.js SQLite3 bindings
- **libsql client 0.17.0**: Turso cloud database compatibility

**Authentication & Security**
- **Jose 6.1.3**: JavaScript implementation of JWT (JSON Web Tokens)
- **Bcryptjs 3.0.3**: Password hashing with bcrypt algorithm
- **HTTP-only cookies**: Secure token storage

**Email Service**
- **Resend 6.7.0**: Modern email API for transactional emails
- **Custom HTML templates**: Responsive email design

**Utilities**
- **Luxon 3.5.0**: DateTime manipulation with timezone support
- **Zod**: Runtime type validation (if used)

### Development & Testing

**Testing Frameworks**
- **Vitest 4.0.17**: Fast unit test runner (Vite-powered)
- **Playwright 1.57.0**: End-to-end browser testing
- **Testing Library**: React component testing utilities
  - @testing-library/react
  - @testing-library/user-event
  - @testing-library/dom

**Development Tools**
- **ESLint 9**: Code linting with Next.js config
- **TypeScript**: Static type checking
- **Prettier** (if configured): Code formatting

### Deployment & Infrastructure

**Hosting**
- **Vercel**: Recommended deployment platform (native Next.js support)
- **Alternative**: Any Node.js hosting (Railway, Render, DigitalOcean)

**Database Hosting**
- **Local**: SQLite file-based database
- **Cloud Option**: Turso (serverless SQLite)

**Email Service**
- **Resend.io**: Cloud email delivery

**Environment**
- **Node.js 18+**: Runtime requirement
- **npm/yarn/pnpm**: Package managers

## Architectural Patterns

### Full-Stack Monolith Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │  React Components (Client Components)              │     │
│  │  - Interactive UI                                   │     │
│  │  - Client-side state                                │     │
│  │  - Event handlers                                   │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/HTTPS
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS SERVER (Single Application)             │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Server Components (React Server Components)       │    │
│  │  - Data fetching at render time                    │    │
│  │  - Direct database access                          │    │
│  │  - No JavaScript sent to client                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  API Routes (/api/*)                               │    │
│  │  - RESTful endpoints                               │    │
│  │  - Authentication                                   │    │
│  │  - User management                                  │    │
│  │  - Cron triggers                                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Server Actions ("use server")                     │    │
│  │  - Form submissions                                 │    │
│  │  - CRUD operations                                  │    │
│  │  - Email sending                                    │    │
│  │  - Data mutations                                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Business Logic Layer                              │    │
│  │  - Database queries (lib/db/queries.ts)            │    │
│  │  - Email functions (lib/email/)                    │    │
│  │  - Authentication (lib/auth/)                      │    │
│  │  - Utilities (lib/utils.ts, lib/formatters.ts)    │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                 │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Drizzle ORM                                       │    │
│  │  - Type-safe queries                               │    │
│  │  - Schema definitions                              │    │
│  │  - Migrations                                      │    │
│  └────────────────────────────────────────────────────┘    │
│                           ↓                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │  SQLite Database (better-sqlite3)                  │    │
│  │  - File: ./local.db                                │    │
│  │  - Tables: users, listings, cycles, etc.           │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               EXTERNAL SERVICES                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Resend.io Email API                               │    │
│  │  - Transactional emails                            │    │
│  │  - Campaign distribution                           │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Next.js App Router Pattern

The application uses Next.js 13+ App Router with the following structure:

**Route Organization**
```
app/
├── page.tsx                    # / (Cycle Manager - Server Component)
├── layout.tsx                  # Root layout with providers
├── login/
│   ├── page.tsx               # /login (Public - Server Component)
│   └── login-client.tsx       # Client component for form
├── listings/
│   ├── page.tsx               # /listings (Server Component)
│   └── listings-page-client.tsx
├── settings/
│   ├── page.tsx               # /settings (Server Component)
│   └── settings-client.tsx
├── users/
│   ├── page.tsx               # /users (Admin only - Server Component)
│   └── users-client.tsx
└── api/                        # API Routes (Route Handlers)
    ├── auth/
    │   ├── login/route.ts
    │   ├── logout/route.ts
    │   └── session/route.ts
    ├── users/
    │   └── [id]/
    │       ├── route.ts
    │       ├── toggle-active/route.ts
    │       └── reset-password/route.ts
    └── cycle/
        └── rotate/route.ts
```

**Rendering Strategy**

1. **Server Components (Default)**
   - Used for all page routes
   - Fetch data server-side
   - No JavaScript sent to client
   - Direct database access
   - Example: `app/page.tsx`, `app/listings/page.tsx`

2. **Client Components ("use client")**
   - Interactive UI elements
   - Event handlers and state
   - Forms and user input
   - Example: `login-client.tsx`, `listings-page-client.tsx`

3. **Server Actions ("use server")**
   - Form mutations
   - Data operations
   - Called from client components
   - Example: `lib/actions.ts`

4. **API Routes**
   - REST endpoints
   - External integrations
   - Cron jobs
   - Example: `app/api/auth/login/route.ts`

## Data Flow Architecture

### Request Lifecycle

#### Page Load (Server Component)

```
User Request
    ↓
Next.js Router
    ↓
Server Component (app/page.tsx)
    ↓
Authentication Check (requireAuth())
    ↓
Database Queries (getListings(), getCycleStats())
    ↓
Props to Client Component
    ↓
React Render (Server-side)
    ↓
HTML + Minimal JS Sent to Client
    ↓
Hydration in Browser
    ↓
Interactive UI
```

#### Form Submission (Server Action)

```
User Fills Form (Client Component)
    ↓
Form Submit Event
    ↓
Call Server Action (createListing())
    ↓
Server-side Execution
    ↓
Authentication Check
    ↓
Validation
    ↓
Database Operation (Drizzle ORM)
    ↓
Revalidate Cache (revalidatePath())
    ↓
Return Response
    ↓
Update UI (React automatic)
    ↓
Show Toast Notification
```

#### API Request (Route Handler)

```
Client Request (fetch('/api/auth/login'))
    ↓
Next.js Route Handler
    ↓
Request Body Parsing
    ↓
Business Logic (validateCredentials())
    ↓
Database Query
    ↓
Token Generation (JWT)
    ↓
Set HTTP-only Cookies
    ↓
JSON Response
    ↓
Client Receives Data
    ↓
Update UI State
```

## Authentication Flow

### Login Process

```
1. User submits email + password
   ↓
2. POST /api/auth/login
   ↓
3. Query users table by email
   ↓
4. Verify password (bcrypt.compare)
   ↓
5. Generate JWT access token (7 days)
   ↓
6. Generate refresh token (UUID)
   ↓
7. Store refresh token in sessions table
   ↓
8. Set HTTP-only cookies:
   - eretz-auth-token (access JWT)
   - eretz-refresh-token (refresh UUID)
   ↓
9. Update user.lastLoginAt
   ↓
10. Return user data (id, email, name, role)
```

### Protected Route Access

```
1. User navigates to protected page
   ↓
2. Server Component executes
   ↓
3. requireAuth() or requireAdmin() called
   ↓
4. Extract JWT from cookies
   ↓
5. Verify JWT signature & expiry
   ↓
6. If invalid, check refresh token
   ↓
7. If refresh valid, issue new access token
   ↓
8. If both invalid, redirect to /login
   ↓
9. If valid, allow access
   ↓
10. Page renders with user data
```

### Session Management

```
Access Token (JWT):
- Payload: { userId, email, name, role }
- Expiry: 7 days
- Stored: HTTP-only cookie
- Verified: On every protected request

Refresh Token:
- Format: UUID v4
- Expiry: 7 days (in database)
- Stored: sessions table + HTTP-only cookie
- Purpose: Renew access token
```

## Email Distribution System

### Cron-Based Campaign Execution

```
1. Vercel Cron or Webhook hits /api/cycle/rotate
   ↓
2. Verify cron secret header
   ↓
3. Check current time >= nextRunAt
   ↓
4. Query cycle_rotation_state for currentCycle
   ↓
5. Fetch listings WHERE cycleGroup = currentCycle AND isActive = true
   ↓
6. Fetch email_recipients WHERE isActive = true
   ↓
7. Group listings by property type
   ↓
8. Generate HTML email template
   ↓
9. Send via Resend.io (batch to all recipients)
   ↓
10. Log to cycle_runs table (status, sentAt)
   ↓
11. Advance cycle: currentCycle = (currentCycle % 3) + 1
   ↓
12. Calculate next run date (Luxon timezone math)
   ↓
13. Update cycle_rotation_state
   ↓
14. Return success response
```

### Email Template Generation

```
listings (array)
    ↓
Group by propertyTypeId
    ↓
Sort groups alphabetically by type name
    ↓
For each group:
    ↓
    Render property type header
    ↓
    Create HTML table
    ↓
    For each listing:
        ↓
        Format price (millions notation)
        ↓
        Join features (comma-separated)
        ↓
        Add "NEW" badge if onMarket
        ↓
        Zebra stripe rows (alternating colors)
        ↓
        Unique row ID (prevent Gmail collapsing)
    ↓
Combine all groups into single HTML
    ↓
Add email header (subject, branding)
    ↓
Add footer
    ↓
Return complete HTML string
    ↓
Send via Resend.io
```

## Database Architecture

### ORM Layer (Drizzle)

**Schema Definition** (`lib/db/schema.ts`)
```typescript
// Tables defined with Drizzle schema
export const users = sqliteTable('users', { ... });
export const listings = sqliteTable('listings', { ... });
export const features = sqliteTable('features', { ... });
// Relations defined
export const usersRelations = relations(users, ...);
export const listingsRelations = relations(listings, ...);
```

**Query Functions** (`lib/db/queries.ts`)
```typescript
// Type-safe queries using Drizzle
export async function getListings() {
  return await db.query.listings.findMany({
    with: {
      propertyType: true,
      condition: true,
      zoning: true,
      listingFeatures: {
        with: { feature: true }
      }
    }
  });
}
```

**Migrations** (`lib/db/migrations/`)
```
- Drizzle Kit generates SQL migrations
- Stored in timestamped folders
- Applied via npm run db:migrate
- Schema changes tracked in version control
```

### Connection Management

```typescript
// lib/db/index.ts
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

const sqlite = new Database('./local.db');
export const db = drizzle(sqlite, { schema });
```

- Single database connection
- File-based SQLite (local.db)
- Connection reused across requests
- No connection pooling needed (embedded DB)

## File Structure

```
real-state-management/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home (Cycle Manager)
│   ├── (routes)/                # Route groups
│   └── api/                     # API routes
├── components/                   # React components
│   ├── ui/                      # Radix UI wrappers
│   ├── layout/                  # Layout components
│   ├── listings/                # Listing components
│   ├── cycle/                   # Cycle components
│   ├── settings/                # Settings components
│   └── providers/               # Context providers
├── lib/                         # Business logic
│   ├── db/                      # Database layer
│   │   ├── schema.ts           # Drizzle schema
│   │   ├── queries.ts          # Database queries
│   │   ├── index.ts            # DB connection
│   │   └── migrations/         # SQL migrations
│   ├── auth/                    # Authentication
│   │   ├── jwt.ts              # JWT functions
│   │   ├── password.ts         # Bcrypt hashing
│   │   ├── session.ts          # Session management
│   │   ├── require-auth.ts     # Route guards
│   │   └── queries.ts          # Auth queries
│   ├── email/                   # Email service
│   │   └── index.ts            # Resend integration
│   ├── actions.ts               # Server actions
│   ├── types.ts                 # TypeScript types
│   ├── utils.ts                 # Utilities
│   └── formatters.ts            # Data formatters
├── public/                      # Static assets
├── tests/                       # Test files
│   ├── unit/                    # Unit tests
│   └── e2e/                     # E2E tests
├── drizzle.config.ts            # Drizzle configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## Deployment Architecture

### Vercel Deployment

```
GitHub Repository
    ↓
Push to main branch
    ↓
Vercel Auto-Deploy
    ↓
Build Process:
  - npm install
  - npm run build (Next.js build)
  - Database migrations (if applicable)
    ↓
Deploy to Edge Network
    ↓
Environment Variables Injected
    ↓
Application Live
```

**Environment Variables Required:**
- `JWT_SECRET`: JWT signing key
- `RESEND_API_KEY`: Email service API key
- `CYCLE_ROTATION_SECRET`: Cron endpoint protection
- `DATABASE_URL`: For Turso cloud DB (optional)

### Cron Job Setup (Vercel)

**vercel.json**
```json
{
  "crons": [{
    "path": "/api/cycle/rotate",
    "schedule": "0 9 * * 1"  // Every Monday at 9 AM
  }]
}
```

## Performance Optimizations

### Server Components Benefits
- Reduced JavaScript bundle size
- Faster initial page load
- Direct database access (no API overhead)
- Automatic code splitting

### Caching Strategy
- Next.js automatic caching for Server Components
- Revalidation on mutations via `revalidatePath()`
- Static asset caching via CDN

### Database Optimizations
- Drizzle prepared statements (efficient queries)
- SQLite indexes on foreign keys
- Eager loading with relations (avoid N+1)

## Security Architecture

### Authentication Security
- JWT with secure signing (HS256)
- HTTP-only cookies (XSS protection)
- SameSite=Lax (CSRF protection)
- Secure flag in production (HTTPS only)
- Password hashing with bcrypt (12 salt rounds)

### Authorization
- Role-based access control (admin/user)
- Route-level guards (requireAuth, requireAdmin)
- API endpoint protection
- Client component permission checks

### Input Validation
- Server-side validation for all mutations
- Type checking with TypeScript
- SQL injection prevention via Drizzle ORM
- XSS prevention via React automatic escaping

## Scalability Considerations

### Current Architecture (Single Server)
- Suitable for: 100-1000 listings, 1000+ email recipients
- Database: SQLite (single file, embedded)
- Bottleneck: Email sending (sequential API calls)

### Scaling Path
1. **Database Migration**: SQLite → PostgreSQL or Turso
2. **Email Queueing**: Background job queue (BullMQ, Inngest)
3. **Horizontal Scaling**: Multiple server instances
4. **CDN**: Static asset distribution
5. **Caching Layer**: Redis for session storage

## Next Steps

For detailed information on specific architectural components:

- [Database Schema](./database-schema.md) - Complete schema documentation
- [API Reference](./api-reference.md) - API endpoint details
- [Authentication](./authentication.md) - Auth implementation guide
- [Email System](./email-system.md) - Email distribution architecture
