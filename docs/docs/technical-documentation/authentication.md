# Authentication & Authorization

Comprehensive guide to the authentication and authorization system in the Eretz Realty Admin System.

## Overview

The system uses a JWT-based authentication system with the following features:

- **JWT Access Tokens**: Short-lived tokens for API authentication
- **Refresh Tokens**: Long-lived tokens for obtaining new access tokens
- **HTTP-Only Cookies**: Secure token storage preventing XSS attacks
- **Bcrypt Password Hashing**: Secure password storage with salt rounds
- **Role-Based Access Control**: Admin and User roles with different permissions
- **Session Management**: Database-tracked refresh tokens

## Authentication Flow

### Complete Login Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. POST /api/auth/login
       │    { email, password }
       ↓
┌──────────────────────────────────┐
│   Login API Route                │
│   /api/auth/login/route.ts       │
└──────┬───────────────────────────┘
       │ 2. Query user by email
       ↓
┌──────────────────────────────────┐
│   Database                       │
│   SELECT * FROM users            │
│   WHERE email = ?                │
└──────┬───────────────────────────┘
       │ 3. User found
       ↓
┌──────────────────────────────────┐
│   Password Verification          │
│   bcrypt.compare(                │
│     password,                    │
│     user.password                │
│   )                              │
└──────┬───────────────────────────┘
       │ 4. Password valid
       ↓
┌──────────────────────────────────┐
│   Generate Tokens                │
│   - Access JWT (7 days)          │
│   - Refresh UUID (7 days)        │
└──────┬───────────────────────────┘
       │ 5. Store refresh token
       ↓
┌──────────────────────────────────┐
│   Database                       │
│   INSERT INTO sessions           │
│   (userId, token, expiresAt)     │
└──────┬───────────────────────────┘
       │ 6. Update lastLoginAt
       ↓
┌──────────────────────────────────┐
│   Database                       │
│   UPDATE users                   │
│   SET lastLoginAt = NOW()        │
└──────┬───────────────────────────┘
       │ 7. Set cookies
       ↓
┌──────────────────────────────────┐
│   Response                       │
│   Set-Cookie: eretz-auth-token   │
│   Set-Cookie: eretz-refresh-token│
│   JSON: { success, user }        │
└──────┬───────────────────────────┘
       │ 8. Cookies stored
       ↓
┌─────────────┐
│   Browser   │
│   (Logged In)│
└─────────────┘
```

### Protected Route Access Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. Navigate to /listings
       │    Cookie: eretz-auth-token=<jwt>
       ↓
┌──────────────────────────────────┐
│   Server Component               │
│   app/listings/page.tsx          │
└──────┬───────────────────────────┘
       │ 2. Call requireAuth()
       ↓
┌──────────────────────────────────┐
│   Authentication Guard           │
│   lib/auth/require-auth.ts       │
└──────┬───────────────────────────┘
       │ 3. Extract JWT from cookies
       ↓
┌──────────────────────────────────┐
│   JWT Verification               │
│   jose.jwtVerify(                │
│     token,                       │
│     JWT_SECRET                   │
│   )                              │
└──────┬───────────────────────────┘
       │ 4a. JWT valid → Allow access
       │ 4b. JWT invalid → Check refresh
       ↓
┌──────────────────────────────────┐
│   Refresh Token Check            │
│   Query sessions table           │
└──────┬───────────────────────────┘
       │ 5a. Refresh valid → Issue new JWT
       │ 5b. Refresh invalid → Redirect /login
       ↓
┌──────────────────────────────────┐
│   Page Renders                   │
│   User authenticated             │
└──────────────────────────────────┘
```

## Implementation Details

### Password Hashing

**Library:** bcryptjs 3.0.3

**Hash Generation:**
```typescript
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}
```

