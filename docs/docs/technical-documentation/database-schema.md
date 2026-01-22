# Database Schema

Complete documentation of the Eretz Realty Admin System database schema, including all tables, relationships, indexes, and constraints.

## Database Technology

- **Database**: SQLite 3
- **ORM**: Drizzle ORM 0.45.1
- **Driver**: better-sqlite3 12.6.0
- **File Location**: `./local.db` (development)
- **Cloud Option**: Turso (serverless SQLite)

## Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────────┐
│   users     │──┐    │   sessions       │
│             │  │    │                  │
│ id (PK)     │  └───→│ userId (FK)      │
│ email       │       │ token            │
│ password    │       │ expiresAt        │
│ name        │       └──────────────────┘
│ role        │
│ isActive    │
└─────────────┘

┌─────────────────────┐       ┌──────────────────┐
│   listings          │──┐    │ property_types   │
│                     │  └───→│ id (PK)          │
│ id (PK)             │       │ name (UNIQUE)    │
│ address             │       │ isActive         │
│ propertyTypeId (FK) │       └──────────────────┘
│ conditionId (FK)    │
│ zoningId (FK)       │──┐    ┌──────────────────┐
│ cycleGroup (FK)     │  └───→│ conditions       │
│ onMarket            │       │ id (PK)          │
│ isActive            │       │ name (UNIQUE)    │
└──────────┬──────────┘       │ isActive         │
           │                  └──────────────────┘
           │
           │                  ┌──────────────────┐
           └─────────────────→│ zonings          │
                              │ id (PK)          │
                              │ code (UNIQUE)    │
                              │ isActive         │
                              └──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│ listing_features │       │   features       │
│ (Junction Table) │       │                  │
│ listingId (FK)   │──────→│ id (PK)          │
│ featureId (FK)   │       │ name (UNIQUE)    │
└──────────────────┘       │ isActive         │
                           └──────────────────┘

┌─────────────────────┐
│ cycle_schedules     │
│                     │
│ weekNumber (PK)     │← 1, 2, 3
│ dayOfMonth          │
│ description         │
└─────────────────────┘

┌──────────────────────────┐
│ cycle_rotation_config    │
│ (Singleton Table)        │
│ id (PK) = 1              │
│ dayOfWeek                │
│ sendHour                 │
│ sendMinute               │
└──────────────────────────┘

┌──────────────────────────┐
│ cycle_rotation_state     │
│ (Singleton Table)        │
│ id (PK) = 1              │
│ currentCycle             │
│ lastRunAt                │
│ nextRunAt                │
└──────────────────────────┘

┌──────────────────────────┐
│ cycle_runs               │
│                          │
│ id (PK)                  │
│ cycleNumber              │
│ scheduledFor             │
│ sentAt                   │
│ status                   │
│ error                    │
└──────────────────────────┘

┌──────────────────────────┐
│ email_recipients         │
│                          │
│ id (PK)                  │
│ email (UNIQUE)           │
│ name                     │
│ isActive                 │
└──────────────────────────┘
```

## Core Tables

### users

User accounts for system access.

**Schema Definition:**
```typescript
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'user'] }).notNull().default('user'),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  lastLoginAt: integer('lastLoginAt', { mode: 'timestamp' }),
});
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique user identifier |
| `email` | TEXT | NOT NULL, UNIQUE | Login email (case-insensitive) |
| `password` | TEXT | NOT NULL | Bcrypt hashed password (12 rounds) |
| `name` | TEXT | NOT NULL | User display name |
| `role` | TEXT | NOT NULL, DEFAULT 'user' | User role ('admin' or 'user') |
| `isActive` | BOOLEAN | NOT NULL, DEFAULT true | Account active status |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |
| `lastLoginAt` | TIMESTAMP | NULLABLE | Last successful login timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`

**Relationships:**
- One-to-many with `sessions` (user can have multiple sessions)

**Sample Data:**
```sql
INSERT INTO users (email, password, name, role, isActive)
VALUES ('admin@eretzrealty.com', '$2a$12$...', 'Admin User', 'admin', 1);
```

---

### sessions

Authentication refresh tokens.

**Schema Definition:**
```typescript
export const sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique session identifier |
| `userId` | INTEGER | NOT NULL, FOREIGN KEY → users.id | Owner of the session |
| `token` | TEXT | NOT NULL, UNIQUE | Refresh token (UUID) |
| `expiresAt` | TIMESTAMP | NOT NULL | Token expiration timestamp |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Session creation timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `token`
- FOREIGN KEY INDEX on `userId`

**Relationships:**
- Many-to-one with `users` (CASCADE DELETE)

**Notes:**
- Refresh tokens are used to obtain new access JWTs
- Expired sessions are not automatically cleaned (manual cleanup available)
- Cascade delete: All user sessions deleted when user is deleted

