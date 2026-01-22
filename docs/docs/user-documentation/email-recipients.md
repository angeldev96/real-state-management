# Email Recipients Management

The Email Recipients Management system allows you to maintain your subscriber list for email campaigns. This section explains how to add, edit, activate, deactivate, and remove email recipients.

## Accessing Email Recipients

1. Navigate to the **Settings** page (click Schedule in sidebar)
2. Click the **Email Recipients** tab
3. The Email Recipients management interface will display

## Understanding Email Recipients

### What are Email Recipients?

Email recipients are the subscribers who receive your automated property listing campaigns. Each recipient has:

- **Email Address**: The recipient's email address (unique, required)
- **Name**: The recipient's name (optional)
- **Active Status**: Whether the recipient receives emails (ON/OFF)
- **Created Date**: When the recipient was added to the system
- **Updated Date**: When the recipient was last modified

### Active vs. Inactive Recipients

**Active Recipients (ON)**:
- Receive all scheduled email campaigns
- Included in automated sends
- Display with a green "Active" badge
- Default status when adding new recipients

**Inactive Recipients (OFF)**:
- Do not receive email campaigns
- Excluded from automated sends
- Display with a gray "Inactive" badge
- Used for temporary pauses or soft deletion
- Can be reactivated anytime

## Email Recipients Interface

### Recipients List

The interface displays all recipients in a table format:

**Columns**:
1. **Email**: The recipient's email address
2. **Name**: The recipient's name (if provided)
3. **Status**: Badge showing Active (green) or Inactive (gray)
4. **Created**: Date when recipient was added
5. **Actions**: Action buttons for each recipient

### Action Buttons

For each recipient, you can:
- **Edit**: Modify email address or name
- **Toggle Active**: Switch between active and inactive status
- **Delete**: Permanently remove from system

## Adding New Recipients

### Single Recipient Addition

To add a new email recipient:

#### Step 1: Open Add Form

1. Click the **Add Recipient** button (top-right of recipients section)
2. A modal dialog opens with the recipient form

#### Step 2: Fill in Details

**Email Address** (Required)
- Enter the recipient's email address
- Must be a valid email format (e.g., john@example.com)
- Must be unique (cannot add duplicate emails)
- Case-insensitive (John@example.com = john@example.com)

**Name** (Optional)
- Enter the recipient's full name
- Example: "John Smith"
- Used for personalization and organization
- Not required but recommended

#### Step 3: Save

1. Review the entered information
2. Click **Add Recipient** button
3. The modal closes
4. A success notification appears
5. The new recipient appears in the list
6. Status defaults to Active (will receive emails)

### Validation and Error Handling

The system validates recipient data:

**Email Validation**:
- Must contain @ symbol
- Must have valid domain format
- Cannot be empty

**Duplicate Prevention**:
- If email already exists, you'll see an error
- Error message: "This email address already exists"
- Check the existing recipient and update if needed

**Example Valid Emails**:
- john@example.com
- jane.doe@company.com
- admin@realty-business.com
- user+tag@domain.co.uk

**Example Invalid Emails**:
- johndomain.com (missing @)
- @example.com (missing local part)
- john@  (incomplete domain)
- john smith@example.com (spaces not allowed)

## Editing Recipients

### Opening the Edit Form

To edit an existing recipient:

1. Locate the recipient in the table
2. Click the **Edit** button (pencil icon) in the Actions column
3. The edit form opens in a modal dialog

### Modifying Information

The edit form allows you to change:

**Email Address**
- Update to a different email
- Must remain unique
- Cannot change to an email that already exists

**Name**
- Update the recipient's name
- Can add a name if previously blank
- Can remove the name by clearing the field

### Saving Changes

1. Make your modifications
2. Click **Save Changes** button
3. System validates the new data
4. Success notification appears
5. Updated information displays in the table
6. Updated timestamp refreshes

### Canceling Edits

- Click **Cancel** or the X button to close without saving
- No changes will be applied
- Recipient data remains unchanged

## Managing Recipient Status

### Activating/Deactivating Recipients

To change a recipient's active status:

1. Locate the recipient in the table
2. Click the **Toggle Active** button in the Actions column
3. Status immediately switches:
   - Active → Inactive (stops receiving emails)
   - Inactive → Active (starts receiving emails)
4. Badge color updates (green for active, gray for inactive)
5. Success notification confirms the change

### When to Deactivate Recipients

Deactivate recipients when:

**Temporary Situations**:
- Recipient requested temporary pause
- Vacation or out-of-office period
- Testing or troubleshooting campaigns
- Seasonal pauses (e.g., summer break)

**Performance Issues**:
- Email bouncing (delivery failures)
- Spam complaints
- Low engagement

**Business Reasons**:
- Prospect converted to client (moved to different list)
- Changed role or company
- Requested different communication frequency

### When to Reactivate Recipients

Reactivate when:
- Temporary pause period ended
- Recipient requested to resume emails
- Delivery issues resolved
- Business relationship renewed

## Deleting Recipients

### Permanent Removal

To permanently delete a recipient:

1. Locate the recipient in the table
2. Click the **Delete** button (trash icon) in Actions column
3. Confirm the deletion when prompted
4. The recipient is permanently removed from the database
5. Success notification confirms deletion

### Important Considerations

**Deletion is Permanent**:
- Cannot be undone
- All recipient data is removed
- No historical record retained

**When to Delete**:
- Invalid email addresses
- Duplicate entries (after consolidating)
- Hard unsubscribe requests (legal compliance)
- Definitively removed from marketing

**When NOT to Delete**:
- Temporary pauses (use Deactivate instead)
- Uncertain situations (use Deactivate first)
- May need historical record
- Might reactivate later

**Best Practice**: Use Deactivate for most situations, reserve Delete for permanent removal.

## Bulk Operations

### Current Capabilities

The current interface handles one recipient at a time:
- Add one recipient per form submission
- Edit one recipient at a time
- Toggle status one recipient at a time
- Delete one recipient at a time

### Adding Multiple Recipients

To add multiple recipients efficiently:

1. Open the Add Recipient form
2. Fill in first recipient details
3. Click Add Recipient
4. Immediately click Add Recipient again
5. Fill in next recipient
6. Repeat for all recipients

**For Large Lists**:
Contact your system administrator about:
- CSV import functionality
- Bulk upload tools
- API integration for mass additions

## Best Practices

### List Hygiene

**Regular Maintenance**:
- Weekly: Review new bounces or complaints
- Monthly: Check for inactive addresses
- Quarterly: Clean up persistent hard bounces
- Annually: Full list audit

**Quality Over Quantity**:
- Maintain engaged, interested recipients
- Remove or deactivate persistently inactive addresses
- Don't keep recipients who never engage
- Smaller engaged list > larger unengaged list

**Compliance**:
- Obtain explicit permission before adding recipients
- Honor unsubscribe requests immediately
- Keep records of subscription consent
- Follow CAN-SPAM and GDPR requirements

### Data Management

**Naming Conventions**:
- Use consistent name formats (First Last)
- Include company names if relevant (John Smith - ABC Realty)
- Add notes in name field if helpful (John Smith - Investor)

**Email Address Accuracy**:
- Double-check for typos before adding
- Test with a single send before full campaigns
- Verify critical contacts immediately after adding

**Organization**:
- Although the system doesn't have folders/groups, you can:
- Use name fields for categorization
- Track recipient types externally if needed
- Consider exporting list periodically for backup

### Privacy and Security

**Protect Recipient Data**:
- Don't share email list outside organization
- Be careful when viewing list in public spaces
- Log out when finished managing recipients
- Use secure networks when accessing system

**Consent Management**:
- Only add recipients who opted in
- Document consent method and date
- Maintain separate records if required by law
- Remove recipients promptly upon request

## Common Tasks

### Honoring Unsubscribe Requests

When someone requests to unsubscribe:

**Immediate Action** (Required):
1. Navigate to Email Recipients
2. Locate the recipient's email
3. Click Toggle Active to deactivate
4. This stops all future emails immediately

**Follow-Up** (Optional):
- If hard unsubscribe, consider deleting after deactivating
- Document unsubscribe request
- Confirm with recipient that they're removed

### Handling Bounced Emails

When an email bounces (delivery failure):

