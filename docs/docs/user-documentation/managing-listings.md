# Managing Listings

The Listings page is your comprehensive workspace for managing all property listings in the Eretz Realty Admin System. This section provides detailed information on creating, editing, organizing, and deleting property listings.

## Accessing the Listings Page

Click **All Listings** in the sidebar navigation to access the complete property management interface.

## Listings Page Overview

The Listings page provides multiple ways to view and manage your properties:

### Page Header

- **Title**: "All Listings"
- **Description**: Brief overview of total properties
- **Add Listing Button**: Creates new property listings

### View Modes

Toggle between two view modes using the buttons in the top section:

#### Table View
- Displays properties in a sortable data table
- Shows all key information in columns
- Best for data entry and bulk management
- Supports inline sorting and filtering

#### Grid View
- Displays properties as cards
- Visual card-based layout
- Best for browsing and quick visual scanning
- Shows property details in an organized card format

### Filter Panel

Located at the top of the listings area, the filter panel allows you to narrow down displayed properties:

- **Search**: Filter by address or location description
- **Cycle**: Filter by cycle assignment (1, 2, 3, or All)
- **Property Type**: Filter by property category
- **Condition**: Filter by property condition
- **Zoning**: Filter by zoning code
- **Status**: Filter by active or archived status

### Pagination

- Displays 20 properties per page
- Navigate between pages using the pagination controls at the bottom
- Shows current page and total pages

## Creating a New Listing

### Starting the Creation Process

To create a new property listing:

1. Click the **Add Listing** button (top-right corner)
2. A modal dialog will open with the property form
3. Fill in all required and optional fields
4. Click **Create Listing** to save

### Property Form Fields

#### Basic Information

**Address** (Required)
- Full street address of the property
- Example: "123 Main Street, Brooklyn, NY 11201"
- Primary identifier displayed in listings

**Location Description** (Optional)
- Additional details about the area or neighborhood
- Example: "Prime Williamsburg location"
- Helps provide context to potential buyers

**Dimensions** (Optional)
- Property or lot dimensions
- Example: "50x100" or "25x100 irregular"
- Useful for land and commercial properties

**Rooms** (Optional)
- Number of rooms in the property
- Enter as a whole number
- Typically used for residential properties

**Square Footage** (Optional)
- Total area in square feet
- Enter as a whole number
- Example: 1500 for 1,500 sq ft

**Price** (Optional)
- Property price in dollars
- Enter as a whole number (without commas or dollar signs)
- Example: 2750000 for $2,750,000
- Displayed in emails formatted as millions (e.g., "2.75M") when appropriate

#### Classification

**Cycle Group** (Required)
- Assign the property to Cycle 1, 2, or 3
- Determines which weekly email campaign includes this property
- Choose based on cycle balance and distribution strategy

**Property Type** (Optional)
- Select from predefined property categories
- Examples: Apartment, Commercial, Land, Multi-Family
- Used to group properties in emails and reports

**Condition** (Optional)
- Select the property's condition status
- Examples: Excellent, Good, Fair, Poor
- Helps set buyer expectations

**Zoning** (Optional)
- Select the zoning classification
- Examples: R1, R2, C1, C2, M1
- Important for commercial and development properties

**Features** (Optional)
- Multi-select field for property amenities
- Examples: Renovated, Parking, Garden, Pool, Basement
- Select all applicable features
- Click the dropdown and check multiple options
- Click outside the dropdown to close

#### Status Toggles

**On Market (New Status)**
- Toggle ON to mark property as "New"
- Properties marked as new display with a green "NEW" badge in email campaigns
- Use for recently added or featured properties
- Toggle OFF to remove the "new" designation

**Active Status**
- Toggle ON for active properties (default)
- Active properties are included in email campaigns
- Toggle OFF to archive the property
- Archived properties are hidden from campaigns but retained in the system

### Saving the Listing

After filling in the form:

