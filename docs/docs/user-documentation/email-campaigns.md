# Email Campaign Management

The Email Campaign Management system is the core feature of the Eretz Realty Admin System. This section explains how the three-cycle distribution system works, how to monitor campaigns, and how to manage email distribution.

## Understanding the Three-Cycle System

### What is a Cycle?

A **cycle** is a group of property listings that are sent together in a weekly email campaign. The system uses three cycles that rotate on a weekly schedule:

- **Cycle 1**: First group of properties
- **Cycle 2**: Second group of properties
- **Cycle 3**: Third group of properties

### How the Rotation Works

The three-cycle rotation operates as follows:

1. **Week 1**: Cycle 1 properties are sent to all active subscribers
2. **Week 2**: Cycle 2 properties are sent to all active subscribers
3. **Week 3**: Cycle 3 properties are sent to all active subscribers
4. **Week 4**: Rotation returns to Cycle 1, and the pattern repeats

### Benefits of the Three-Cycle System

**For Subscribers:**
- Receive fresh property listings each week
- Never see the same properties in consecutive weeks
- Consistent, predictable email schedule
- Prevents email fatigue and maintains engagement

**For Your Business:**
- All properties receive regular exposure
- Even distribution of marketing efforts
- Automated, hands-off email distribution
- Strategic property showcase rotation

**For Campaign Management:**
- Organized property grouping
- Easy to balance and maintain
- Flexible property assignment
- Scalable as inventory grows

## Email Campaign Components

### What's Included in Each Email

Every email campaign contains:

#### Email Header
- **Subject Line**: "Eretz Realty - Cycle [Number] - [Month Year]"
- **From**: Eretz Realty
- **To**: All active email recipients

#### Email Body

**Property Listings**
- Properties grouped by property type (alphabetically)
- Each property type has its own section with a header
- Properties displayed in a formatted table

**Property Information Columns:**
1. **#** - Property ID with "New" indicator (green) if applicable
2. **Location** - Location description or address
3. **Dimensions** - Property/lot dimensions
4. **Rooms** - Number of rooms
5. **Square Footage** - Area in square feet
6. **Condition** - Property condition status
7. **Other** - Property features (comma-separated)
8. **Notes** - Zoning code
9. **Price** - Formatted price (shows "M" for millions, e.g., "2.7M")

**Visual Design:**
- Clean, professional layout
- Alternating row colors for easy reading
- Bold headers for property type sections
- Mobile-responsive design
- Branding footer

### Email Recipient List

Emails are sent to:
- All recipients in the Email Recipients list
- Only recipients with Active status = ON
- Recipients with Active status = OFF are excluded

See [Email Recipients Management](./email-recipients.md) for managing your subscriber list.

## Monitoring Campaigns

### Viewing Next Campaign

**From Dashboard (Cycle Manager):**
1. Check the "Next Cycle" summary card
2. Shows which cycle will be sent next (1, 2, or 3)
3. Click the corresponding cycle tab to view properties

**From Each Cycle Tab:**
- "Next Send Date" shows scheduled send date and time
- Example: "Next Send: Monday, January 23, 2026 at 9:00 AM"

### Campaign Schedule

**From Settings Page:**
1. Navigate to Settings (Schedule in sidebar)
2. View "Cycle Rotation Configuration" section
3. Shows:
   - Current configured day of week
   - Configured send time
   - Current cycle number
   - Last send timestamp
   - Next scheduled send date

See [Schedule Configuration](./schedule-configuration.md) for scheduling details.

### Campaign History

The system logs all email campaigns:
- Send date and time
- Cycle number sent
- Success or failure status
- Error messages (if any failures)

**Note**: Campaign history is stored in the database but not currently visible in the UI. Contact your administrator for historical campaign reports.

## Testing Email Campaigns

Before your campaigns go live, or when troubleshooting, you can send test emails.

### Sending a Test Email

