# Schedule Configuration

The Schedule Configuration page allows you to control when your email campaigns are automatically sent. This section explains how to set up and manage your campaign schedule.

## Accessing Schedule Settings

Click **Schedule** in the sidebar navigation to access the schedule configuration interface.

## Understanding Campaign Scheduling

### Automated Distribution

The Eretz Realty Admin System uses automated scheduling to send email campaigns:

- Campaigns are sent automatically on a weekly schedule
- You configure the day of week and time
- The system handles all three cycles automatically
- Each cycle sends on its scheduled date in rotation
- No manual intervention required once configured

### Three-Cycle Weekly Rotation

With three cycles, your schedule works as follows:

**Example Configuration**: Send emails every Monday at 9:00 AM

- **Week 1**: Monday 9:00 AM - Cycle 1 sent
- **Week 2**: Monday 9:00 AM - Cycle 2 sent
- **Week 3**: Monday 9:00 AM - Cycle 3 sent
- **Week 4**: Monday 9:00 AM - Cycle 1 sent again (rotation continues)

## Settings Page Overview

The Settings page contains multiple tabs:

- **Cycle Rotation Configuration**: Set schedule
- **Email Testing**: Send test emails
- **Email Recipients**: Manage subscribers
- **Property Types, Conditions, Zonings, Features**: Manage lookup tables

This section focuses on the **Cycle Rotation Configuration** tab.

## Cycle Rotation Configuration

### Configuration Panel

The Cycle Rotation Configuration section displays:

#### Current Configuration

**Day of Week**
- The currently configured send day
- Options: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
- Displayed as a dropdown selector

**Send Time**
- The currently configured send time
- Format: HH:MM (24-hour format)
- Example: 09:00 for 9:00 AM, 14:30 for 2:30 PM

#### Current Status

**Current Cycle**
- Shows which cycle number is currently active (1, 2, or 3)
- This is the cycle that will send next

**Last Run**
- Timestamp of the last successful campaign send
- Format: "January 15, 2026 at 9:00 AM"
- Shows "Never" if no campaigns have been sent yet

**Next Run**
- Calculated date and time of the next scheduled send
- Updates automatically based on your configuration
- Example: "Monday, January 22, 2026 at 9:00 AM"

### Configuring the Schedule

To set or change your campaign schedule:

#### Step 1: Open Configuration

1. Navigate to Settings page
2. Click the **Cycle Rotation Configuration** tab (if not already selected)
3. Locate the configuration form

#### Step 2: Select Day of Week

1. Click the **Day of Week** dropdown
2. Select your preferred send day:
   - Sunday (0)
   - Monday (1)
   - Tuesday (2)
   - Wednesday (3)
   - Thursday (4)
   - Friday (5)
   - Saturday (6)

**Choosing the Best Day:**
- **Tuesday-Thursday**: Generally best engagement rates
- **Monday**: Good for starting the week
- **Friday**: Acceptable but may have lower engagement
- **Weekend**: Typically not recommended for business emails

#### Step 3: Set Send Time

1. Click the **Send Time** field
2. Enter time in HH:MM format (24-hour)
3. Examples:
   - 09:00 (9:00 AM)
   - 12:00 (12:00 PM / Noon)
   - 14:30 (2:30 PM)
   - 17:00 (5:00 PM)

**Choosing the Best Time:**
- **Morning (8-10 AM)**: High engagement, emails at top of inbox
- **Lunch (12-1 PM)**: Good for browsing during break
- **Afternoon (2-4 PM)**: Acceptable, but lower priority for recipients
- **Evening (5-7 PM)**: May work for residential focus
- **Night**: Generally not recommended

**Timezone Consideration:**
- Send times are in **Eastern Time (America/New_York)**
- Consider your primary recipient timezone
- Adjust time to reach recipients during optimal hours

#### Step 4: Save Configuration

1. Review your selections
2. Click **Save Configuration** button
3. System validates your input
4. Success notification appears
5. "Next Run" date updates automatically