1. Review all entered information for accuracy
2. Click **Create Listing** to save
3. The modal will close
4. A success notification will appear
5. The new property will appear in the listings table/grid
6. The property is immediately available for email campaigns (if active)

### Form Validation

The form validates your input:

- Required fields must be filled
- Numeric fields only accept numbers
- The cycle group must be selected
- Error messages display if validation fails

## Editing an Existing Listing

### Opening the Edit Form

To edit a property:

**From Table View:**
1. Locate the property in the table
2. Click the **Edit** button in the Actions column
3. The edit form opens in a modal dialog

**From Grid View:**
1. Locate the property card
2. Click the **Edit** button on the card
3. The edit form opens in a modal dialog

**From Dashboard:**
1. Navigate to a cycle tab
2. Locate the property card
3. Click the **Edit** button on the card

### Making Changes

1. The form opens pre-filled with current property data
2. Modify any fields as needed
3. Changes can include:
   - Updating property details
   - Changing cycle assignment
   - Adding or removing features
   - Updating status toggles
   - Modifying price or dimensions

### Saving Changes

1. After making modifications, click **Save**
2. The modal closes
3. A success notification confirms the update
4. Changes are immediately reflected in all views
5. Updated properties appear in the next email campaign for their assigned cycle

### Canceling Edits

- Click **Cancel** or the X button to close without saving
- No changes will be applied
- The property retains its previous values

## Deleting a Listing

### Deletion Process

To permanently remove a property:

**From Table View:**
1. Locate the property row
2. Click the **Delete** button in the Actions column
3. Confirm the deletion when prompted
4. The property is permanently removed

**Important Notes:**
- Deletion is permanent and cannot be undone
- Consider using the Archive feature (toggle Active OFF) instead of deleting
- Deleted properties are completely removed from the database
- Property associations (features, etc.) are also deleted

### When to Delete vs. Archive

**Delete When:**
- The property was entered in error
- The listing is a duplicate
- The property should be permanently removed from the system

**Archive When:**
- The property has been sold
- The listing is temporarily unavailable
- You want to retain the property data for historical purposes
- You might reactivate the property later

## Filtering and Searching

### Using the Search Field

The search function helps you quickly find properties:

1. Type in the search field
2. Search looks for matches in:
   - Property address
   - Location description
3. Results update automatically as you type
4. Clear the search to show all properties again

### Applying Filters

Use dropdown filters to narrow your view:

**Cycle Filter:**
- Shows properties from selected cycle only
- Options: All, Cycle 1, Cycle 2, Cycle 3
- Useful for reviewing what will be sent in specific campaigns

**Property Type Filter:**
- Shows only properties of selected type
- Examples: Show only Apartments or only Commercial properties
- Helps focus on specific property categories

**Condition Filter:**
- Shows properties in selected condition
- Filter by Excellent, Good, Fair, Poor, etc.
- Useful for quality control

**Zoning Filter:**
- Shows properties with selected zoning
- Filter by R1, C2, M1, etc.
- Important for specialized searches

**Status Filter:**
- **Active**: Shows only active properties (included in campaigns)
- **Archived**: Shows only archived properties
- **All**: Shows both active and archived

### Combining Filters

You can combine multiple filters:

1. Apply search text
2. Select cycle filter
3. Select property type
4. Select condition
5. Select zoning
6. Select status

All filters work together to narrow results. Only properties matching ALL selected criteria will display.

### Clearing Filters

To reset filters:

1. Click **Clear Filters** button
2. All filters reset to default (showing all properties)
3. Search field is cleared
4. Full property list displays

## Bulk Status Operations

### Toggling Market Status

For each property in the table view:

1. Locate the "On Market" toggle switch in the row
2. Click the toggle to switch between:
   - ON: Property displays "NEW" badge in emails
   - OFF: Property displays without "NEW" badge
3. Status updates immediately
4. No confirmation needed

### Toggling Active Status

For each property:

1. Locate the "Active" toggle switch
2. Click to switch between:
   - ON: Property is active and included in campaigns
   - OFF: Property is archived and excluded from campaigns