---

### listings

Property listings managed by the system.

**Schema Definition:**
```typescript
export const listings = sqliteTable('listings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  address: text('address').notNull(),
  locationDescription: text('locationDescription'),
  dimensions: text('dimensions'),
  rooms: integer('rooms'),
  squareFootage: integer('squareFootage'),
  price: integer('price'),
  onMarket: integer('onMarket', { mode: 'boolean' }).notNull().default(true),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
  cycleGroup: integer('cycleGroup').notNull().references(() => cycleSchedules.weekNumber),
  propertyTypeId: integer('propertyTypeId').references(() => propertyTypes.id),
  conditionId: integer('conditionId').references(() => conditions.id),
  zoningId: integer('zoningId').references(() => zonings.id),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique listing identifier |
| `address` | TEXT | NOT NULL | Property address |
| `locationDescription` | TEXT | NULLABLE | Neighborhood/area description |
| `dimensions` | TEXT | NULLABLE | Property/lot dimensions |
| `rooms` | INTEGER | NULLABLE | Number of rooms |
| `squareFootage` | INTEGER | NULLABLE | Area in square feet |
| `price` | INTEGER | NULLABLE | Price in dollars (no decimals) |
| `onMarket` | BOOLEAN | NOT NULL, DEFAULT true | True = "NEW" badge in emails |
| `isActive` | BOOLEAN | NOT NULL, DEFAULT true | Active = included in emails |
| `cycleGroup` | INTEGER | NOT NULL, FOREIGN KEY | Cycle assignment (1, 2, or 3) |
| `propertyTypeId` | INTEGER | NULLABLE, FOREIGN KEY | Property type classification |
| `conditionId` | INTEGER | NULLABLE, FOREIGN KEY | Property condition |
| `zoningId` | INTEGER | NULLABLE, FOREIGN KEY | Zoning classification |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Listing creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY INDEX on `cycleGroup`
- FOREIGN KEY INDEX on `propertyTypeId`
- FOREIGN KEY INDEX on `conditionId`
- FOREIGN KEY INDEX on `zoningId`

**Relationships:**
- Many-to-one with `cycle_schedules` (via cycleGroup)
- Many-to-one with `property_types` (via propertyTypeId)
- Many-to-one with `conditions` (via conditionId)
- Many-to-one with `zonings` (via zoningId)
- Many-to-many with `features` (via listing_features junction table)

**Business Rules:**
- `price` stored as integer (cents not used, whole dollars only)
- `onMarket = true` shows "NEW" badge in email campaigns
- `isActive = false` excludes from email campaigns (soft delete)
- `cycleGroup` must be 1, 2, or 3

---

### listing_features

Junction table for many-to-many relationship between listings and features.

**Schema Definition:**
```typescript
export const listingFeatures = sqliteTable(
  'listing_features',
  {
    listingId: integer('listingId').notNull().references(() => listings.id, { onDelete: 'cascade' }),
    featureId: integer('featureId').notNull().references(() => features.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.listingId, table.featureId] }),
  })
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `listingId` | INTEGER | NOT NULL, FOREIGN KEY → listings.id | Property listing |
| `featureId` | INTEGER | NOT NULL, FOREIGN KEY → features.id | Feature applied to listing |

**Indexes:**
- COMPOSITE PRIMARY KEY on (`listingId`, `featureId`)
- FOREIGN KEY INDEX on `listingId`
- FOREIGN KEY INDEX on `featureId`

**Relationships:**
- Many-to-one with `listings` (CASCADE DELETE)
- Many-to-one with `features` (CASCADE DELETE)

**Notes:**
- Deleting a listing removes all its feature associations
- Deleting a feature removes all listing associations
- No timestamps needed (immutable associations)

---

## Lookup Tables

### property_types

Property type classifications.

**Schema Definition:**
```typescript
export const propertyTypes = sqliteTable('property_types', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
});
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique type identifier |
| `name` | TEXT | NOT NULL, UNIQUE | Property type name |
| `isActive` | BOOLEAN | NOT NULL, DEFAULT true | Active = shown in dropdowns |

**Sample Data:**
- Apartment
- Commercial
- Land
- Multi-Family
- Single-Family Home

**Usage:**
- Shown in property form dropdown
- Used to group properties in email campaigns
- Inactive types hidden but existing assignments preserved

---

### conditions

Property condition states.

**Schema Definition:**
```typescript
export const conditions = sqliteTable('conditions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
});
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique condition identifier |
| `name` | TEXT | NOT NULL, UNIQUE | Condition name |
| `isActive` | BOOLEAN | NOT NULL, DEFAULT true | Active = shown in dropdowns |

**Sample Data:**
- Excellent
- Good
- Fair
- Poor
- New Construction
- Renovated

