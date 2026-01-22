# Email System Architecture

Complete technical documentation of the email distribution system, including the three-cycle rotation mechanism, template generation, and Resend.io integration.

## System Overview

The email system consists of:
- **Three-Cycle Rotation**: Automated weekly rotation through 3 property groups
- **Resend.io Integration**: Cloud email delivery service
- **HTML Template Engine**: Dynamic email generation with property listings
- **Cron-Based Scheduler**: Automated campaign execution
- **State Management**: Database-tracked rotation state and history

## Architecture Diagram

```
┌────────────────────────────────────────────────────┐
│         CRON TRIGGER                               │
│  (Vercel Cron or External Webhook)                │
└────────────────┬───────────────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────────────┐
│    POST /api/cycle/rotate                          │
│    - Verify cron secret                            │
│    - Check if time to send                         │
└────────────────┬───────────────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────────────┐
│    Query Current State                             │
│    - Get currentCycle (1, 2, or 3)                 │
│    - Get nextRunAt timestamp                       │
│    - Verify current time >= nextRunAt              │
└────────────────┬───────────────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────────────┐
│    Fetch Campaign Data                             │
│    - Get active listings for currentCycle          │
│    - Get active email recipients                   │
│    - Validate data exists                          │
└────────────────┬───────────────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────────────┐
│    Generate Email HTML                             │
│    - Group listings by property type               │
│    - Format property data                          │
│    - Build HTML table structure                    │
│    - Add headers, footers, styling                 │
└────────────────┬───────────────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────────────┐
│    Send via Resend.io                              │
│    - POST to Resend API                            │
│    - Batch send to all recipients                  │
│    - Handle errors                                 │
└────────────────┬───────────────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────────────┐
│    Update State & Log                              │
│    - Create cycle_runs log entry                   │
│    - Advance currentCycle (1→2, 2→3, 3→1)          │
│    - Calculate next run date                       │
│    - Update lastRunAt timestamp                    │
└────────────────────────────────────────────────────┘
```

## Three-Cycle Rotation

### Rotation Logic

**State Table (`cycle_rotation_state`):**
```typescript
{
  id: 1,                          // Singleton
  currentCycle: 2,                // Next cycle to send
  lastRunAt: "2026-01-15T09:00:00Z",
  nextRunAt: "2026-01-22T09:00:00Z",
  updatedAt: "2026-01-15T09:05:00Z"
}
```

**Cycle Advancement:**
```typescript
// After successful send
const nextCycle = (currentCycle % 3) + 1;
// 1 → 2
// 2 → 3
// 3 → 1
```

**Next Run Calculation:**
```typescript
import { DateTime } from 'luxon';

function calculateNextRun(
  config: { dayOfWeek: number; sendHour: number; sendMinute: number }
): Date {
  const now = DateTime.now().setZone('America/New_York');

  let next = now
    .set({ hour: config.sendHour, minute: config.sendMinute, second: 0 })
    .plus({ weeks: 1 });

  // Adjust to target day of week
  while (next.weekday !== config.dayOfWeek) {
    next = next.plus({ days: 1 });
  }

  return next.toJSDate();
}
```

### Rotation Timeline Example

**Configuration:**
- Day: Monday (1)
- Time: 9:00 AM EST

**Timeline:**
```
Week 1 - Monday Jan 8, 9:00 AM:
  ├─ Send: Cycle 1 (20 properties)
  ├─ Recipients: 45 active subscribers
  └─ Next: Cycle 2 on Jan 15

Week 2 - Monday Jan 15, 9:00 AM:
  ├─ Send: Cycle 2 (18 properties)
  ├─ Recipients: 45 active subscribers
  └─ Next: Cycle 3 on Jan 22

Week 3 - Monday Jan 22, 9:00 AM:
  ├─ Send: Cycle 3 (22 properties)
  ├─ Recipients: 47 active subscribers
  └─ Next: Cycle 1 on Jan 29

Week 4 - Monday Jan 29, 9:00 AM:
  ├─ Send: Cycle 1 (21 properties, updated)
  └─ Rotation continues...
```

## Email Template Generation

### Template Structure

