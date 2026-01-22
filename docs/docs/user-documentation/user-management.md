# User Management (Admin Only)

User Management allows administrators to create, modify, and manage user accounts in the Eretz Realty Admin System. This section is for administrators only.

## Access Requirements

### Administrator Role Required

User Management features are **only accessible to users with Administrator role**:

- Standard users cannot access user management
- Attempting to access redirects to an "Unauthorized" page
- The "Users" navigation item is hidden for non-admin users

### Accessing User Management

If you are an administrator:

1. Click **Users** in the sidebar navigation
2. The User Management page displays

If you don't see "Users" in the sidebar, you are not an administrator. Contact your system administrator to request admin privileges if needed.

## User Roles

The system supports two user roles:

### Standard User

**Permissions**:
- ✓ View and manage property listings
- ✓ Access Cycle Manager dashboard
- ✓ Configure email schedules
- ✓ Manage email recipients
- ✓ Send test emails
- ✓ Manage lookup tables
- ✗ Cannot access user management
- ✗ Cannot create, edit, or delete users

**Use Cases**:
- Real estate agents managing listings
- Marketing staff handling email campaigns
- Data entry personnel
- Team members who need operational access

### Administrator

**Permissions**:
- ✓ All standard user permissions, PLUS:
- ✓ Create new user accounts
- ✓ Reset user passwords
- ✓ Activate/deactivate user accounts
- ✓ Delete user accounts
- ✓ Full system configuration access
- ✓ Access user management page

**Use Cases**:
- System administrators
- IT staff
- Senior management
- Business owners

## User Management Interface

### Users List

The User Management page displays all users in a table format:

**Columns**:

1. **Email**
   - User's email address (username)
   - Unique identifier for login
   - Primary contact information

2. **Name**
   - User's full name
   - Display name throughout the system
   - Shown in sidebar when logged in

3. **Role**
   - Badge showing "Admin" or "User"
   - Admin badge typically highlighted
   - Indicates permission level

4. **Active**
   - Status indicator (Active or Inactive)
   - Green badge for active accounts
   - Gray badge for inactive accounts
   - Active users can log in, inactive cannot

5. **Last Login**
   - Timestamp of last successful login
   - Format: "January 15, 2026 at 9:30 AM"
   - Shows "Never" if user hasn't logged in yet
   - Useful for monitoring account usage

6. **Actions**
   - Dropdown menu with available actions
   - Reset Password, Toggle Active, Delete User

### User Count

At the top of the page:
- Total number of users displayed
- Includes both active and inactive users

## Creating New Users

### Opening the Create User Form

To create a new user account:

1. Click the **Add User** button (top-right corner)
2. The create user form opens in a modal dialog

### Filling in User Details

#### Email Address (Required)

- Enter the user's email address
- Must be valid email format (e.g., john@example.com)
- Must be unique (cannot duplicate existing users)
- Case-insensitive (John@example.com = john@example.com)
- Will serve as username for login

**Best Practices**:
- Use work or company email addresses
- Avoid personal emails for business users
- Verify email is correct before saving
- Ensure user has access to this email (for password resets)

#### Password (Required)

- Enter a secure initial password
- Will be used for first login
- User should change after first login (currently manual process)

**Password Requirements**:
- Minimum length recommended: 8 characters
- Should include mix of letters, numbers, symbols
- Avoid obvious passwords (e.g., "password123")
- Don't reuse passwords across accounts

**Security Recommendations**:
- Generate strong random passwords
- Use a password generator tool
- Share initial password securely (not via email if possible)
- Instruct user to change password after first login
- Consider implementing password policy

#### Name (Required)

- Enter user's full name
- Displayed throughout the system
- Shown in sidebar when user is logged in

**Formatting**:
- Use proper capitalization: "John Smith" not "john smith"
- Include full name: "John Smith" not "John"
- Consider including role/title if helpful: "John Smith - Broker"

#### Role (Required)

