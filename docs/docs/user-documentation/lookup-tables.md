# Lookup Tables Management

Lookup Tables are customizable lists of property attributes used throughout the system. This section explains how to manage Property Types, Conditions, Zonings, and Features to suit your specific business needs.

## What are Lookup Tables?

Lookup Tables (also called "Classification Tables" or "Catalog Tables") are predefined lists of values used to categorize and describe properties. They provide:

- **Consistency**: Standard terminology across all listings
- **Organization**: Grouping and filtering properties
- **Flexibility**: Customizable to your market and needs
- **Efficiency**: Quick selection via dropdowns

The system includes four lookup tables:
1. **Property Types** - Categories of properties
2. **Conditions** - Property condition states
3. **Zonings** - Zoning classifications
4. **Features** - Property amenities and characteristics

## Accessing Lookup Tables

1. Navigate to the **Settings** page (Schedule in sidebar)
2. Select one of the lookup table tabs:
   - Property Types
   - Conditions
   - Zonings
   - Features
3. The management interface for that table displays

## Understanding Lookup Table Structure

Each lookup table item has:

- **Name/Code**: The label (e.g., "Apartment", "Excellent", "R1", "Parking")
- **Active Status**: Whether it's available for use (ON/OFF)
- **ID**: Unique identifier (system-generated, not editable)

### Active vs. Inactive Items

**Active (ON)**:
- Available in dropdown menus when adding/editing properties
- Visible in filters
- Can be assigned to new properties
- Default state for new items

**Inactive (OFF)**:
- Hidden from dropdown menus
- Not available for new property assignments
- Existing properties retain this value (read-only)
- Use for retired or deprecated values

**Important**: Making an item inactive doesn't delete properties using it; it just prevents new assignments.

## Property Types

### What are Property Types?

Property Types categorize the general class of real estate:

**Common Examples**:
- Apartment
- Commercial
- Land
- Multi-Family
- Single-Family Home
- Industrial
- Office Space
- Retail
- Mixed-Use

### Default Property Types

Your system may come with pre-configured property types. Review and customize to match your market.

### Managing Property Types

#### Adding a New Property Type

1. Go to Settings > **Property Types** tab
2. Click **Add Property Type** button
3. Enter the property type name in the modal dialog
4. Click **Add** to save
5. Success notification appears
6. New type is immediately available in property forms

**Naming Guidelines**:
- Use clear, standard real estate terminology
- Be specific but not overly narrow
- Use singular form (e.g., "Apartment" not "Apartments")
- Capitalize properly (e.g., "Multi-Family" not "multi-family")
- Keep names concise (1-3 words ideal)

**Examples**:
- ✓ "Commercial Space"
- ✓ "Luxury Condo"
- ✓ "Development Land"
- ✗ "Really nice apartments in downtown area" (too verbose)
- ✗ "misc" (unclear)

#### Editing a Property Type

1. Locate the property type in the list
2. Click the **Edit** button (pencil icon)
3. Modify the name in the dialog
4. Click **Save** to update
5. All properties using this type reflect the new name immediately

**Use Cases**:
- Correcting typos
- Standardizing terminology
- Updating to better descriptions
- Consolidating similar types

#### Toggling Active Status

1. Find the property type in the list
2. Click **Toggle Active** button
3. Status switches between Active (green) and Inactive (gray)

**Deactivate When**:
- No longer using this property type
- Consolidating categories
- Removing redundant types
- Seasonal types no longer applicable

**Note**: Existing properties keep their type, but you can't assign this type to new properties.

#### Deleting a Property Type

1. Locate the property type
2. Click **Delete** button (trash icon)
3. Confirm deletion

**Warning**: Deletion is permanent. Consider deactivating instead.

**When to Delete**:
- Created in error
- Duplicate entry
- Never used by any property
- Definitively removing from system

**Before Deleting**:
- Check if any properties use this type
- Consider deactivating instead (safer)
- Reassign properties to different types if needed

## Conditions

### What are Conditions?