### What Happens When You Save

When you save your configuration:

1. **Validation**: System checks that day and time are valid
2. **Update**: Configuration saved to database
3. **Calculation**: System calculates next send date:
   - Finds the next occurrence of your selected day
   - Sets the time to your specified time
   - Accounts for timezone (Eastern Time)
   - If today is your send day but time has passed, schedules for next week
4. **Display**: Next Run date updates to show new schedule
5. **Automation**: Cron system automatically sends at scheduled time

## Understanding Next Run Calculation

### How Next Run Date is Determined

The system calculates the next send date using this logic:

1. **Current date/time** (in Eastern Time)
2. **Find next occurrence** of configured day of week
3. **Set time** to configured send time
4. **If today is send day**:
   - If current time is before send time: Schedule for today
   - If current time is after send time: Schedule for next week

### Example Scenarios

**Scenario 1**: Configure Monday 9:00 AM on a Wednesday
- Next Run: The upcoming Monday at 9:00 AM (5 days away)

**Scenario 2**: Configure Wednesday 9:00 AM on a Wednesday at 8:00 AM
- Next Run: Today (Wednesday) at 9:00 AM (1 hour away)

**Scenario 3**: Configure Wednesday 9:00 AM on a Wednesday at 10:00 AM
- Next Run: Next Wednesday at 9:00 AM (7 days away)

**Scenario 4**: Configure Friday 2:00 PM on a Monday
- Next Run: The upcoming Friday at 2:00 PM (4 days away)

## Monitoring Campaign Execution

### Verifying Sends

To confirm a campaign was sent:

1. Check the **Last Run** timestamp in Settings
2. If recently updated, campaign sent successfully
3. Check your own email inbox (if subscribed)
4. Review Dashboard - "Next Cycle" should have advanced

### Next Cycle Advancement

After each successful send:

- **Current Cycle** advances (1→2, 2→3, 3→1)
- **Last Run** updates to send timestamp
- **Next Run** recalculates to next week same day/time

Example progression:
- **Week 1**: Cycle 1 sent, Current Cycle becomes 2
- **Week 2**: Cycle 2 sent, Current Cycle becomes 3
- **Week 3**: Cycle 3 sent, Current Cycle becomes 1
- **Week 4**: Cycle 1 sent, Current Cycle becomes 2
- (Pattern continues indefinitely)

## Email Testing

### Send Test Email

Before going live, test your email configuration:

1. Go to **Email Testing** tab in Settings
2. Enter your email address in "Email Address" field
3. Click **Send Test Email**
4. Check your inbox
5. Confirm you received "Eretz Realty - Test Email"

**Purpose**: Verifies email service is configured and working

### Send Sample Properties Email

Preview how campaigns will look:

1. Go to **Email Testing** tab
2. Enter your email address
3. Click **Send Sample Email**
4. Check your inbox
5. Review the full formatted email with sample properties

**Purpose**: See exactly how subscribers will see campaigns

**What to Check**:
- Email formatting looks professional
- Property data displays correctly
- All columns are readable
- Mobile view is acceptable (if checking on phone)
- Branding appears correctly

## Best Practices

### Scheduling Strategy

#### Consistency is Key
- Choose a day and time and stick with it
- Subscribers will anticipate your emails
- Builds routine and improves engagement
- Avoids confusion about send schedule

#### Optimal Timing
- Research your audience's preferences
- Consider their business hours
- Avoid holidays and known busy periods
- Test different times if engagement is low

#### Advance Planning
- Set up schedule at least one week before first send
- Verify schedule with stakeholders
- Ensure properties are ready before first send
- Test with sample emails before going live

### Pre-Launch Checklist

Before activating automated campaigns:

1. ✓ Schedule configured and saved
2. ✓ Test email sent and received successfully
3. ✓ Sample email sent and reviewed
4. ✓ Email recipients added and activated
5. ✓ Properties added to all three cycles
6. ✓ Properties reviewed for accuracy
7. ✓ All stakeholders notified of schedule
8. ✓ First cycle content approved