Select the appropriate role:

**User** (Default):
- Standard operational access
- Cannot manage users
- Suitable for most team members

**Admin**:
- Full system access
- Can manage users
- Only assign to trusted personnel

**Role Selection Guidelines**:
- Default to "User" unless admin access is necessary
- Limit number of administrators for security
- Only assign admin to personnel who need to manage users
- Review admin assignments periodically

### Saving the New User

1. Review all entered information
2. Ensure email, password, name are correct
3. Verify role selection is appropriate
4. Click **Create User** button
5. Success notification appears
6. New user appears in the users table
7. User can now log in with their email and password

### Communicating Credentials

After creating a user:

1. **Securely share credentials**:
   - Provide email (username) and initial password
   - Use secure channel (not email if possible)
   - Consider in-person handoff or encrypted message

2. **User onboarding**:
   - Explain how to access the system (URL)
   - Provide quick start guide or training
   - Recommend password change on first login
   - Set expectations for their role and permissions

3. **Follow up**:
   - Verify user can log in successfully
   - Check "Last Login" timestamp after they first log in
   - Address any access issues promptly

## Editing User Information

### Current Limitations

The current user management interface does **not support editing** user details after creation.

**Cannot Edit**:
- Email address
- Name
- Role

### Workarounds

If you need to change user information:

**Change Email**:
1. Create a new user with correct email
2. Delete the old user account
3. User logs in with new credentials

**Change Name**:
- Currently requires database-level update
- Contact your technical administrator

**Change Role**:
- Currently not supported via UI
- Contact your technical administrator
- May require database update

**Future Enhancement**: A user edit feature may be added in future updates.

## Resetting User Passwords

### When to Reset Passwords

Reset passwords when:
- User forgot their password
- Account may have been compromised
- User requests password change
- Regular security maintenance (e.g., every 90 days)
- Employee role change or termination pending

### Password Reset Process

1. Locate the user in the users table
2. Click the **Actions** dropdown (three dots) for that user
3. Select **Reset Password** from the menu
4. Enter new password in the dialog
5. Confirm the new password
6. Click **Reset Password** button
7. Success notification appears

### After Password Reset

1. **Communicate new password**:
   - Inform the user their password was reset
   - Provide new password via secure channel
   - Explain why reset was necessary

2. **Verify access**:
   - Confirm user can log in with new password
   - Check "Last Login" timestamp after they log in
   - Address any issues immediately

3. **Security best practices**:
   - Instruct user to change password again after logging in
   - Don't reuse old passwords
   - Use strong, unique passwords

## Activating and Deactivating Users

### Understanding Active Status

**Active Users**:
- Can log in to the system
- Have full access according to their role
- Display with green "Active" badge
- Default state for new users

**Inactive Users**:
- Cannot log in to the system
- Authentication will fail with error
- Display with gray "Inactive" badge
- Account data retained in database
- Can be reactivated anytime

### Toggling User Status

To activate or deactivate a user:

1. Locate the user in the users table
2. Click the **Actions** dropdown for that user
3. Select **Toggle Active** from the menu
4. Status immediately switches:
   - Active → Inactive (user can no longer log in)
   - Inactive → Active (user can log in again)
5. Badge color updates
6. Success notification confirms the change

### When to Deactivate Users

Deactivate accounts when:

**Temporary Situations**:
- Employee on leave or sabbatical
- Seasonal workers during off-season
- Contractors between projects
- Temporary suspension for policy violation

**Security Concerns**:
- Suspected account compromise
- Unusual activity detected
- Investigation pending

**Pending Decisions**:
- Employee resignation (before official departure)
- Contract ending soon
- Uncertain access needs

### When to Reactivate Users

Reactivate accounts when:
- Employee returns from leave
- Seasonal work resumes
- Security concern resolved
- Access need confirmed

### Benefits of Deactivation vs. Deletion