Conditions describe the physical state or quality of the property:

**Common Examples**:
- Excellent
- Good
- Fair
- Poor
- New Construction
- Renovated
- As-Is
- Needs Work

### Using Conditions

Conditions help:
- Set buyer expectations
- Categorize properties by quality
- Filter listings
- Price properties appropriately

### Managing Conditions

The management process is identical to Property Types:

#### Adding a Condition

1. Go to Settings > **Conditions** tab
2. Click **Add Condition**
3. Enter condition name
4. Click **Add**

**Naming Guidelines**:
- Use standard real estate condition terms
- Be descriptive but concise
- Consider using a consistent scale (e.g., Excellent > Good > Fair > Poor)

**Examples**:
- ✓ "Excellent"
- ✓ "Move-In Ready"
- ✓ "Needs Renovation"
- ✗ "Kind of okay" (unprofessional)
- ✗ "terrible shape" (lowercase, negative)

#### Editing a Condition

1. Click **Edit** button for the condition
2. Update the name
3. Save changes

#### Toggling Active/Inactive

1. Click **Toggle Active** button
2. Deactivated conditions are hidden from property forms

#### Deleting a Condition

1. Click **Delete** button
2. Confirm deletion
3. Only delete if unused or absolutely necessary

## Zonings

### What are Zonings?

Zonings are municipal zoning classifications that define permitted property uses:

**Common Examples**:
- R1, R2, R3, R4 (Residential zones)
- C1, C2 (Commercial zones)
- M1, M2 (Manufacturing/Industrial zones)
- A1 (Agricultural)
- MU (Mixed-Use)

### Importance of Zonings

Zoning affects:
- Permitted property uses
- Development potential
- Property value
- Buyer/investor interest

### Managing Zonings

#### Adding a Zoning

1. Go to Settings > **Zonings** tab
2. Click **Add Zoning**
3. Enter zoning code
4. Click **Add**

**Naming Guidelines**:
- Use official municipal zoning codes
- Match local government terminology exactly
- Use abbreviations (e.g., "R1" not "Residential 1")
- Maintain consistency with official records

**Examples**:
- ✓ "R1"
- ✓ "C2"
- ✓ "M1"
- ✓ "MU"
- ✗ "residential area" (not specific)
- ✗ "some commercial zone" (vague)

**Tip**: Reference your municipality's zoning map or ordinance to ensure accuracy.

#### Editing a Zoning

1. Click **Edit** button
2. Update the code
3. Save changes

**Use Case**: Correcting codes if municipality updates zoning classifications

#### Toggling Active/Inactive

1. Click **Toggle Active**
2. Deactivate obsolete or rarely-used zoning codes

#### Deleting a Zoning

1. Click **Delete** button
2. Confirm deletion

**Before Deleting**: Verify no active properties use this zoning code

## Features

### What are Features?

Features are property amenities, characteristics, or special attributes:

**Common Examples**:
- Renovated
- Parking
- Garden
- Pool
- Basement
- Elevator
- Garage
- Central Air
- Fireplace
- Waterfront
- High Ceilings
- Hardwood Floors

### Using Features

Features help:
- Highlight property selling points
- Differentiate similar properties
- Filter and search listings
- Provide buyer information

### Multi-Select Nature

Unlike other lookup tables:
- A property can have multiple features
- Select all applicable features when creating/editing properties
- Features display in emails in the "Other" column

### Managing Features

#### Adding a Feature

1. Go to Settings > **Features** tab
2. Click **Add Feature**
3. Enter feature name
4. Click **Add**

**Naming Guidelines**:
- Use clear, specific names
- Use active/descriptive terms
- Be concise (1-3 words)
- Capitalize properly
- Avoid vague terms

**Examples**:
- ✓ "Renovated Kitchen"
- ✓ "Parking Garage"
- ✓ "Rooftop Deck"
- ✓ "Pet-Friendly"
- ✗ "nice stuff" (vague)
- ✗ "has some amenities" (unclear)
- ✗ "PARKING" (all caps)