### Ongoing Maintenance

**Weekly**:
- Verify last send completed successfully
- Note next send date
- Review next cycle's properties

**Monthly**:
- Confirm schedule still appropriate
- Review campaign timing effectiveness
- Adjust time if needed based on engagement

**Quarterly**:
- Evaluate overall schedule performance
- Consider A/B testing different send times
- Review feedback from subscribers

### Making Schedule Changes

**To change send day or time**:

1. Navigate to Settings > Cycle Rotation Configuration
2. Select new day or enter new time
3. Save configuration
4. Note the new Next Run date
5. Inform subscribers if significant change

**Important**:
- Changes take effect for the next scheduled send
- In-progress sends cannot be cancelled
- Plan changes around your rotation

## Technical Details

### Timezone

All send times use **Eastern Time (America/New_York)**:
- Automatically adjusts for Daylight Saving Time
- Spring forward: March (lose 1 hour)
- Fall back: November (gain 1 hour)

**Example**:
- Configured time: 09:00
- EDT (Summer): Email sends at 9:00 AM EDT
- EST (Winter): Email sends at 9:00 AM EST

### Cron Automation

The system uses a cron job to trigger sends:
- Runs automatically at scheduled times
- No manual intervention needed
- Checks if current time matches scheduled time
- Executes send if conditions are met
- Logs results for tracking

**Requirements for Send**:
1. Current time >= Next Run time
2. At least one active email recipient
3. At least one active property in current cycle
4. Email service configured properly

If any requirement fails, send is skipped and system logs the issue.

## Troubleshooting

### Campaign Did Not Send at Scheduled Time

**Check Next Run Date**:
- Verify Next Run shows expected date/time
- Ensure current date/time is past Next Run

**Check Active Recipients**:
- Navigate to Email Recipients tab
- Verify at least one recipient is Active
- Activate recipients if none are active

**Check Active Properties**:
- Check Dashboard for current cycle
- Verify cycle has active properties
- Activate or add properties if cycle is empty

**Check Last Run**:
- If Last Run is recent, campaign may have already sent
- Verify Next Run advanced to next week

### Next Run Date Seems Wrong

**Recalculate**:
- Edit and re-save your configuration
- This forces recalculation
- Check if Next Run corrects

**Verify Day/Time**:
- Confirm Day of Week is correct
- Confirm Send Time is in HH:MM 24-hour format
- Save again if adjustments needed

### Changed Schedule But Next Run Didn't Update

- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Log out and log back in
- Verify the save was successful (check for success notification)
- Contact administrator if issue persists

### Time is Off by One Hour

- Check if Daylight Saving Time recently changed
- System automatically adjusts for DST
- Eastern Time shifts in March and November
- This is normal behavior

### Test Email Not Received

1. Check spam/junk folder
2. Verify email address entered correctly
3. Try different email address
4. Contact administrator to check email service configuration

## Advanced Configuration

### Multiple Cycles Per Week

**Current Configuration**: One cycle per week

If you want to send multiple times per week:
- Contact your system administrator
- May require custom configuration
- Can set different days for different cycles

### Immediate Send

To trigger an immediate send outside the schedule:
- Contact your system administrator
- Manual trigger may be available via admin tools
- Not recommended as it disrupts rotation

### Pausing Campaigns

To temporarily stop automated sends:

**Option 1**: Deactivate all recipients
- Go to Email Recipients
- Toggle all recipients to Inactive
- Campaigns will not send to zero recipients

**Option 2**: Contact administrator
- Request temporary schedule disable
- May require backend configuration

**Note**: Simply not having properties in a cycle will cause that send to be skipped, but rotation continues.

## Next Steps

- Manage your subscriber list in [Email Recipients Management](./email-recipients.md)
- Test campaigns with [Email Campaign Management](./email-campaigns.md)
- Ensure properties are ready in [Managing Listings](./managing-listings.md)
