# API Reference

Complete reference documentation for all API endpoints, Server Actions, and data operations in the Eretz Realty Admin System.

## API Overview

The system uses three types of APIs:

1. **REST API Routes** (`/api/*`) - Traditional HTTP endpoints
2. **Server Actions** (`"use server"`) - React Server Actions for mutations
3. **Server Components** - Direct database queries on server

## Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## Authentication

Most endpoints require authentication via JWT token in HTTP-only cookie.

**Cookie Names:**
- `eretz-auth-token` - Access token (JWT, 7 days)
- `eretz-refresh-token` - Refresh token (UUID, 7 days)

**Headers:**
```http
Cookie: eretz-auth-token=<jwt>; eretz-refresh-token=<uuid>
```

## REST API Endpoints

### Authentication Endpoints

#### POST /api/auth/login

Authenticate user and receive tokens.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Side Effects:**
- Sets `eretz-auth-token` cookie (HTTP-only, 7 days)
- Sets `eretz-refresh-token` cookie (HTTP-only, 7 days)
- Creates session record in database
- Updates `users.lastLoginAt` timestamp

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `403` - Account is inactive
- `500` - Server error

---

#### POST /api/auth/logout

Log out current user and invalidate session.

**Request:**
```http
POST /api/auth/logout
Cookie: eretz-auth-token=<jwt>; eretz-refresh-token=<uuid>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Side Effects:**
- Clears `eretz-auth-token` cookie
- Clears `eretz-refresh-token` cookie
- Deletes session from database

**Errors:**
- `500` - Server error

**Notes:**
- Works even if not authenticated (idempotent)
- Safe to call multiple times

---

#### GET /api/auth/session

Verify current session and get user data.

**Request:**
```http
GET /api/auth/session
Cookie: eretz-auth-token=<jwt>; eretz-refresh-token=<uuid>
```

**Response (200 OK - Valid Session):**
```json
{
  "success": true,
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  }
}
```

**Response (401 Unauthorized - Invalid Session):**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**Behavior:**
1. Attempts to verify access token
2. If invalid, checks refresh token
3. If refresh valid, issues new access token
4. Returns user data if authenticated

**Errors:**
- `401` - No valid tokens
- `500` - Server error

---

### User Management Endpoints

**All user endpoints require `admin` role.**

#### GET /api/users

Retrieve all users.

**Request:**
```http
GET /api/users
Cookie: eretz-auth-token=<jwt>
```

**Response (200 OK):**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin",
      "isActive": true,
      "createdAt": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-01-15T10:00:00.000Z",
      "lastLoginAt": "2026-01-22T09:00:00.000Z"
    },
    {
      "id": 2,
      "email": "user@example.com",
      "name": "Regular User",
      "role": "user",
      "isActive": true,
      "createdAt": "2026-01-16T11:00:00.000Z",
      "updatedAt": "2026-01-16T11:00:00.000Z",
      "lastLoginAt": null
    }
  ]
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Not admin
- `500` - Server error

**Notes:**
- Returns all users (active and inactive)
- Password hashes excluded from response
- Sorted by creation date (newest first)

---

#### POST /api/users

Create a new user.

**Request:**
```http
POST /api/users
Content-Type: application/json
Cookie: eretz-auth-token=<jwt>

{
  "email": "newuser@example.com",
  "password": "SecurePass123",
  "name": "New User",
  "role": "user"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "userId": 3
}
```

**Errors:**
- `400` - Missing required fields or validation error
- `401` - Not authenticated
- `403` - Not admin
- `409` - Email already exists
- `500` - Server error

**Validation:**
- `email` - Required, valid email format, unique
- `password` - Required, minimum 8 characters recommended
- `name` - Required, non-empty string
- `role` - Required, must be "admin" or "user"

**Side Effects:**
- Password hashed with bcrypt (12 rounds)
- User created with `isActive=true`
- Timestamps set automatically

---

#### DELETE /api/users/[id]

Permanently delete a user.

**Request:**
```http
DELETE /api/users/42
Cookie: eretz-auth-token=<jwt>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Errors:**
- `400` - Cannot delete own account
- `401` - Not authenticated
- `403` - Not admin
- `404` - User not found
- `500` - Server error

**Side Effects:**
- User permanently deleted from database
- All user's sessions deleted (CASCADE)

**Notes:**
- Cannot delete your own account (returns 400)
- Deletion is permanent and cannot be undone

---

#### POST /api/users/[id]/toggle-active

Toggle user active/inactive status.