**Deactivation**:
- ✓ Preserves user data and history
- ✓ Can restore access easily
- ✓ Maintains audit trail
- ✓ Retains associations (if any)
- ✓ Reversible

**Deletion**:
- ✗ Permanent removal
- ✗ Cannot restore easily
- ✗ Loses historical data
- ✗ Irreversible

**Best Practice**: Deactivate first, delete only if certain.

## Deleting Users

### Permanent User Deletion

To permanently remove a user:

1. Locate the user in the users table
2. Click the **Actions** dropdown for that user
3. Select **Delete User** from the menu
4. Confirm the deletion when prompted
5. User is permanently removed from database
6. Success notification appears
7. User disappears from users table

### Important Warnings

**Deletion is Permanent**:
- Cannot be undone
- User data completely removed
- All sessions invalidated
- Cannot restore account
- Must create new account if needed later

**Cannot Delete Self**:
- You cannot delete your own account
- System prevents self-deletion
- Contact another administrator if you need to leave

### When to Delete Users

Delete accounts when:

**Permanent Removal**:
- Employee permanently left company
- Contract ended with no renewal
- Account created in error
- Duplicate account
- User will never need access again

**Security Requirements**:
- Compromised account cannot be secured
- Regulatory compliance requires removal
- Legal requirement to delete

**Data Cleanup**:
- Regular audit of old accounts
- Removing test accounts
- Consolidating user base

### Before Deleting

Checklist before permanent deletion:

1. ✓ Confirm user will never need access again
2. ✓ Verify not deleting your own account
3. ✓ Consider deactivating instead (safer)
4. ✓ Document reason for deletion
5. ✓ Export user data if needed for records
6. ✓ Notify relevant stakeholders

### After Deletion

- User can no longer log in
- User data removed from database
- Sessions terminated immediately
- Historical actions may still reference user ID
- Cannot reverse without database backup

## User Security Best Practices

### Password Management

**Strong Password Policy**:
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- No dictionary words
- No personal information
- Unique per user

**Regular Updates**:
- Reset passwords every 90 days
- Immediate reset if compromise suspected
- Reset upon employee role change
- Reset before sharing account (if absolutely necessary, not recommended)

**Secure Sharing**:
- Never email passwords
- Use secure messaging
- In-person handoff when possible
- Require change on first login

### Access Control

**Principle of Least Privilege**:
- Grant minimum permissions needed
- Default to "User" role
- Only assign "Admin" when necessary
- Review permissions regularly

**Regular Audits**:
- Monthly: Review active users list
- Quarterly: Verify all users still need access
- Annually: Full security audit
- Ongoing: Check "Last Login" for inactive accounts

**Immediate Actions**:
- Deactivate accounts upon employee departure
- Reset passwords when compromise suspected
- Remove access for terminated contractors
- Update permissions when roles change

### Monitoring User Activity

**Last Login Tracking**:
- Review "Last Login" timestamps regularly
- Identify accounts that haven't been used
- Deactivate accounts inactive for 90+ days (after verifying)
- Investigate unusual login patterns

**Account Hygiene**:
- Remove test accounts
- Delete duplicate accounts
- Consolidate unnecessary accounts
- Keep active user count minimal

### Role Management

**Admin Role Assignments**:
- Limit to 2-3 administrators maximum
- Only assign to trusted, trained personnel
- Document who has admin access
- Review admin list quarterly
- Remove admin rights when no longer needed

**User Role Defaults**:
- New accounts default to "User" role
- Explicitly require approval for admin access
- Document justification for admin grants
- Temporary admin access for specific tasks (if possible)

## Common User Management Scenarios

### Onboarding New Employee

1. Create user account with "User" role
2. Generate strong initial password
3. Provide credentials securely
4. Send user documentation link
5. Offer training or walkthrough
6. Verify successful first login
7. Confirm they can access needed features

### Offboarding Departing Employee

**Immediate Actions** (on last day or before):
1. Deactivate user account
2. Verify they cannot log in
3. Document deactivation reason
4. Plan permanent deletion (after retention period)