---

### zonings

Zoning classifications.

**Schema Definition:**
```typescript
export const zonings = sqliteTable('zonings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
});
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique zoning identifier |
| `code` | TEXT | NOT NULL, UNIQUE | Zoning code (e.g., "R1", "C2") |
| `isActive` | BOOLEAN | NOT NULL, DEFAULT true | Active = shown in dropdowns |

**Sample Data:**
- R1, R2, R3 (Residential)
- C1, C2 (Commercial)
- M1, M2 (Manufacturing/Industrial)

---

### features

Property features and amenities.

**Schema Definition:**
```typescript
export const features = sqliteTable('features', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
});
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique feature identifier |
| `name` | TEXT | NOT NULL, UNIQUE | Feature name |
| `isActive` | BOOLEAN | NOT NULL, DEFAULT true | Active = shown in multi-select |

**Sample Data:**
- Renovated
- Parking
- Garden
- Pool
- Basement
- Elevator

**Notes:**
- Multi-select in property forms (a listing can have many features)
- Displayed in email "Other" column as comma-separated list

---

## Cycle Management Tables

### cycle_schedules

Defines the three cycles.

**Schema Definition:**
```typescript
export const cycleSchedules = sqliteTable('cycle_schedules', {
  weekNumber: integer('weekNumber').primaryKey(),
  dayOfMonth: integer('dayOfMonth').notNull(),
  description: text('description'),
});
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `weekNumber` | INTEGER | PRIMARY KEY | Cycle number (1, 2, or 3) |
| `dayOfMonth` | INTEGER | NOT NULL | Day of month for send |
| `description` | TEXT | NULLABLE | Human-readable cycle name |

**Fixed Data:**
```sql
INSERT INTO cycle_schedules (weekNumber, dayOfMonth, description) VALUES
  (1, 1, 'Cycle 1'),
  (2, 2, 'Cycle 2'),
  (3, 3, 'Cycle 3');
