# Development Setup

This guide will help you set up your development environment for the Eretz Realty Admin System.

## Prerequisites

### Required Software

**Node.js & npm**
- **Version**: Node.js 18.0 or higher
- **Check version**: `node --version`
- **Download**: [nodejs.org](https://nodejs.org/)

**Git**
- **Version**: Any recent version
- **Check version**: `git --version`
- **Download**: [git-scm.com](https://git-scm.com/)

**Code Editor**
- **Recommended**: Visual Studio Code
- **Alternative**: Any editor with TypeScript support

### Recommended Tools

**VS Code Extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- SQLite Viewer

**Database Tools:**
- **DB Browser for SQLite**: GUI for viewing/editing SQLite databases
- **TablePlus**: Universal database client (supports SQLite)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd real-state-management
```

### 2. Install Dependencies

```bash
npm install
```

This installs all dependencies defined in `package.json`:
- React, Next.js, TypeScript
- Drizzle ORM, better-sqlite3
- UI libraries (Radix UI, Tailwind)
- Development tools (Vitest, Playwright, ESLint)

**Installation Time**: 2-5 minutes depending on internet speed

### 3. Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```bash
# JWT Secret (required)
# Generate with: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Service (Resend.io)
RESEND_API_KEY=re_your_resend_api_key_here

# Cycle Rotation Secret (for cron protection)
CYCLE_ROTATION_SECRET=your-cron-secret-key

# Database (optional - defaults to ./local.db)
DATABASE_URL=file:./local.db

# Node Environment
NODE_ENV=development
```

**Getting API Keys:**

**Resend.io (Email Service):**
1. Sign up at [resend.com](https://resend.com)
2. Create API key in dashboard
3. Add to `RESEND_API_KEY`
4. Verify domain (or use test mode)

**JWT Secret:**
Generate a secure random string:
```bash
# macOS/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Database Setup

**Initialize Database:**

```bash
# Generate Drizzle migrations
npm run db:generate

# Apply migrations (creates local.db file)
npm run db:migrate

# Seed initial data (optional but recommended)
npm run db:seed
```

**What Gets Created:**

```
📁 real-state-management/
├── local.db              # SQLite database file
└── lib/db/migrations/    # Migration files
    ├── 0000_initial_schema/
    │   ├── migration.sql
    │   └── snapshot.json
    └── meta/
        └── _journal.json
```

**Seed Data Includes:**
- Default admin user (`admin@eretzrealty.com` / password: `admin123`)
- Sample property types (Apartment, Commercial, Land, etc.)
- Sample conditions (Excellent, Good, Fair, Poor)
- Sample zonings (R1, R2, C1, C2, M1)
- Sample features (Renovated, Parking, Garden, Pool)
- Cycle schedules (Cycle 1, 2, 3)

**Verify Database:**

```bash
# View database file (macOS/Linux)
sqlite3 local.db ".tables"

# Or use DB Browser for SQLite (GUI)
```

### 5. Start Development Server

```bash
npm run dev
```

**Output:**
```
▲ Next.js 16.1.1
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
```

**Access Application:**
- Open browser: `http://localhost:3000`
- Login page should appear
- Use seeded admin credentials to log in

### 6. Verify Installation

**Checklist:**
- [  ] Development server starts without errors
- [  ] Can access http://localhost:3000
- [  ] Login page loads
- [  ] Can log in with admin credentials
- [  ] Dashboard displays after login
- [  ] No console errors in browser dev tools

## Development Workflow

### File Watching & Hot Reload

Next.js development server automatically:
- Watches file changes
- Recompiles on save
- Hot reloads browser
- Shows compilation errors in terminal and browser

**Fast Refresh:**
- React component changes apply without full page reload
- Preserves component state when possible
- Shows errors in browser overlay

### Running the Development Server

**Start server:**
```bash
npm run dev
```

**Options:**
```bash
# Run on different port
npm run dev -- --port 3001

# Run with experimental features
npm run dev -- --turbo
```

**Stopping server:**
- Press `Ctrl+C` in terminal

### Database Development

#### Making Schema Changes

**1. Edit Schema:**

Edit `lib/db/schema.ts`:
```typescript
export const listings = sqliteTable('listings', {
  // Add new column
  newField: text('newField'),
  // ... existing columns
});
```

**2. Generate Migration:**

```bash
npm run db:generate
```

Drizzle Kit prompts for migration name. This creates:
```
lib/db/migrations/0001_add_new_field/
├── migration.sql
└── snapshot.json
```

**3. Review Migration:**

Check `migration.sql`:
```sql
ALTER TABLE listings ADD COLUMN newField TEXT;
```

**4. Apply Migration:**

```bash
npm run db:migrate
```

**5. Update TypeScript Types:**

Types are automatically generated from schema. Restart TypeScript server in VS Code:
- `Cmd+Shift+P` → "TypeScript: Restart TS Server"

#### Database Scripts

```bash
# Generate migrations from schema changes
npm run db:generate

# Apply pending migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio

# Seed database with initial data
npm run db:seed

# Drop database and start fresh
rm local.db && npm run db:migrate && npm run db:seed
```

#### Drizzle Studio

Web-based database viewer:

```bash
npm run db:studio
```

Opens: `https://local.drizzle.studio`

**Features:**
- Browse all tables
- View and edit data
- Execute SQL queries
- Visualize relationships

### Code Quality Tools

#### TypeScript

**Type Checking:**
```bash
npm run type-check
```

**VS Code Integration:**
- TypeScript errors shown inline
- Hover for type information
- Auto-completion with types

#### ESLint

**Run Linter:**
```bash
npm run lint
```

**Auto-fix:**
```bash
npm run lint -- --fix
```

**VS Code Integration:**
- Install ESLint extension
- Errors shown inline
- Auto-fix on save (configure in settings)

#### Prettier (if configured)

**Format Code:**
```bash
npm run format
```

**VS Code Integration:**
- Install Prettier extension
- Format on save

### Testing

#### Unit Tests (Vitest)

**Run all tests:**
```bash
npm test
```

**Watch mode:**
```bash
npm run test:watch
```

**Coverage:**
```bash
npm run test:coverage
```

**Run specific test file:**
```bash
npm test listings.test.ts
```

#### E2E Tests (Playwright)

**Install browsers (first time only):**
```bash
npx playwright install
```

**Run E2E tests:**
```bash
npm run test:e2e
```

**Run in UI mode (interactive):**
```bash
npm run test:e2e -- --ui
```

**Run specific browser:**
```bash
npm run test:e2e -- --project=chromium
```

### Debugging

#### Browser DevTools

**React DevTools:**
1. Install React DevTools extension
2. Open browser DevTools
3. "Components" tab shows React tree
4. "Profiler" tab for performance

**Network Inspection:**
- DevTools → Network tab
- Monitor API calls
- View request/response headers and bodies

#### VS Code Debugging

**Launch Configuration** (`.vscode/launch.json`):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

**Usage:**
1. Start dev server: `npm run dev`
2. Set breakpoints in VS Code
3. Press F5 or Run → Start Debugging
4. Trigger breakpoint in browser

#### Console Logging

**Server-side:**
```typescript
console.log('Server:', data); // Appears in terminal
```

**Client-side:**
```typescript
console.log('Client:', data); // Appears in browser console
```

**Server Actions:**
```typescript
'use server'
export async function myAction() {
  console.log('This runs on server'); // Terminal
}
```

### Common Development Tasks

#### Add a New Page

1. Create route folder:
```bash
mkdir -p app/new-page
```

2. Create page file:
```typescript
// app/new-page/page.tsx
export default function NewPage() {
  return <div>New Page Content</div>;
}
```

3. Add navigation link (if needed):
```typescript
// components/layout/sidebar.tsx
<Link href="/new-page">New Page</Link>
```

#### Add a New API Endpoint

1. Create route handler:
```bash
mkdir -p app/api/new-endpoint
```

2. Create route file:
```typescript
// app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

#### Add a New Server Action

Edit `lib/actions.ts`:
```typescript
'use server'

export async function myNewAction(data: MyData): Promise<ActionResponse> {
  // Authentication check
  const session = await getServerSession();
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Your logic here
    await db.insert(myTable).values(data);

    // Revalidate affected pages
    revalidatePath('/my-page');

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create' };
  }
}
```

#### Add a New Component

```bash
mkdir -p components/my-feature
```

```typescript
// components/my-feature/my-component.tsx
'use client' // If needs interactivity

export function MyComponent() {
  return <div>My Component</div>;
}
```

#### Add a New Database Table

1. Define in schema:
```typescript
// lib/db/schema.ts
export const myNewTable = sqliteTable('my_new_table', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});
```

2. Generate and apply migration:
```bash
npm run db:generate
npm run db:migrate
```

3. Add queries in `lib/db/queries.ts`

## Troubleshooting

### Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
```bash
# Option 1: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
npm run dev -- --port 3001
```

### Database Locked Error

**Error:**
```
SqliteError: database is locked
```

**Cause:** Another process has the database open

**Solutions:**
1. Close DB Browser for SQLite or other DB tools
2. Stop duplicate dev servers
3. Delete `local.db-journal` file (if stale)

### Module Not Found

**Error:**
```
Module not found: Can't resolve '@/lib/...'
```

**Solutions:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Type Errors After Schema Changes

**Issue:** TypeScript doesn't recognize new columns

**Solution:**
```bash
# Regenerate types
npm run db:generate

# Restart TS server in VS Code
```

### "use client" vs "use server" Confusion

**Error:**
```
You're importing a component that needs useState.
It only works in a Client Component but none of its parents are marked with "use client"
```

**Solution:**
Add `'use client'` at top of component file:
```typescript
'use client'

import { useState } from 'react';

export function MyComponent() {
  const [state, setState] = useState();
  // ...
}
```

**Rule of Thumb:**
- Server Component (default): No interactivity, direct DB access
- Client Component ("use client"): Interactive, uses hooks
- Server Action ("use server"): Mutation functions called from client

### Build Errors in Production

**Issue:** Build succeeds locally but fails in deployment

**Solution:**
```bash
# Test production build locally
npm run build

# Fix any errors shown
# Then test production server
npm run start
```

## Next Steps

- [Testing Guide](./testing-guide.md) - Writing and running tests
- [API Reference](./api-reference.md) - Available APIs for development
- [Architecture](./architecture.md) - Understanding system architecture
- [Deployment Guide](./deployment-guide.md) - Deploying to production