**Request:**
```http
POST /api/users/42/toggle-active
Cookie: eretz-auth-token=<jwt>
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": 42,
    "isActive": false
  }
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Not admin
- `404` - User not found
- `500` - Server error

**Side Effects:**
- Toggles `isActive` boolean
- Updates `updatedAt` timestamp
- If deactivating, user cannot log in
- Existing sessions not invalidated immediately

---

#### POST /api/users/[id]/reset-password

Reset user password.

**Request:**
```http
POST /api/users/42/reset-password
Content-Type: application/json
Cookie: eretz-auth-token=<jwt>

{
  "newPassword": "NewSecurePass456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Errors:**
- `400` - Missing newPassword
- `401` - Not authenticated
- `403` - Not admin
- `404` - User not found
- `500` - Server error

**Side Effects:**
- Password hashed with bcrypt (12 rounds)
- Updates `updatedAt` timestamp
- Does not invalidate existing sessions

**Security:**
- Requires admin role
- New password hashed before storage
- No validation on password strength (application level only)

---

### Cycle Rotation Endpoint

#### POST /api/cycle/rotate

Trigger email campaign distribution (cron endpoint).

**Request:**
```http
POST /api/cycle/rotate
x-cron-secret: <your-secret>
# OR
x-vercel-cron: 1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "cycleNumber": 2,
    "recipientCount": 45,
    "nextCycle": 3,
    "nextRunAt": "2026-01-29T09:00:00.000Z"
  }
}
```

**Response (400 Bad Request - Too Early):**
```json
{
  "success": false,
  "error": "Not yet time to send",
  "nextRunAt": "2026-01-29T09:00:00.000Z"
}
```

**Response (400 Bad Request - No Recipients):**
```json
{
  "success": false,
  "error": "No active email recipients found"
}
```

**Errors:**
- `401` - Invalid cron secret
- `400` - Not time to send yet, or no recipients/listings
- `500` - Server error or email send failure

**Authentication:**
- Requires `x-cron-secret` header matching `CYCLE_ROTATION_SECRET` env var
- OR `x-vercel-cron` header (set by Vercel cron)

**Process:**
1. Verify authentication (cron secret or Vercel header)
2. Check current time >= `nextRunAt`
3. Query `cycle_rotation_state` for `currentCycle`
4. Fetch active listings for current cycle
5. Fetch active email recipients
6. Generate email HTML
7. Send to all recipients via Resend.io
8. Log to `cycle_runs` table
9. Advance `currentCycle` (1→2, 2→3, 3→1)
10. Calculate and update `nextRunAt`
11. Return success response

**Side Effects:**
- Sends emails to all active recipients
- Creates `cycle_runs` log entry
- Updates `cycle_rotation_state.currentCycle`
- Updates `cycle_rotation_state.lastRunAt`
- Updates `cycle_rotation_state.nextRunAt`

---

## Server Actions

Server Actions are `"use server"` functions called from client components.

### Listing Actions

#### createListing

Create a new property listing.

**Function Signature:**
```typescript
async function createListing(data: ListingFormData): Promise<ActionResponse>
```

**Parameters:**
```typescript
type ListingFormData = {
  address: string;
  locationDescription?: string;
  dimensions?: string;
  rooms?: string | number;
  squareFootage?: string | number;
  price?: string | number;
  cycleGroup: number; // 1, 2, or 3
  propertyTypeId?: number;
  conditionId?: number;
  zoningId?: number;
  featureIds?: number[];
  onMarket: boolean;
  isActive: boolean;
};
```

**Returns:**
```typescript
type ActionResponse = {
  success: boolean;
  error?: string;
  data?: any;
};
```

**Usage (Client Component):**
```tsx
import { createListing } from '@/lib/actions';

const handleSubmit = async (formData) => {
  const result = await createListing(formData);
  if (result.success) {
    toast.success('Listing created!');
  } else {
    toast.error(result.error);
  }
};
```

**Validation:**
- `address` - Required, non-empty
- `cycleGroup` - Required, must be 1, 2, or 3
- Numeric fields converted from strings
- Boolean fields validated

**Side Effects:**
- Inserts into `listings` table
- Inserts into `listing_features` junction table
- Revalidates `/listings` and `/` paths
- Returns listing ID on success

---

#### updateListing

Update an existing property listing.

**Function Signature:**
```typescript
async function updateListing(id: number, data: ListingFormData): Promise<ActionResponse>
```

**Parameters:**
- `id` - Listing ID to update
- `data` - Same as createListing

**Side Effects:**
- Updates `listings` table
- Deletes old `listing_features` entries
- Inserts new `listing_features` entries
- Updates `updatedAt` timestamp
- Revalidates paths

---

#### deleteListing

Delete a property listing.

**Function Signature:**
```typescript
async function deleteListing(id: number): Promise<ActionResponse>
```

**Parameters:**
- `id` - Listing ID to delete

**Side Effects:**
- Deletes from `listings` table
- Cascades delete from `listing_features`
- Revalidates paths

---

#### toggleListingMarketStatus

Toggle `onMarket` status (NEW badge).

**Function Signature:**
```typescript
async function toggleListingMarketStatus(id: number): Promise<ActionResponse>
```

**Side Effects:**
- Toggles `listings.onMarket` boolean
- Revalidates paths

---

#### toggleListingActiveStatus

Toggle `isActive` status (archive).

**Function Signature:**
```typescript
async function toggleListingActiveStatus(id: number): Promise<ActionResponse>
```

**Side Effects:**
- Toggles `listings.isActive` boolean
- Revalidates paths

---

### Email Actions

#### sendTestEmailAction

Send a test email to verify configuration.

**Function Signature:**
```typescript
async function sendTestEmailAction(email: string): Promise<ActionResponse>
```

**Parameters:**
- `email` - Recipient email address

**Returns:**
```typescript
{
  success: true,
  data: { id: 'resend-message-id' }
}
```

**Email Content:**
- Subject: "Eretz Realty - Test Email"
- Body: Simple test message with timestamp

---

#### sendSamplePropertiesEmailAction

Send sample campaign email with properties.

**Function Signature:**
```typescript
async function sendSamplePropertiesEmailAction(email: string): Promise<ActionResponse>
```

**Parameters:**
- `email` - Recipient email address

**Process:**
1. Fetches first 5 active listings
2. Generates full campaign email template
3. Sends via Resend.io

---

### Cycle Configuration Actions

#### updateCycleRotationConfig

Update email schedule configuration.

**Function Signature:**
```typescript
async function updateCycleRotationConfig(data: CycleRotationFormData): Promise<ActionResponse>
```

**Parameters:**
```typescript
type CycleRotationFormData = {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  time: string; // "HH:MM" format
};
```

**Process:**
1. Parse time string to hour/minute
2. Upsert `cycle_rotation_config` (id=1)
3. Recalculate `nextRunAt` based on new schedule
4. Update `cycle_rotation_state`

**Side Effects:**
- Updates or creates config record
- Recalculates next send date
- Revalidates `/settings` path

---

### Lookup Table Actions

Each lookup table has CRUD actions with identical signatures.

#### Property Types

```typescript
async function createPropertyType(name: string): Promise<ActionResponse>
async function updatePropertyType(id: number, name: string): Promise<ActionResponse>
async function togglePropertyType(id: number): Promise<ActionResponse>
async function deletePropertyType(id: number): Promise<ActionResponse>
```

#### Conditions

```typescript
async function createCondition(name: string): Promise<ActionResponse>
async function updateCondition(id: number, name: string): Promise<ActionResponse>
async function toggleCondition(id: number): Promise<ActionResponse>
async function deleteCondition(id: number): Promise<ActionResponse>
```

#### Zonings

```typescript
async function createZoning(code: string): Promise<ActionResponse>
async function updateZoning(id: number, code: string): Promise<ActionResponse>
async function toggleZoning(id: number): Promise<ActionResponse>
async function deleteZoning(id: number): Promise<ActionResponse>
```

#### Features

```typescript
async function createFeature(name: string): Promise<ActionResponse>
async function updateFeature(id: number, name: string): Promise<ActionResponse>
async function toggleFeature(id: number): Promise<ActionResponse>
async function deleteFeature(id: number): Promise<ActionResponse>
```

**Common Behavior:**
- Create: Validates uniqueness, inserts record
- Update: Validates uniqueness (excluding self), updates record
- Toggle: Flips `isActive` boolean
- Delete: Permanently removes record

**Side Effects:**
- All revalidate `/listings` and `/settings` paths
- Toggle preserves existing assignments to listings

---

### Email Recipient Actions

#### createEmailRecipient

Add a new email recipient.

**Function Signature:**
```typescript
async function createEmailRecipient(data: { email: string; name?: string }): Promise<ActionResponse>
```

**Validation:**
- Email must be valid format
- Email must be unique (case-insensitive)

---

#### updateEmailRecipient

Update email recipient details.

**Function Signature:**
```typescript
async function updateEmailRecipient(id: number, data: { email?: string; name?: string }): Promise<ActionResponse>
```

---

#### toggleEmailRecipientActive

Toggle recipient active status.

**Function Signature:**
```typescript
async function toggleEmailRecipientActive(id: number): Promise<ActionResponse>
```

---

#### deleteEmailRecipient

Permanently delete recipient.

**Function Signature:**
```typescript
async function deleteEmailRecipient(id: number): Promise<ActionResponse>
```

---

## Database Query Functions

Direct database queries used in Server Components.

### Listing Queries

```typescript
// Get all listings with relations
async function getListings(): Promise<ListingWithRelations[]>

// Get listing by ID with relations
async function getListingById(id: number): Promise<ListingWithRelations | undefined>

// Get listings by cycle
async function getListingsByCycle(cycleNumber: number): Promise<ListingWithRelations[]>

// Get active listings by cycle (for emails)
async function getActiveListingsByCycle(cycleNumber: number): Promise<ListingWithRelations[]>
```

**ListingWithRelations Type:**
```typescript
type ListingWithRelations = {
  id: number;
  address: string;
  locationDescription: string | null;
  dimensions: string | null;
  rooms: number | null;
  squareFootage: number | null;
  price: number | null;
  onMarket: boolean;
  isActive: boolean;
  cycleGroup: number;
  propertyType: PropertyType | null;
  condition: Condition | null;
  zoning: Zoning | null;
  listingFeatures: Array<{
    feature: Feature;
  }>;
  createdAt: Date;
  updatedAt: Date;
};
```

### User Queries

```typescript
// Get all users
async function getAllUsers(): Promise<User[]>

// Get user by email (for login)
async function getUserByEmail(email: string): Promise<User | undefined>

// Get user by ID
async function getUserById(id: number): Promise<User | undefined>
```

### Lookup Table Queries

```typescript
// Each lookup table has:
async function getAllPropertyTypes(): Promise<PropertyType[]>
async function getActivePropertyTypes(): Promise<PropertyType[]>

async function getAllConditions(): Promise<Condition[]>
async function getActiveConditions(): Promise<Condition[]>

async function getAllZonings(): Promise<Zoning[]>
async function getActiveZonings(): Promise<Zoning[]>

async function getAllFeatures(): Promise<Feature[]>
async function getActiveFeatures(): Promise<Feature[]>
```

### Email Recipient Queries

```typescript
async function getAllEmailRecipients(): Promise<EmailRecipient[]>
async function getActiveEmailRecipients(): Promise<EmailRecipient[]>
async function getEmailRecipientByEmail(email: string): Promise<EmailRecipient | undefined>
```

### Cycle Queries

```typescript
async function getCycleRotationConfig(): Promise<CycleRotationConfig | undefined>
async function getCycleRotationState(): Promise<CycleRotationState | undefined>
async function getCycleStats(): Promise<CycleStats>
```

**CycleStats Type:**
```typescript
type CycleStats = {
  totalListings: number;
  newListings: number;
  activeListings: number;
  nextCycle: number;
  cycle1: { total: number; active: number; new: number; nextSend: Date | null };
  cycle2: { total: number; active: number; new: number; nextSend: Date | null };
  cycle3: { total: number; active: number; new: number; nextSend: Date | null };
};
```

---

## Error Handling

### Standard Error Response

```typescript
{
  success: false,
  error: "Error message"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error, missing fields)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized, e.g., not admin)
- `404` - Not Found
- `409` - Conflict (duplicate email, etc.)
- `500` - Internal Server Error

### Error Messages

**Authentication:**
- "Invalid credentials"
- "Unauthorized"
- "Account is inactive"

**Validation:**
- "Missing required fields"
- "Invalid email format"
- "Email already exists"
- "Invalid cycle group"

**Authorization:**
- "Admin access required"
- "Cannot delete own account"

**Business Logic:**
- "Not yet time to send"
- "No active email recipients found"
- "No active listings found for cycle"

---

## Rate Limiting

**Current Implementation:** None

**Recommendations for Production:**
- Implement rate limiting on `/api/auth/login` (prevent brute force)
- Rate limit per IP: 5 requests/minute on login
- Rate limit per user: 100 requests/minute on API routes

**Libraries:**
- `@upstash/ratelimit` (with Redis)
- `express-rate-limit` (if using Express)

---

## Next Steps

- [Authentication](./authentication.md) - Authentication implementation details
- [Development Setup](./development-setup.md) - API development and testing
- [Database Schema](./database-schema.md) - Database structure reference