```

**Notes:**
- `dayOfMonth` currently not actively used (rotation is weekly)
- Three cycles hardcoded (1, 2, 3)
- Referenced by `listings.cycleGroup`

---

### cycle_rotation_config

Configuration for email schedule (singleton table).

**Schema Definition:**
```typescript
export const cycleRotationConfig = sqliteTable('cycle_rotation_config', {
  id: integer('id').primaryKey(),
  dayOfWeek: integer('dayOfWeek').notNull(),
  sendHour: integer('sendHour').notNull().default(0),
  sendMinute: integer('sendMinute').notNull().default(0),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Always 1 (singleton) |
| `dayOfWeek` | INTEGER | NOT NULL | 0=Sunday, 1=Monday, ..., 6=Saturday |
| `sendHour` | INTEGER | NOT NULL, DEFAULT 0 | Hour (0-23) |
| `sendMinute` | INTEGER | NOT NULL, DEFAULT 0 | Minute (0-59) |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Config creation |
| `updatedAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update |

**Notes:**
- Only one row (id=1)
- Defines when emails are sent each week
- Time is in Eastern Time (America/New_York)

---

### cycle_rotation_state

Current rotation state (singleton table).

**Schema Definition:**
```typescript
export const cycleRotationState = sqliteTable('cycle_rotation_state', {
  id: integer('id').primaryKey(),
  currentCycle: integer('currentCycle').notNull().default(1),
  lastRunAt: integer('lastRunAt', { mode: 'timestamp' }),
  nextRunAt: integer('nextRunAt', { mode: 'timestamp' }),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Always 1 (singleton) |
| `currentCycle` | INTEGER | NOT NULL, DEFAULT 1 | Next cycle to send (1, 2, or 3) |
| `lastRunAt` | TIMESTAMP | NULLABLE | Last successful send timestamp |
| `nextRunAt` | TIMESTAMP | NULLABLE | Next scheduled send timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last state update |

**Notes:**
- Only one row (id=1)
- `currentCycle` advances after each send: 1→2→3→1
- `nextRunAt` calculated based on `cycle_rotation_config`

---

### cycle_runs

History log of email campaigns.

**Schema Definition:**
```typescript
export const cycleRuns = sqliteTable('cycle_runs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  cycleNumber: integer('cycleNumber').notNull(),
  scheduledFor: integer('scheduledFor', { mode: 'timestamp' }).notNull(),
  sentAt: integer('sentAt', { mode: 'timestamp' }),
  status: text('status', { enum: ['pending', 'sent', 'failed'] }).notNull().default('pending'),
  error: text('error'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique run identifier |
| `cycleNumber` | INTEGER | NOT NULL | Which cycle was sent (1, 2, or 3) |
| `scheduledFor` | TIMESTAMP | NOT NULL | Intended send time |
| `sentAt` | TIMESTAMP | NULLABLE | Actual send time |
| `status` | TEXT | NOT NULL, DEFAULT 'pending' | 'pending', 'sent', or 'failed' |
| `error` | TEXT | NULLABLE | Error message if status=failed |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Log entry creation |

**Usage:**
- Created on each campaign trigger
- `status` updated to 'sent' or 'failed'
- Provides audit trail of all campaigns

---

## Email Management Tables

### email_recipients

Email subscriber list.

**Schema Definition:**
```typescript
export const emailRecipients = sqliteTable('email_recipients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name'),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique recipient identifier |
| `email` | TEXT | NOT NULL, UNIQUE | Subscriber email address |
| `name` | TEXT | NULLABLE | Subscriber name |
| `isActive` | BOOLEAN | NOT NULL, DEFAULT true | Active = receives emails |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Subscription date |
| `updatedAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`

**Notes:**
- Only active recipients receive campaigns
- Inactive recipients retained (soft delete)
- Email validation enforced at application level

---

## Database Migrations

### Migration Strategy

**Drizzle Kit** manages schema migrations:

1. Define schema changes in `lib/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Review generated SQL in `lib/db/migrations/`
4. Apply migration: `npm run db:migrate`

### Migration Files

Located in `lib/db/migrations/`:
```
migrations/
├── 0000_initial_schema/
│   ├── migration.sql
│   └── snapshot.json
├── 0001_add_last_login/
│   ├── migration.sql
│   └── snapshot.json
└── meta/
    └── _journal.json
```

### Sample Migration

```sql
-- 0000_initial_schema/migration.sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  isActive INTEGER NOT NULL DEFAULT 1,
  createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
  updatedAt INTEGER NOT NULL DEFAULT (unixepoch()),
  lastLoginAt INTEGER
);

CREATE TABLE listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  address TEXT NOT NULL,
  ...
);

-- Indexes
CREATE UNIQUE INDEX users_email_unique ON users(email);
CREATE INDEX listings_cycleGroup_idx ON listings(cycleGroup);
```

## Database Seeding

### Seed Data

Initial data for development/testing in `lib/db/seed.ts`:

```typescript
// Seed lookup tables
await db.insert(propertyTypes).values([
  { name: 'Apartment' },
  { name: 'Commercial' },
  { name: 'Land' },
]);

await db.insert(features).values([
  { name: 'Renovated' },
  { name: 'Parking' },
  { name: 'Garden' },
]);

// Seed cycles
await db.insert(cycleSchedules).values([
  { weekNumber: 1, dayOfMonth: 1, description: 'Cycle 1' },
  { weekNumber: 2, dayOfMonth: 2, description: 'Cycle 2' },
  { weekNumber: 3, dayOfMonth: 3, description: 'Cycle 3' },
]);

// Seed default admin
await db.insert(users).values({
  email: 'admin@eretzrealty.com',
  password: await hashPassword('admin123'),
  name: 'Admin User',
  role: 'admin',
});
```

### Running Seeds

```bash
npm run db:seed
```

## Database Backup & Restore

### Backup (SQLite)

```bash
# Simple file copy
cp local.db local.db.backup

# Or use SQLite backup
sqlite3 local.db ".backup local.db.backup"
```

### Restore

```bash
cp local.db.backup local.db
```

### Cloud Database (Turso)

For production, consider Turso:
- Serverless SQLite in the cloud
- Automatic backups
- Point-in-time recovery
- Edge replication

## Performance Considerations

### Indexes

**Automatically Created:**
- Primary keys
- Unique constraints
- Foreign keys (SQLite creates indexes for FKs)

**Recommended Additional Indexes:**
```sql
CREATE INDEX listings_isActive_idx ON listings(isActive);
CREATE INDEX listings_cycleGroup_isActive_idx ON listings(cycleGroup, isActive);
CREATE INDEX email_recipients_isActive_idx ON email_recipients(isActive);
```

### Query Optimization

**Use Drizzle Relations** (avoids N+1):
```typescript
const listings = await db.query.listings.findMany({
  with: {
    propertyType: true,
    condition: true,
    zoning: true,
    listingFeatures: {
      with: { feature: true }
    }
  }
});
// Single query with joins, not N+1 queries
```

### Limits

**SQLite Limitations:**
- Max database size: 281 TB (not a concern)
- Max concurrent writers: 1 (writes serialized)
- Max concurrent readers: Unlimited

**Practical Limits for This Application:**
- Listings: 10,000+ (no issues)
- Recipients: 10,000+ (no issues)
- Concurrent users: 10-20 (single-writer limitation)

## Next Steps

- [API Reference](./api-reference.md) - API endpoints using this schema
- [Development Setup](./development-setup.md) - Database setup instructions
- [Architecture](./architecture.md) - Overall system architecture