**Password Verification:**
```typescript
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

**Configuration:**
- **Salt Rounds**: 12 (recommended for strong security)
- **Algorithm**: bcrypt (blowfish-based)
- **Time**: ~150-250ms per hash on modern hardware

**Security Properties:**
- Adaptive cost (can increase rounds as hardware improves)
- Built-in salt (no separate salt storage needed)
- Resistant to rainbow table attacks
- Resistant to GPU-based cracking

### JWT Token Generation

**Library:** jose 6.1.3

**Access Token Structure:**
```typescript
import * as jose from 'jose';

export async function createAccessToken(user: {
  id: number;
  email: string;
  name: string;
  role: string;
}): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  const jwt = await new jose.SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  return jwt;
}
```

**JWT Payload:**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "admin",
  "iat": 1706011200,
  "exp": 1706616000
}
```

**JWT Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Token Properties:**
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiration**: 7 days from issuance
- **Signing Key**: `JWT_SECRET` environment variable
- **Size**: ~200-300 bytes (Base64-encoded)

**Token Verification:**
```typescript
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}
```

### Refresh Tokens

**Generation:**
```typescript
import { randomUUID } from 'crypto';

export function generateRefreshToken(): string {
  return randomUUID(); // e.g., "123e4567-e89b-12d3-a456-426614174000"
}
```

**Storage:**
```typescript
export async function createSession(userId: number, token: string) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
  });
}
```

**Validation:**
```typescript
export async function validateRefreshToken(token: string): Promise<User | null> {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.token, token),
    with: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}
```

**Token Rotation:**
When a refresh token is used:
1. Validate the refresh token
2. Generate new access JWT
3. Optionally rotate refresh token (not currently implemented)
4. Return new access token

### Cookie Management

**Setting Cookies (Login):**
```typescript
import { cookies } from 'next/headers';

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = cookies();

  // Access token cookie
  cookieStore.set('eretz-auth-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  // Refresh token cookie
  cookieStore.set('eretz-refresh-token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}
```

**Cookie Attributes:**

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `httpOnly` | true | Prevents JavaScript access (XSS protection) |
| `secure` | true (prod) | HTTPS only in production |
| `sameSite` | lax | CSRF protection (allows GET from external sites) |
| `maxAge` | 7 days | Cookie expiration |
| `path` | / | Available on all routes |

**Reading Cookies:**
```typescript
import { cookies } from 'next/headers';

export async function getAuthTokens() {
  const cookieStore = cookies();

  const accessToken = cookieStore.get('eretz-auth-token')?.value;
  const refreshToken = cookieStore.get('eretz-refresh-token')?.value;

  return { accessToken, refreshToken };
}
```

**Clearing Cookies (Logout):**
```typescript
export async function clearAuthCookies() {
  const cookieStore = cookies();

  cookieStore.delete('eretz-auth-token');
  cookieStore.delete('eretz-refresh-token');
}
```

## Route Protection

### Server Component Protection

**requireAuth() - Any Authenticated User**

```typescript
// lib/auth/require-auth.ts
import { redirect } from 'next/navigation';
import { getUserFromSession } from './session';

export async function requireAuth() {
  const user = await getUserFromSession();

  if (!user) {
    redirect('/login');
  }

  return user;
}
```

**Usage in Server Component:**
```typescript
// app/listings/page.tsx
import { requireAuth } from '@/lib/auth/require-auth';

export default async function ListingsPage() {
  const user = await requireAuth(); // Redirects if not authenticated

  // User is authenticated, render page
  return <div>Welcome, {user.name}</div>;
}
```

**requireAdmin() - Admin Users Only**

```typescript
// lib/auth/require-auth.ts
export async function requireAdmin() {
  const user = await getUserFromSession();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'admin') {
    redirect('/unauthorized');
  }

  return user;
}
```

**Usage:**
```typescript
// app/users/page.tsx
import { requireAdmin } from '@/lib/auth/require-auth';

export default async function UsersPage() {
  const user = await requireAdmin(); // Redirects if not admin

  // User is admin, render page
  return <div>User Management</div>;
}
```

### API Route Protection