**HTML Email Anatomy:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eretz Realty - Cycle 2 - January 2026</title>
</head>
<body style="margin:0; padding:20px; background:#f5f5f5; font-family:Arial,sans-serif;">

  <!-- Email Container -->
  <div style="max-width:1200px; margin:0 auto; background:white; padding:20px;">

    <!-- Header -->
    <h1 style="text-align:center; color:#333;">
      Eretz Realty Property Listings
    </h1>
    <p style="text-align:center; color:#666;">
      Cycle 2 - January 2026
    </p>

    <!-- Property Type Section -->
    <h2 style="margin-top:30px; color:#2c5282; border-bottom:2px solid #2c5282;">
      Apartment
    </h2>

    <!-- Properties Table -->
    <table style="width:100%; border-collapse:collapse; margin:20px 0;">
      <thead>
        <tr style="background:#f0f0f0; border-bottom:2px solid #ddd;">
          <th style="padding:10px; text-align:left;">#</th>
          <th style="padding:10px; text-align:left;">Location</th>
          <th style="padding:10px; text-align:left;">Dimensions</th>
          <th style="padding:10px; text-align:left;">Rooms</th>
          <th style="padding:10px; text-align:left;">Square footage</th>
          <th style="padding:10px; text-align:left;">Condition</th>
          <th style="padding:10px; text-align:left;">Other</th>
          <th style="padding:10px; text-align:left;">Notes</th>
          <th style="padding:10px; text-align:left;">Price</th>
        </tr>
      </thead>
      <tbody>
        <!-- Property rows (zebra striped) -->
        <tr id="listing-42-unique" style="background:#ffffff;">
          <td style="padding:10px;">
            42 <span style="color:#2E7D32; font-weight:bold;">New</span>
          </td>
          <td style="padding:10px;">Prime Williamsburg location</td>
          <td style="padding:10px;">50x100</td>
          <td style="padding:10px;">3</td>
          <td style="padding:10px;">1,500</td>
          <td style="padding:10px;">Excellent</td>
          <td style="padding:10px;">Renovated, Parking, Garden</td>
          <td style="padding:10px;">R2</td>
          <td style="padding:10px;">$2.7M</td>
        </tr>
        <!-- More rows... -->
      </tbody>
    </table>

    <!-- More property type sections... -->

    <!-- Footer -->
    <p style="text-align:center; margin-top:40px; color:#999; font-size:12px;">
      <em>Eretz Realty</em><br>
      Professional Real Estate Services
    </p>
  </div>