**Feature Categories to Consider**:

**Interior**:
- Renovated, Updated Kitchen, New Appliances, Hardwood Floors, High Ceilings, Fireplace, Walk-In Closets

**Exterior**:
- Garden, Patio, Deck, Balcony, Yard, Pool, Hot Tub

**Parking/Access**:
- Parking Included, Garage, Elevator, Wheelchair Accessible

**Utilities/Systems**:
- Central Air, Gas Heat, Solar Panels, New HVAC

**Special**:
- Waterfront, Corner Lot, Views, Near Transit, Historic Property

#### Editing a Feature

1. Click **Edit** button
2. Update feature name
3. Save changes

**Use Cases**:
- Standardizing terminology (e.g., "Parking" → "Parking Included")
- Fixing typos
- Making descriptions clearer

#### Toggling Active/Inactive

1. Click **Toggle Active**
2. Inactive features are hidden from property forms

**Deactivate When**:
- Feature no longer relevant to your market
- Consolidating similar features
- Too specific or rarely used

#### Deleting a Feature

1. Click **Delete** button
2. Confirm deletion

**Impact**: Properties with this feature will no longer show it. Consider deactivating instead.

## General Lookup Table Best Practices

### Initial Setup

When first setting up your system:

1. **Review Defaults**: Check all pre-configured lookup values
2. **Add Market-Specific Items**: Add values unique to your region or market
3. **Remove Irrelevant Items**: Deactivate or delete values you won't use
4. **Standardize**: Ensure consistent naming and capitalization
5. **Test**: Create a test property using all values to verify

### Ongoing Maintenance

**Regular Reviews**:
- **Monthly**: Check for new values needed based on recent properties
- **Quarterly**: Review for unused or redundant values
- **Annually**: Full audit of all lookup tables

**Before Adding**:
- Check if similar value already exists
- Consider if it will be used frequently
- Ensure it's not too specific or too vague
- Verify naming follows your standards

**Before Deleting**:
- Confirm no properties currently use this value
- Consider deactivating instead
- Consult with team members
- Document reason for deletion

### Consistency Guidelines

**Capitalization**:
- Use Title Case for multi-word items: "Property Type"
- Use proper capitalization for acronyms: "HVAC" not "Hvac"
- Be consistent: Don't mix "new construction" and "New Construction"

**Terminology**:
- Use industry-standard terms
- Match MLS listings terminology (if applicable)
- Use terms your target audience understands
- Avoid internal jargon

**Specificity**:
- Not too broad: "Property" is too vague
- Not too narrow: "2-bedroom apartments in downtown Brooklyn" is too specific
- Just right: "Apartment" allows flexibility while being clear

### Team Coordination

If multiple team members manage lookup tables:

1. **Establish Guidelines**: Document naming conventions and standards
2. **Assign Responsibility**: Designate one person as "owner" for each table
3. **Communicate Changes**: Notify team when adding/removing values
4. **Review Together**: Periodically review as a team
5. **Document**: Keep notes on why certain values exist or were removed

## Impact of Lookup Table Changes

### Immediate Effects

When you modify lookup tables:

**Adding Items**:
- ✓ Immediately available in property forms
- ✓ Can be assigned to new properties right away
- ✓ Appears in filters instantly

**Editing Items**:
- ✓ Existing properties update to show new name
- ✓ Emails immediately reflect new terminology
- ✓ No data migration needed

**Deactivating Items**:
- ✓ Hidden from property form dropdowns
- ✓ Existing properties retain the value (displayed normally)
- ✓ Cannot assign to new properties
- ✓ Still appears in filters (for existing properties)

**Deleting Items**:
- ⚠ Properties using this value may show empty/null
- ⚠ Historical data affected
- ⚠ Cannot be undone
- ⚠ May cause display issues in reports

### Properties and Campaigns

**Email Campaigns**:
- Changes immediately affect next email
- Property types group emails (adding types adds groups)
- Features display in "Other" column
- Conditions and zonings display in respective columns