**Example Protected API Route:**
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const user = await getUserFromSession();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // User is authenticated admin
  const users = await getAllUsers();
  return NextResponse.json({ users });
}
```

### Server Action Protection

**Example Protected Server Action:**
```typescript
// lib/actions.ts
'use server'

import { revalidatePath } from 'next/cache';
import { getUserFromSession } from './auth/session';

export async function createListing(data: ListingFormData): Promise<ActionResponse> {
  // Authentication check
  const user = await getUserFromSession();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Create listing
    await db.insert(listings).values(data);

    revalidatePath('/listings');

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create listing' };
  }
}
```

## Role-Based Access Control (RBAC)

### Roles

**Two Roles Defined:**

1. **`user`** (Standard User)
   - Default role for new accounts
   - Can manage listings
   - Can configure email campaigns
   - Cannot manage users
   - Cannot access admin-only features

2. **`admin`** (Administrator)
   - All user permissions
   - Can manage users (create, edit, delete)
   - Can reset passwords
   - Can access admin-only pages

### Permission Matrix

| Feature | User | Admin |
|---------|------|-------|
| Login | ✓ | ✓ |
| View Dashboard | ✓ | ✓ |
| Manage Listings | ✓ | ✓ |
| Configure Email Schedule | ✓ | ✓ |
| Manage Email Recipients | ✓ | ✓ |
| Send Test Emails | ✓ | ✓ |
| Manage Lookup Tables | ✓ | ✓ |
| Create Users | ✗ | ✓ |
| Edit Users | ✗ | ✓ |
| Delete Users | ✗ | ✓ |
| Reset Passwords | ✗ | ✓ |
| Access /users Page | ✗ | ✓ |

### Implementing Role Checks

**In Server Components:**
```typescript
export default async function MyPage() {
  const user = await requireAuth();

  // Check role
  if (user.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  return <div>Admin Content</div>;
}
```

**In Client Components:**
```typescript
'use client'

export function MyComponent({ user }: { user: User }) {
  if (user.role !== 'admin') {
    return null; // Hide component
  }

  return <button>Admin Action</button>;
}
```

**In Server Actions:**
```typescript
export async function adminAction() {
  const user = await getUserFromSession();

  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Admin access required' };
  }

  // Perform admin action
}
```

## Session Management

### Session Lifecycle

**Session Creation (Login):**
```typescript
const refreshToken = generateRefreshToken();
await createSession(user.id, refreshToken);
```

**Session Validation:**
```typescript
const session = await validateRefreshToken(refreshToken);
if (!session || session.expiresAt < new Date()) {
  // Session expired
}
```

**Session Deletion (Logout):**
```typescript
await db.delete(sessions).where(eq(sessions.token, refreshToken));
```

### Session Cleanup

**Manual Cleanup:**
```typescript
export async function cleanupExpiredSessions() {
  const now = new Date();
  await db.delete(sessions).where(lt(sessions.expiresAt, now));
}
```

**Usage:**
```bash
# Run manually or via cron
node -e "require('./lib/auth/session').cleanupExpiredSessions()"
```

**Automatic Cleanup (Recommended):**
- Set up database trigger or scheduled job
- Run weekly or monthly
- Not critical (expired sessions are validated before use)

## Security Considerations

### Password Security

**Minimum Requirements:**
- 8 characters (enforced at application level)
- Mix of letters, numbers, symbols (recommended)

**Best Practices:**
- Use password strength meter in UI
- Implement password history (prevent reuse)
- Force password reset on first login
- Implement password reset via email

**Bcrypt Configuration:**
```typescript
const SALT_ROUNDS = 12; // Adjust based on security/performance needs