**Follow-Up** (after 30-90 days):
1. Review if account is still needed (no)
2. Permanently delete account
3. Document deletion
4. Archive any needed records separately

### Handling Forgotten Password

1. User contacts administrator
2. Verify user identity (important!)
3. Navigate to User Management
4. Reset user's password
5. Provide new password securely
6. Instruct user to change password after login
7. Verify successful login

### Promoting User to Administrator

**Current Process** (manual):
1. Contact technical administrator
2. Request role change from "User" to "Admin"
3. Technical admin updates database
4. Verify user can access Users page
5. Document role change and reason

**Future**: UI-based role editing may be added

### Handling Compromised Account

1. **Immediate**: Deactivate account
2. Investigate extent of compromise
3. Reset password to new strong password
4. Review recent account activity
5. Verify no unauthorized changes made
6. Reactivate account with new password
7. Inform user and instruct on security
8. Monitor account closely afterward

### Seasonal Staff Management

**Start of Season**:
1. Create user accounts for seasonal staff
2. Set up with "User" role
3. Provide training and credentials
4. Set calendar reminder for end of season

**End of Season**:
1. Deactivate accounts (don't delete)
2. Document deactivation
3. Note expected return date

**Next Season**:
1. Reactivate accounts
2. Reset passwords
3. Provide updated credentials
4. Refresh training if needed

## Troubleshooting

### User Cannot Log In

**Check Account Status**:
1. Open User Management page
2. Find user in table
3. Check "Active" badge:
   - If Inactive (gray): Toggle to Active
   - If Active (green): Check other causes

**Verify Credentials**:
1. Confirm user is using correct email (case doesn't matter)
2. Password is case-sensitive - verify user is entering correctly
3. Check for typos in email
4. Reset password if uncertain

**Check Recent Changes**:
- Was account recently created? May be system delay (rare)
- Was password recently reset? User must use new password
- Was account deactivated? Reactivate if appropriate

### Cannot Delete User

**Self-Deletion Prevention**:
- You cannot delete your own account
- System blocks this for safety
- Have another administrator delete your account if needed

**System Error**:
- Refresh page and try again
- Log out and log back in
- Contact technical support if persists

### User List Not Updating

**Refresh Page**:
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Changes should appear

**Cache Issue**:
- Clear browser cache
- Log out and log back in
- Try different browser

### Last Login Not Updating

**Normal Delay**:
- May take a few minutes to update
- Refresh page after user logs out
- Check again after some time

**Verify Login Successful**:
- User may have had login error
- Verify user can actually access system
- Check from their perspective

## Best Practices Summary

### Security

1. ✓ Use strong, unique passwords
2. ✓ Limit admin role assignments
3. ✓ Deactivate accounts immediately upon employee departure
4. ✓ Regular password resets (every 90 days)
5. ✓ Monitor last login timestamps
6. ✓ Audit user list quarterly

### User Lifecycle

1. ✓ Standardize onboarding process
2. ✓ Provide training for new users
3. ✓ Document user creation reasons
4. ✓ Follow offboarding checklist
5. ✓ Use deactivation before deletion

### Operations

1. ✓ Keep user count minimal
2. ✓ Remove test and duplicate accounts
3. ✓ Document role assignments
4. ✓ Maintain user management procedures
5. ✓ Regular system access review

### Communication

1. ✓ Securely share credentials
2. ✓ Notify users of password resets
3. ✓ Explain role and permissions
4. ✓ Provide documentation links
5. ✓ Offer training and support

## Next Steps

As an administrator, explore other system management areas:

- Configure system-wide settings in [Schedule Configuration](./schedule-configuration.md)
- Manage subscriber list in [Email Recipients Management](./email-recipients.md)
- Customize system attributes in [Lookup Tables](./lookup-tables.md)
- Understand overall workflow in [Dashboard & Cycle Manager](./dashboard-cycle-manager.md)