**Property Forms**:
- Dropdowns update instantly
- Active items appear in selection
- Inactive items don't appear (but existing assignments remain)

**Filters**:
- Filter dropdowns update to include new values
- Can filter by any value (even inactive) if properties use it

## Common Scenarios

### Consolidating Similar Values

**Situation**: You have both "Apt" and "Apartment" as property types

**Solution**:
1. Decide on standard term (e.g., "Apartment")
2. Edit all properties with "Apt" to use "Apartment"
3. Once all properties reassigned, delete "Apt"

### Adding Region-Specific Values

**Situation**: Expanding to new market with different zoning codes

**Solution**:
1. Research new region's zoning classifications
2. Add new zoning codes to Zonings table
3. Optionally, add region-specific property types or features
4. Train team on new values

### Seasonal Features

**Situation**: Some features only relevant certain times of year

**Solution**:
1. Keep features active year-round if properties have them permanently
2. For truly seasonal items, consider generic alternatives:
   - Instead of "Christmas Lights", use "Decorated" or "Holiday-Ready"
   - Instead of "Summer Rental", use "Seasonal Rental"
3. If truly seasonal, deactivate in off-season

### Retiring Obsolete Classifications

**Situation**: Municipality updated zoning ordinances, old codes no longer valid

**Solution**:
1. Add new zoning codes to system
2. Update all properties from old codes to new codes
3. Verify no properties use old codes
4. Delete old codes
5. Document change for records

## Troubleshooting

### Value Not Appearing in Property Form

**Check Active Status**:
1. Navigate to the relevant lookup table
2. Find the value
3. Verify status badge is green (Active)
4. If gray (Inactive), toggle to activate

### Cannot Delete Lookup Value

**Possible Causes**:
- Properties currently using this value
- System default value (cannot be deleted)
- Permissions issue

**Solution**:
1. Check all properties for this value
2. Reassign properties to different values
3. Try deleting again
4. If still fails, deactivate instead

### Duplicate Values

**Situation**: Accidentally created "Parking" and "parking"

**Solution**:
1. Decide which to keep (usually title-cased version)
2. Update all properties using the wrong one
3. Delete the duplicate
4. Establish naming convention to prevent future duplicates

### Wrong Value Assigned to Properties

**Situation**: Many properties have wrong property type

**Solution**:
1. Use filters on Listings page to find affected properties
2. Edit each property individually to correct value
3. Or contact administrator for bulk update tool
4. Verify change in next email campaign

## Advanced Tips

### Strategic Feature Organization

Group related features conceptually:

**Interior**: Renovated, Updated Kitchen, Hardwood Floors, High Ceilings
**Exterior**: Garden, Patio, Pool, Deck
**Amenities**: Parking, Elevator, Central Air, Storage
**Location**: Waterfront, Corner Lot, Near Transit, Views

While the system doesn't support feature categories, using consistent prefixes can help:
- "Interior - Renovated Kitchen"
- "Exterior - Rooftop Deck"
- "Amenity - Parking Garage"

### Property Type Strategy

**Broad vs. Narrow**:
- Too broad: "Residential" (not helpful for grouping)
- Too narrow: "3-Bedroom Walk-Up Apartment" (too specific)
- Just right: "Apartment", "Multi-Family", "Single-Family Home"

Use features to specify details:
- Property Type: "Apartment"
- Features: "3 Bedrooms", "Walk-Up", "Renovated"

### Zoning Best Practices

**Multiple Municipalities**:
If working across multiple cities/towns:
- Add municipality to code: "NYC-R1", "Jersey-R1"
- Or keep separate and document in property location field
- Consider which approach works for your team

**Mixed Zonings**:
For properties with multiple zoning classifications:
- Choose primary zoning for the dropdown
- Document others in property notes/description

## Next Steps

- Apply lookup values when [Managing Listings](./managing-listings.md)
- See lookup values in action in [Email Campaign Management](./email-campaigns.md)
- Organize properties by type in [Dashboard & Cycle Manager](./dashboard-cycle-manager.md)