// Higher rounds = more secure but slower
// 12 rounds = ~250ms (good balance)
// 14 rounds = ~1s (very secure)
// 10 rounds = ~65ms (faster but less secure)
```

### JWT Security

**Secret Key:**
- Use strong, random secret (32+ bytes)
- Never commit to version control
- Rotate periodically in production
- Different secret per environment

**Token Expiration:**
- Access tokens: Short-lived (current: 7 days, consider 1 hour for high security)
- Refresh tokens: Long-lived (7 days)
- Implement token rotation for refresh tokens

**Algorithm:**
- HS256 (HMAC with SHA-256)
- Symmetric signing (server holds secret)
- For high security, consider RS256 (asymmetric)

### Cookie Security

**Security Attributes:**

**httpOnly:**
- Prevents XSS attacks (JavaScript cannot access)
- Critical for token security

**secure:**
- HTTPS only (prevents MITM attacks)
- Always enabled in production
- Disabled in development (localhost HTTP)

**sameSite:**
- `lax`: Allows GET from external sites (recommended)
- `strict`: Never sent from external sites (too restrictive)
- `none`: Always sent (requires `secure=true`)

### CSRF Protection

**Built-in Protection:**
- SameSite=lax cookies
- Next.js Server Actions have built-in CSRF protection
- POST requests require same-origin

**Additional Measures (if needed):**
- CSRF tokens for forms
- Double-submit cookie pattern
- Origin header verification

### XSS Protection

**Mitigations:**
- HTTP-only cookies (tokens not accessible to JavaScript)
- React automatic escaping (prevents injected HTML)
- Content Security Policy headers (CSP)

**Avoid:**
- `dangerouslySetInnerHTML` without sanitization
- Storing sensitive data in localStorage/sessionStorage

### Brute Force Protection

**Current Implementation:** None

**Recommendations:**
- Rate limiting on `/api/auth/login`
- Account lockout after N failed attempts
- CAPTCHA after multiple failures
- Email notification on login from new device

**Example Rate Limit:**
```typescript
// Using @upstash/ratelimit
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // Continue with login logic
}
```

## Common Authentication Patterns

### Check if User is Authenticated (Client)

```typescript
'use client'

import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        setUser(data.user || null);
        setLoading(false);
      });
  }, []);

  return { user, loading };
}
```

### Conditional Rendering Based on Role

```typescript
export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}

// Usage
<AdminOnly>
  <button>Admin Action</button>
</AdminOnly>
```

### Protected Client-Side Navigation

```typescript
'use client'

import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';

export function ProtectedContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected Content</div>;
}
```

## Testing Authentication

### Unit Tests

**Test Password Hashing:**
```typescript
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

describe('Password Hashing', () => {
  it('should hash password', async () => {
    const password = 'test123';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(hash).toMatch(/^\$2[aby]\$/);
  });

  it('should verify correct password', async () => {
    const password = 'test123';
    const hash = await hashPassword(password);
    const valid = await verifyPassword(password, hash);
    expect(valid).toBe(true);
  });

  it('should reject incorrect password', async () => {
    const hash = await hashPassword('test123');
    const valid = await verifyPassword('wrong', hash);
    expect(valid).toBe(false);
  });
});
```

**Test JWT Creation/Verification:**
```typescript
import { describe, it, expect } from 'vitest';
import { createAccessToken, verifyAccessToken } from '@/lib/auth/jwt';

describe('JWT Tokens', () => {
  it('should create and verify token', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    };

    const token = await createAccessToken(user);
    const payload = await verifyAccessToken(token);

    expect(payload?.userId).toBe(user.id);
    expect(payload?.email).toBe(user.email);
  });

  it('should reject invalid token', async () => {
    const payload = await verifyAccessToken('invalid-token');
    expect(payload).toBeNull();
  });
});
```

### E2E Tests

**Test Login Flow:**
```typescript
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('/login');

  await page.fill('input[name="email"]', 'admin@eretzrealty.com');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/');
  await expect(page.locator('text=Dashboard')).toBeVisible();
});

test('user cannot access protected page without login', async ({ page }) => {
  await page.goto('/listings');
  await expect(page).toHaveURL('/login');
});
```

## Next Steps

- [API Reference](./api-reference.md) - Authentication endpoints
- [Development Setup](./development-setup.md) - Setting up authentication
- [Security Best Practices](./security-best-practices.md) - Advanced security