A simple test email verifies your email configuration is working:

1. Navigate to the **Settings** page
2. Go to the **Email Testing** tab
3. In the "Send Test Email" section:
   - Enter your email address in the "Email Address" field
   - Click **Send Test Email**
4. Check your inbox for the test email
5. Subject line will be: "Eretz Realty - Test Email"

**What the test email contains:**
- Simple confirmation message
- Timestamp of when the test was sent
- Confirms that email integration is functioning

### Sending a Sample Properties Email

A sample email shows exactly how your campaign will look with real property data:

1. Navigate to the **Settings** page
2. Go to the **Email Testing** tab
3. In the "Send Sample Properties" section:
   - Enter your email address
   - Click **Send Sample Email**
4. Check your inbox for the sample email

**What the sample email contains:**
- Full campaign email format
- Up to 5 sample properties from your database
- Same layout and styling as actual campaigns
- Grouped by property type
- All property details formatted exactly as subscribers will see

**Use sample emails to:**
- Preview campaign appearance before sending
- Test email formatting on different devices
- Share preview with stakeholders
- Verify all property data displays correctly
- Test email deliverability to your domain

## Campaign Best Practices

### Before Each Campaign Send

Create a pre-send checklist:

1. **Review Properties** (1-2 days before)
   - Open Dashboard and click the next sending cycle tab
   - Review all properties in that cycle
   - Verify information accuracy
   - Update any outdated details
   - Check pricing for accuracy

2. **Verify Status Flags**
   - Confirm "New" badges are appropriate
   - Remove "New" from properties older than 2-4 weeks
   - Ensure all intended properties are Active
   - Archive any sold or unavailable properties

3. **Check Balance**
   - Review property count in the cycle
   - Ensure adequate properties (10-30 recommended)
   - Verify mix of property types
   - Confirm variety in price ranges

4. **Test Email** (day before)
   - Send a sample email to yourself
   - Review formatting on desktop and mobile
   - Verify all images and links work
   - Check for typos or data errors

5. **Confirm Recipients**
   - Go to Settings > Email Recipients
   - Verify active recipient count
   - Ensure intended subscribers are active
   - Deactivate any unsubscribe requests

### After Campaign Send

1. **Verify Send**
   - Check Settings page for "Last Run" timestamp
   - Confirm it shows recent send time
   - Note the "Next Cycle" has advanced

2. **Monitor Delivery**
   - Check your own inbox for received email
   - Verify formatting looks correct
   - Test links if applicable

3. **Update Properties**
   - Mark sold properties as archived
   - Add new properties to next cycles
   - Update "New" flags as needed

### Content Strategy

#### Property Selection

**Cycle Assignment Strategy:**
- Distribute premium properties across all cycles
- Balance high and low price points in each cycle
- Mix property types in each cycle
- Spread geographic areas across cycles
- Rotate featured/"new" properties

#### New Status Management

**When to Mark Properties "New":**
- Just added to the system (within last 2 weeks)
- Recently reduced price
- Featured or highlighted properties
- Just came back on market
- Recently renovated or improved

**When to Remove "New" Status:**
- Property has been in rotation for 3-4 weeks
- To make room for newer properties
- When property is no longer "news"

#### Property Updates

**Regular Maintenance:**
- Weekly: Review next sending cycle properties
- Bi-weekly: Update prices if changed
- Monthly: Archive sold properties
- Monthly: Remove old "new" flags
- Quarterly: Full database review and cleanup

### Optimizing Campaign Performance

#### Email Timing

Consider your recipients when scheduling:
- **Best Days**: Tuesday, Wednesday, Thursday typically perform best
- **Best Times**: Morning (8-10 AM) or lunch time (12-1 PM) in recipient timezone
- **Avoid**: Late Friday, weekends, holidays
- **Consistency**: Same day and time each week builds anticipation

#### Email Volume

