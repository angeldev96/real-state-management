# Deployment Guide

Comprehensive guide for deploying the Eretz Realty Admin System to production.

## Deployment Overview

The application is optimized for deployment on:
- **Primary**: Vercel (recommended - native Next.js support)
- **Alternative**: Railway, Render, DigitalOcean App Platform, or any Node.js host

## Pre-Deployment Checklist

### Code Preparation

- [ ] All features tested locally
- [ ] All tests passing (`npm test` and `npm run test:e2e`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Production build successful (`npm run build`)
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] Seed data prepared (if needed)

### Security Review

- [ ] JWT_SECRET is strong and unique
- [ ] All API keys secured
- [ ] No secrets in code repository
- [ ] CORS configured properly
- [ ] Rate limiting implemented (recommended)
- [ ] HTTPS enforced in production
- [ ] Cookie security flags enabled

### Performance

- [ ] Database indexes added
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Server Actions optimized
- [ ] Caching strategy reviewed

## Vercel Deployment (Recommended)

### Initial Setup

**1. Install Vercel CLI (Optional)**
```bash
npm install -g vercel
```

**2. Connect Repository**
- Go to [vercel.com](https://vercel.com)
- Click "Add New Project"
- Import your Git repository (GitHub, GitLab, or Bitbucket)
- Select the `real-state-management` repository

**3. Configure Project**

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `./` (project root)

**Build Command**: `npm run build` (default)

**Output Directory**: `.next` (default)

**Install Command**: `npm install` (default)

**Development Command**: `npm run dev` (default)

**4. Environment Variables**

Add in Vercel dashboard (Settings → Environment Variables):

```bash
# Required
JWT_SECRET=your-production-jwt-secret-min-32-chars
RESEND_API_KEY=re_your_production_resend_api_key

# Cycle Rotation
CYCLE_ROTATION_SECRET=your-cron-secret-key

# Optional - for Turso cloud database
DATABASE_URL=libsql://your-database.turso.io

# Production flag (auto-set by Vercel)
NODE_ENV=production
```

**Important**:
- Use different values than development
- Generate new JWT_SECRET for production
- Keep secrets secure

**5. Deploy**

Click **Deploy** button. Vercel will:
1. Clone your repository
2. Install dependencies
3. Run build command
4. Deploy to global edge network
5. Provide deployment URL

**Deployment URL**: `https://your-app.vercel.app`

### Database Setup on Vercel

**Option 1: Turso (Recommended for Production)**

Turso provides serverless SQLite in the cloud.

**Setup Turso:**
```bash
# Install Turso CLI
brew install tursodatabase/tap/turso  # macOS
# Or see https://docs.turso.tech/cli/installation

# Login
turso auth login

# Create database
turso db create eretz-realty-prod

# Get connection URL
turso db show eretz-realty-prod --url
# Output: libsql://eretz-realty-prod-yourorg.turso.io

# Create auth token
turso db tokens create eretz-realty-prod
# Output: your-auth-token
```

**Add to Vercel Environment Variables:**
```bash
DATABASE_URL=libsql://eretz-realty-prod-yourorg.turso.io?authToken=your-auth-token
```

**Run Migrations on Turso:**
```bash
# Locally with Turso URL
DATABASE_URL="libsql://..." npm run db:migrate

# Or use Turso CLI
turso db shell eretz-realty-prod < ./lib/db/migrations/0000_initial_schema/migration.sql
```

**Option 2: File-based SQLite (Development/Small Scale)**

For low-traffic deployments, you can use Vercel's file system:

⚠️ **Warning**: Vercel's file system is read-only except in `/tmp`. SQLite will not persist between deployments.

**Better approach**: Use Vercel Postgres or Turso for production.

### Cron Jobs on Vercel

**Create `vercel.json` in project root:**

```json
{
  "crons": [
    {
      "path": "/api/cycle/rotate",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

**Schedule Syntax (Cron):**
- `0 9 * * 1` = Every Monday at 9:00 AM (UTC)
- `0 14 * * 3` = Every Wednesday at 2:00 PM (UTC)
- `0 9 * * 1-5` = Weekdays at 9:00 AM (UTC)

**⚠️ Important**: Vercel cron uses UTC time. Adjust for your timezone.

**Convert EST to UTC:**
- 9:00 AM EST = 2:00 PM UTC (winter) or 1:00 PM UTC (summer)
- Use `schedule: "0 14 * * 1"` for 9 AM EST winter

**Cron Authentication:**
Vercel automatically sets `x-vercel-cron: 1` header on cron requests.

### Custom Domain

**1. Add Domain in Vercel**
- Go to Project Settings → Domains
- Add your domain (e.g., `admin.eretzrealty.com`)

**2. Configure DNS**
Add CNAME record:
```
Type: CNAME
Name: admin (or @)
Value: cname.vercel-dns.com
```

**3. Verify**
- Vercel automatically provisions SSL certificate
- HTTPS enabled automatically
- Redirects HTTP → HTTPS

### Deployment Workflow

**Automatic Deployments:**
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Preview deployment with unique URL

**Manual Deployment:**
```bash
vercel
# Or for production
vercel --prod
```

**Rollback:**
- Go to Deployments tab
- Find previous working deployment
- Click "Promote to Production"

### Monitoring on Vercel

**Built-in Analytics:**
- Real-time visitor analytics
- Web Vitals (performance metrics)
- Errors and warnings

**Logs:**
- Function logs available in dashboard
- Real-time log streaming
- Filter by function and severity

**Alerts:**
- Set up error alerts
- Configure via integrations (email, Slack)

---

## Alternative Deployment: Railway

**1. Install Railway CLI**
```bash
npm install -g railway
```

**2. Login**
```bash
railway login
```

**3. Initialize Project**
```bash
railway init
```

**4. Add Environment Variables**
```bash
railway variables set JWT_SECRET=your-secret
railway variables set RESEND_API_KEY=your-key
```

**5. Deploy**
```bash
railway up
```

**Automatic Deployments:**
- Connect GitHub repository
- Auto-deploy on push to main

**Database:**
- Railway provides PostgreSQL (migrate from SQLite if needed)
- Or use Turso with `DATABASE_URL`

---

## Alternative Deployment: Docker

**Create Dockerfile:**

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/local.db ./local.db

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Build and Run:**
```bash
docker build -t eretz-realty .
docker run -p 3000:3000 --env-file .env.production eretz-realty
```

**Deploy to:**
- Docker Hub + DigitalOcean
- AWS ECS
- Google Cloud Run
- Azure Container Apps

---

## Environment Variables Reference

### Required Variables

```bash
# JWT Secret for signing tokens
JWT_SECRET=min-32-characters-random-string

# Resend.io API key for email
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional: Cron endpoint protection
CYCLE_ROTATION_SECRET=your-secret-key

# Optional: Cloud database URL
DATABASE_URL=libsql://your-db.turso.io?authToken=token
```

### Optional Variables

```bash
# Node environment (auto-set by most platforms)
NODE_ENV=production

# Custom port (default: 3000)
PORT=3000

# Enable/disable features
ENABLE_ANALYTICS=true
ENABLE_ERROR_REPORTING=true
```

### Generating Secrets

**JWT_SECRET:**
```bash
openssl rand -base64 32
```

**CYCLE_ROTATION_SECRET:**
```bash
openssl rand -hex 16
```

---

## Database Migration Strategy

### Pre-Deployment Migration

**1. Backup Production Database (if exists)**
```bash
# For Turso
turso db shell eretz-realty-prod ".backup backup.db"

# For SQLite file
cp production.db production.db.backup
```

**2. Test Migrations Locally**
```bash
# Against production database copy
DATABASE_URL="libsql://..." npm run db:migrate
```

**3. Apply to Production**
```bash
# Turso
DATABASE_URL="libsql://your-prod-db" npm run db:migrate

# Or via SQL file
turso db shell prod < migrations/0001_add_field/migration.sql
```

**4. Verify**
```bash
# Check schema
turso db shell prod ".schema"
```

### Zero-Downtime Migrations

**Strategy:**
1. Make schema changes backward-compatible
2. Deploy new code (supports old and new schema)
3. Run migration
4. Deploy code cleanup (removes old schema support)

**Example: Adding a column**
```typescript
// Step 1: Add column (nullable)
ALTER TABLE listings ADD COLUMN new_field TEXT;

// Step 2: Deploy code that handles NULL
// Step 3: Backfill data
UPDATE listings SET new_field = 'default' WHERE new_field IS NULL;

// Step 4: Make NOT NULL (in next migration)
ALTER TABLE listings ALTER COLUMN new_field SET NOT NULL;
```

---

## Performance Optimization

### Next.js Optimizations

**Enable in `next.config.ts`:**
```typescript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Image optimization
  images: {
    domains: ['your-cdn.com'],
  },

  // Compression
  compress: true,

  // Output standalone for Docker
  output: 'standalone',
};
```

### Caching Strategy

**Server Components (Automatic):**
- Next.js caches Server Component renders
- Use `revalidatePath()` after mutations

**API Routes:**
```typescript
export const dynamic = 'force-dynamic'; // Disable cache
// Or
export const revalidate = 60; // Revalidate every 60 seconds
```

### Database Optimization

**Indexes:**
```sql
CREATE INDEX idx_listings_cycle_active ON listings(cycleGroup, isActive);
CREATE INDEX idx_listings_active ON listings(isActive);
CREATE INDEX idx_recipients_active ON email_recipients(isActive);
```

**Connection Pooling:**
For PostgreSQL (if migrating from SQLite):
```typescript
import { Pool } from 'pg';
const pool = new Pool({ max: 20 });
```

---

## Monitoring & Logging

### Error Tracking

**Sentry Integration:**
```bash
npm install @sentry/nextjs
```

**Initialize:**
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Application Monitoring

**Recommended Tools:**
- **Vercel Analytics**: Built-in (free tier)
- **New Relic**: APM and monitoring
- **Datadog**: Full-stack monitoring
- **LogRocket**: Session replay and logging

### Health Checks

**Create health endpoint:**
```typescript
// app/api/health/route.ts
export async function GET() {
  const dbCheck = await db.query.users.findFirst();

  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbCheck ? 'connected' : 'error',
  });
}
```

**Monitor:**
```bash
curl https://your-app.com/api/health
```

---

## Security Hardening

### Content Security Policy

**Add to `next.config.ts`:**
```typescript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Rate Limiting