3. Status updates immediately
4. Archived properties remain in the system but don't appear in emails

## Sorting in Table View

Click column headers to sort:

- **Address**: Alphabetical sort
- **Location**: Alphabetical sort
- **Cycle**: Numerical sort (1, 2, 3)
- **Property Type**: Alphabetical sort
- **Price**: Numerical sort (lowest to highest, then highest to lowest)
- **Status**: Grouped by active/archived

Click the same header again to reverse sort order.

## Property Card Details (Grid View)

Each property card displays:

### Top Section
- Property ID
- "NEW" badge (green) if on market
- "ARCHIVED" badge (gray) if inactive

### Main Information
- Full address (bold)
- Location description
- Property type

### Property Details
- Dimensions
- Number of rooms
- Square footage
- Condition status

### Financial
- Price (formatted, e.g., "$2.7M")

### Additional Info
- Features list (comma-separated)
- Zoning code

### Actions
- Edit button (blue pencil icon)

## Best Practices

### Data Entry

1. **Consistent Formatting**: Use consistent formats for addresses and dimensions
2. **Complete Information**: Fill in as many fields as possible for better listings
3. **Accurate Pricing**: Always double-check price entries (no decimals, no commas)
4. **Meaningful Descriptions**: Write clear, informative location descriptions
5. **Appropriate Features**: Only select features that truly apply to the property

### Cycle Assignment

1. **Balance Cycles**: Distribute properties evenly across all three cycles
2. **Mix Property Types**: Each cycle should have variety
3. **Consider Timing**: Assign time-sensitive properties to the next sending cycle
4. **New Properties**: Spread new listings across cycles for consistent freshness

### Status Management

1. **New Status Duration**: Keep properties marked "new" for 2-4 weeks only
2. **Regular Reviews**: Weekly check for properties that should lose "new" status
3. **Archive Promptly**: Archive sold properties immediately
4. **Reactivation**: Archived properties can be reactivated anytime by toggling Active ON

### Organization

1. **Regular Cleanup**: Archive or delete outdated listings monthly
2. **Consistent Types**: Use standardized property type classifications
3. **Feature Consistency**: Apply the same feature terminology across similar properties
4. **Verify Data**: Periodically review listings for accuracy

## Common Tasks

### Adding Multiple Properties

1. Open the Add Listing form
2. Fill in the first property
3. Click Create Listing
4. Immediately click Add Listing again for the next property
5. Repeat for all properties

### Updating Prices Across Properties

1. Use filters to show relevant properties
2. Edit each property individually
3. Update the price field
4. Save and move to next

### Moving Properties Between Cycles

1. Use the Cycle filter to show current cycle
2. Edit each property
3. Change the Cycle Group dropdown
4. Save changes
5. Property immediately moves to new cycle

### Preparing for a Campaign

1. Filter by the next sending cycle
2. Review all properties in that cycle
3. Verify information accuracy
4. Update any outdated details
5. Toggle "New" status appropriately
6. Ensure all intended properties are Active

## Troubleshooting

### Property Not Appearing in Campaign

Check:
- Is the property Active? (Active toggle must be ON)
- Is it assigned to the correct cycle?
- Has the campaign already been sent?
- Are filters hiding the property?

### Cannot Save Listing

Possible causes:
- Required fields not filled (Address, Cycle Group)
- Invalid numeric values in numeric fields
- Check for error messages in the form

### Property Appears in Wrong Cycle

- Edit the property
- Change Cycle Group to the correct number
- Save changes
- Verify in Dashboard that it moved

### "NEW" Badge Not Showing

- Edit the property
- Ensure "On Market" toggle is ON
- Save changes
- Verify in next email campaign

## Next Steps

- Learn about email distribution in [Email Campaign Management](./email-campaigns.md)
- Configure campaign schedules in [Schedule Configuration](./schedule-configuration.md)
- Manage property attributes in [Lookup Tables](./lookup-tables.md)