**Soft Bounce** (temporary issue):
1. Deactivate the recipient
2. Wait 1-2 weeks
3. Reactivate to try again
4. If continues bouncing, delete or keep deactivated

**Hard Bounce** (permanent failure):
1. Deactivate immediately
2. Verify email address for typos
3. If correct, delete the recipient
4. Invalid addresses won't receive anyway

### Managing VIP Recipients

For important recipients you want to monitor:

1. Add descriptive names (e.g., "John Smith - Board Member")
2. Send test campaigns to your own email first
3. Check their status before each campaign
4. Ensure they're always active
5. Verify they're receiving campaigns

### Seasonal Campaigns

If pausing campaigns seasonally:

**Before Break**:
- Optionally deactivate all recipients, or
- Simply stop adding properties to cycles (campaigns still send but empty)

**After Break**:
- Reactivate all deactivated recipients
- Send a sample email to yourself first
- Resume normal property additions

## Monitoring Recipients

### Key Metrics to Track

While not shown in the UI, consider tracking:

**List Size**:
- Total recipients (active + inactive)
- Active recipients count
- Growth rate (monthly additions)

**List Health**:
- Bounce rate (bounced emails / total sent)
- Unsubscribe rate (unsubscribes / total sent)
- Complaint rate (spam complaints / total sent)

**Engagement** (via external analytics):
- Open rate (emails opened / emails delivered)
- Click rate (links clicked / emails delivered)
- Action rate (inquiries / emails sent)

### Reviewing Recipient List

**Regular Review Schedule**:

**Weekly**:
- Check for any new bounces or complaints
- Add new subscribers
- Process unsubscribe requests

**Monthly**:
- Review total active recipient count
- Identify and remove hard bounces
- Note growth trends

**Quarterly**:
- Full list audit
- Remove persistently inactive
- Verify important contacts still active
- Clean up duplicate or test entries

## Troubleshooting

### Cannot Add Recipient - Duplicate Email Error

**Cause**: Email already exists in system

**Solution**:
1. Search for the email in the recipient list
2. Check if it's already there (may be inactive)
3. If inactive, reactivate instead of re-adding
4. If need to update details, use Edit instead
5. If truly duplicate, use existing entry

### Recipient Not Receiving Emails

**Check Active Status**:
1. Find recipient in list
2. Verify status badge is green (Active)
3. If gray (Inactive), click Toggle Active

**Check Email Address**:
1. Verify email address is correct
2. Check for typos
3. Confirm email domain is valid
4. Test by sending sample email to that address

**Check Spam Folder**:
1. Ask recipient to check spam/junk folder
2. Add sender to safe list
3. Mark previous emails as "Not Spam"

**Check Email Service**:
- Some email providers block bulk emails
- Corporate email may have strict filters
- Try alternative email address
- Contact IT or administrator

### Wrong Name Displayed

**Solution**:
1. Click Edit button for recipient
2. Update name field
3. Save changes
4. Refresh page to confirm update

### Cannot Delete Recipient

**Possible Causes**:
- Browser issue: Try refreshing page
- Permissions issue: Contact administrator
- System error: Check browser console for errors

**Workaround**:
- Deactivate instead of deleting
- Contact administrator for manual deletion

## Email List Growth Strategies

### Building Your List

**Organic Growth**:
- Add contacts who inquire about properties
- Include opt-in on your website
- Offer valuable content in exchange for email
- Network at real estate events

**Professional Networks**:
- Connect with realtors and brokers
- Partner with complementary businesses
- Join real estate investment groups
- Attend industry conferences

**Quality Sources**:
- Personal referrals from existing clients
- Event attendees who opted in
- Website contact forms with consent checkbox
- Professional association directories (with permission)

**Avoid**:
- Purchased email lists (poor engagement, legal risk)
- Scraping websites (illegal in many jurisdictions)
- Adding without permission (spam complaints)
- Generic contact forms without clear consent

## Next Steps

- Configure send schedule in [Schedule Configuration](./schedule-configuration.md)
- Understand campaign process in [Email Campaign Management](./email-campaigns.md)
- Prepare properties for campaigns in [Managing Listings](./managing-listings.md)