**Using Upstash:**
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});
```

---

## Backup Strategy

### Database Backups

**Turso (Automatic):**
- Point-in-time recovery available
- Automated daily backups
- Restore via CLI or dashboard

**Manual Backups:**
```bash
# Turso
turso db shell prod ".backup prod-backup-$(date +%Y%m%d).db"

# SQLite file
sqlite3 production.db ".backup prod-backup-$(date +%Y%m%d).db"
```

**Backup Schedule:**
- Daily automated backups
- Weekly full backups retained for 30 days
- Monthly backups retained for 1 year

### Application Backups

**Git Tags for Releases:**
```bash
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

**Environment Variables:**
- Export from Vercel/platform dashboard
- Store securely (1Password, AWS Secrets Manager)

---

## Rollback Procedures

### Application Rollback

**Vercel:**
1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

**CLI:**
```bash
vercel rollback
```

### Database Rollback

**Restore from Backup:**
```bash
# Turso
turso db restore prod --backup backup-20260122.db

# SQLite
cp backup-20260122.db production.db
```

**Reverse Migration:**
```typescript
// Create down migration
export async function down(db: Database) {
  await db.execute('ALTER TABLE listings DROP COLUMN new_field');
}
```

---

## Troubleshooting Deployment

### Build Fails

**Error: "Module not found"**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**Error: "Type errors"**
```bash
npm run type-check
# Fix errors shown
```

### Runtime Errors

**Database Connection Failed:**
- Verify `DATABASE_URL` is set correctly
- Check database is accessible from deployment platform
- Verify auth token is valid (Turso)

**JWT Verification Failed:**
- Ensure `JWT_SECRET` matches between deployments
- Check secret length (min 32 characters)

**Email Sending Failed:**
- Verify `RESEND_API_KEY` is correct
- Check API key has permission
- Verify domain is verified in Resend

---

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Login works with test account
- [ ] Database connection successful
- [ ] Email sending works (test email)
- [ ] Cron job configured and scheduled
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Error monitoring active
- [ ] Analytics tracking
- [ ] Backup strategy implemented
- [ ] Team has access to deployment platform
- [ ] Documentation updated with production URLs

---

## Next Steps

- [Monitoring & Maintenance](./monitoring-maintenance.md)
- [Security Best Practices](./security-best-practices.md)
- [Performance Optimization](./performance-optimization.md)