</body>
</html>
```

### Template Generation Code

**Function Location:** `lib/email/index.ts`

**Main Generator:**
```typescript
export function generatePropertyEmailHTML(
  listings: ListingWithRelations[],
  cycleNumber: number
): string {
  // Group listings by property type
  const groupedListings = groupByPropertyType(listings);

  // Build HTML sections
  const sections = Object.entries(groupedListings)
    .sort(([typeA], [typeB]) => typeA.localeCompare(typeB))
    .map(([typeName, typeListings]) =>
      generatePropertyTypeSection(typeName, typeListings)
    )
    .join('\n');

  // Wrap in full HTML document
  return wrapInEmailTemplate(sections, cycleNumber);
}
```

**Property Type Section:**
```typescript
function generatePropertyTypeSection(
  typeName: string,
  listings: ListingWithRelations[]
): string {
  const tableRows = listings.map((listing, index) => {
    const bgColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9';

    return `
      <tr id="listing-${listing.id}-${Math.random()}" style="background:${bgColor};">
        <td style="padding:10px;">
          ${listing.id}
          ${listing.onMarket ? '<span style="color:#2E7D32; font-weight:bold;">New</span>' : ''}
        </td>
        <td style="padding:10px;">${listing.locationDescription || listing.address}</td>
        <td style="padding:10px;">${listing.dimensions || '-'}</td>
        <td style="padding:10px;">${listing.rooms || '-'}</td>
        <td style="padding:10px;">${formatNumber(listing.squareFootage)}</td>
        <td style="padding:10px;">${listing.condition?.name || '-'}</td>
        <td style="padding:10px;">${formatFeatures(listing.listingFeatures)}</td>
        <td style="padding:10px;">${listing.zoning?.code || '-'}</td>
        <td style="padding:10px;">${formatPrice(listing.price)}</td>
      </tr>
    `;
  }).join('\n');

  return `
    <h2 style="margin-top:30px; color:#2c5282; border-bottom:2px solid #2c5282;">
      ${typeName}
    </h2>
    <table style="width:100%; border-collapse:collapse; margin:20px 0;">
      <thead>
        ${tableHeaderRow}
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
}
```

**Data Formatters:**
```typescript
function formatPrice(price: number | null): string {
  if (!price) return '-';

  if (price >= 1000000) {
    const millions = price / 1000000;
    return `$${millions.toFixed(1)}M`;
  }

  return `$${price.toLocaleString()}`;
}

function formatNumber(value: number | null): string {
  if (!value) return '-';
  return value.toLocaleString();
}

function formatFeatures(listingFeatures: Array<{ feature: Feature }>): string {
  if (!listingFeatures.length) return '-';
  return listingFeatures.map(lf => lf.feature.name).join(', ');
}
```

### Unique Row IDs

**Problem:** Gmail collapses duplicate table rows

**Solution:** Add unique row IDs
```typescript
// Each row gets unique ID
<tr id="listing-${listing.id}-${Math.random().toString(36).substring(7)}">
```

This prevents Gmail from collapsing identical-looking rows.

## Resend.io Integration

### API Configuration

**Library:** `resend` npm package (v6.7.0)

**Initialization:**
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
```

**API Key:**
- Obtained from [resend.com/api-keys](https://resend.com/api-keys)
- Stored in `RESEND_API_KEY` environment variable
- Different keys for development/production

### Sending Emails

**Campaign Email Function:**
```typescript
export async function sendPropertyEmail(
  to: string | string[],
  options: {
    cycleNumber: number;
    listings: ListingWithRelations[];
    cycleName: string;
  }
) {
  const { cycleNumber, listings, cycleName } = options;

  // Generate HTML
  const html = generatePropertyEmailHTML(listings, cycleNumber);

  // Subject line
  const now = new Date();
  const monthYear = now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  const subject = `Eretz Realty - ${cycleName} - ${monthYear}`;

  // Send via Resend
  const result = await resend.emails.send({
    from: 'Eretz Realty <noreply@angelvalladares.dev>',
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  });

  return result;
}
```

**Test Email Function:**
```typescript
export async function sendTestEmail(to: string) {
  const now = new Date();

  const result = await resend.emails.send({
    from: 'Eretz Realty <noreply@angelvalladares.dev>',
    to: [to],
    subject: 'Eretz Realty - Test Email',
    html: `
      <h1>Test Email</h1>
      <p>This is a test email from Eretz Realty Admin System.</p>
      <p>Sent at: ${now.toISOString()}</p>
    `,
  });

  return result;
}
```

### Batch Sending

**Sending to Multiple Recipients:**
```typescript
// Single API call for all recipients
const recipients = await getActiveEmailRecipients();
const emails = recipients.map(r => r.email);

await sendPropertyEmail(emails, {
  cycleNumber: 2,
  listings: cycle2Listings,
  cycleName: 'Cycle 2',
});
```

**Resend Batch Limits:**
- Up to 100 recipients per API call
- For larger lists, chunk into batches:

```typescript
function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

const recipientBatches = chunkArray(recipients, 100);

for (const batch of recipientBatches) {
  await sendPropertyEmail(batch.map(r => r.email), options);
}
```

### Error Handling

**Resend API Errors:**
```typescript
try {
  const result = await resend.emails.send({ ... });

  if (result.error) {
    console.error('Resend error:', result.error);
    throw new Error(result.error.message);
  }

  return result.data; // { id: 'msg_...' }
} catch (error) {
  console.error('Failed to send email:', error);

  // Log to cycle_runs table
  await db.insert(cycleRuns).values({
    cycleNumber,
    scheduledFor: new Date(),
    status: 'failed',
    error: error.message,
  });

  throw error;
}
```

## Cron Endpoint Implementation

### Endpoint Code

**File:** `app/api/cycle/rotate/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import {
  getCycleRotationState,
  getActiveListingsByCycle,
  getActiveEmailRecipients
} from '@/lib/db/queries';
import { sendPropertyEmail } from '@/lib/email';
import { DateTime } from 'luxon';

export async function POST(request: NextRequest) {
  // 1. Verify authentication
  const cronSecret = request.headers.get('x-cron-secret');
  const vercelCron = request.headers.get('x-vercel-cron');

  if (
    cronSecret !== process.env.CYCLE_ROTATION_SECRET &&
    vercelCron !== '1'
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Get current state
    const state = await getCycleRotationState();
    if (!state) {
      return NextResponse.json({ error: 'No rotation state found' }, { status: 400 });
    }

    // 3. Check if time to send
    const now = new Date();
    if (state.nextRunAt && now < state.nextRunAt) {
      return NextResponse.json({
        success: false,
        error: 'Not yet time to send',
        nextRunAt: state.nextRunAt,
      });
    }

    // 4. Fetch data
    const listings = await getActiveListingsByCycle(state.currentCycle);
    const recipients = await getActiveEmailRecipients();

    if (recipients.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No active email recipients found',
      }, { status: 400 });
    }

    if (listings.length === 0) {
      return NextResponse.json({
        success: false,
        error: `No active listings found for cycle ${state.currentCycle}`,
      }, { status: 400 });
    }

    // 5. Send email
    await sendPropertyEmail(
      recipients.map(r => r.email),
      {
        cycleNumber: state.currentCycle,
        listings,
        cycleName: `Cycle ${state.currentCycle}`,
      }
    );

    // 6. Log run
    await db.insert(cycleRuns).values({
      cycleNumber: state.currentCycle,
      scheduledFor: state.nextRunAt || now,
      sentAt: now,
      status: 'sent',
    });

    // 7. Advance rotation
    const nextCycle = (state.currentCycle % 3) + 1;
    const nextRunAt = calculateNextRun(config);

    await db.update(cycleRotationState)
      .set({
        currentCycle: nextCycle,
        lastRunAt: now,
        nextRunAt,
        updatedAt: now,
      })
      .where(eq(cycleRotationState.id, 1));

    // 8. Return success
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      data: {
        cycleNumber: state.currentCycle,
        recipientCount: recipients.length,
        listingCount: listings.length,
        nextCycle,
        nextRunAt,
      },
    });

  } catch (error) {
    console.error('Cycle rotation error:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
```

### Cron Configuration

**Vercel (`vercel.json`):**
```json
{
  "crons": [
    {
      "path": "/api/cycle/rotate",
      "schedule": "0 14 * * 1"
    }
  ]
}
```

**External Cron (cron-job.org, EasyCron):**
```bash
# Every Monday at 9 AM EST (14:00 UTC)
curl -X POST \
  -H "x-cron-secret: your-secret" \
  https://your-app.com/api/cycle/rotate
```

## Email Deliverability

### Domain Verification (Resend)

**1. Add DNS Records:**
```
Type: TXT
Name: @
Value: resend-verify=<verification-string>

Type: MX
Name: @
Value: 10 mx.resend.com

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

**2. Verify in Resend Dashboard**

**3. Update From Address:**
```typescript
from: 'Eretz Realty <noreply@yourdomain.com>'
```

### Best Practices

**Subject Lines:**
- Keep under 50 characters
- Include month/year for context
- Avoid spam trigger words

**HTML Structure:**
- Use tables for layout (better email client support)
- Inline CSS (external stylesheets not supported)
- Alt text for images
- Plain text fallback

**Sending Behavior:**
- Consistent schedule (same day/time)
- Warm up new domains gradually
- Monitor bounce rates
- Honor unsubscribe requests immediately

## Testing

### Manual Testing

**Send Test Email:**
```typescript
// Via Server Action
await sendTestEmailAction('your-email@example.com');

// Via API
POST /api/send-test
{
  "email": "your-email@example.com"
}
```

**Send Sample Campaign:**
```typescript
await sendSamplePropertiesEmailAction('your-email@example.com');
```

### Automated Testing

**Unit Tests:**
```typescript
import { describe, it, expect } from 'vitest';
import { generatePropertyEmailHTML } from '@/lib/email';

describe('Email Template Generation', () => {
  it('should generate HTML for listings', () => {
    const listings = [/* mock listings */];
    const html = generatePropertyEmailHTML(listings, 1);

    expect(html).toContain('<table');
    expect(html).toContain('Eretz Realty');
    expect(html).toContain('Cycle 1');
  });

  it('should format price as millions', () => {
    const formatted = formatPrice(2750000);
    expect(formatted).toBe('$2.8M');
  });
});
```

## Monitoring

### Email Logs

**Check Resend Dashboard:**
- Delivery status
- Open rates (if tracking enabled)
- Bounce/complaint rates

**Database Logs (`cycle_runs`):**
```sql
SELECT * FROM cycle_runs
ORDER BY createdAt DESC
LIMIT 10;
```

### Alerts

**Set up notifications for:**
- Failed sends
- High bounce rates
- Spam complaints
- Missing recipients
- Missing listings in cycle

## Next Steps

- [API Reference](./api-reference.md) - Email-related APIs
- [Deployment Guide](./deployment-guide.md) - Configuring cron jobs
- [Development Setup](./development-setup.md) - Testing emails locally