**Properties Per Cycle:**
- **Minimum**: 5-10 properties (avoids sparse appearance)
- **Optimal**: 15-25 properties (good variety without overwhelming)
- **Maximum**: 30-40 properties (more can reduce engagement)

If you have more than 40 properties:
- Consider breaking into more cycles
- Feature different property segments
- Rotate properties through cycles more frequently

#### Content Balance

In each cycle, aim for:
- 30-40% residential properties
- 30-40% commercial properties
- 20-30% land/development opportunities
- Or adjust percentages based on your market

### Subscriber Management

#### Growing Your List

- Add recipients as they inquire
- Import recipient lists carefully
- Verify email addresses before adding
- Maintain permission records (GDPR/CAN-SPAM compliance)

#### Maintaining Quality

- Remove bounced email addresses
- Honor unsubscribe requests immediately
- Keep active status updated
- Periodically clean inactive subscribers

#### Engagement Tracking

While not built into this system, consider:
- Using your email service provider's analytics
- Tracking which properties get inquiries
- Monitoring open and click rates externally
- Adjusting content based on response

## Automated Campaign Execution

### How Automation Works

The system uses automated scheduling to send campaigns:

1. **Configuration**: You set the day of week and time in Settings
2. **Calculation**: System calculates next send date for each cycle
3. **Cron Job**: Automated task runs at scheduled time
4. **Execution**: System automatically:
   - Retrieves properties for current cycle
   - Formats email with property data
   - Sends to all active recipients
   - Logs the campaign run
   - Advances to next cycle
   - Calculates next send date

5. **Rotation**: Process repeats weekly without manual intervention

### Manual Oversight

While automation handles sending, you should:
- **Monitor**: Check dashboard regularly
- **Review**: Inspect properties before each send
- **Update**: Keep property data current
- **Test**: Send sample emails periodically
- **Verify**: Confirm sends completed successfully

### System Notifications

Currently, the system does not send admin notifications. To monitor campaigns:
- Check Settings page for "Last Run" timestamp
- Subscribe your own email to receive campaigns
- Periodically review campaign history with administrator

## Troubleshooting Campaigns

### Campaign Did Not Send

**Possible causes:**

1. **No Active Recipients**
   - Check Settings > Email Recipients
   - Ensure at least one recipient has Active = ON
   - Activate recipients if needed

2. **No Active Properties in Cycle**
   - Check Dashboard for the sending cycle
   - Verify properties exist and are Active
   - Reactivate archived properties or add new ones

3. **Incorrect Schedule Configuration**
   - Check Settings > Cycle Rotation Configuration
   - Verify day and time are set correctly
   - Ensure next run date is in the future

4. **Email Service Issues**
   - Contact your administrator
   - May need to check API key or service status

### Campaign Sent But Not Received

1. **Check Spam Folder**
   - Emails may be filtered to spam
   - Add sender to safe list

2. **Verify Email Address**
   - Confirm your email in recipients list
   - Check for typos in email address
   - Ensure your recipient status is Active

3. **Email Provider Issues**
   - Some providers block bulk emails
   - Contact IT or email administrator

### Properties Missing from Campaign

1. **Check Active Status**
   - Property must have Active = ON
   - Archived properties are excluded

2. **Verify Cycle Assignment**
   - Property must be assigned to the sending cycle
   - Edit property to change cycle if needed

3. **Timing**
   - Properties added after send won't appear until next rotation

### Formatting Issues

If emails look incorrect:
- Send a sample email to preview
- Test on multiple email clients (Gmail, Outlook, etc.)
- Check that property data has no special characters causing issues
- Contact administrator if persistent problems

## Next Steps

- Configure your campaign schedule in [Schedule Configuration](./schedule-configuration.md)
- Manage your subscriber list in [Email Recipients Management](./email-recipients.md)
- Organize properties in [Managing Listings](./managing-listings.md)
- Set up property attributes in [Lookup Tables](./lookup-tables.md)
