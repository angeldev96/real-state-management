import {
  PropertyType,
  Condition,
  Zoning,
  Feature,
  CycleSchedule,
  Listing,
  ListingWithRelations,
} from "./types";

// =============================================================================
// LOOKUP DATA (from dropdown.txt)
// =============================================================================

export const propertyTypes: PropertyType[] = [
  { id: 1, name: "1 Family" },
  { id: 2, name: "2 Family" },
  { id: 3, name: "3 Family" },
  { id: 4, name: "4+ Family" },
  { id: 5, name: "Condo" },
  { id: 6, name: "Co-op" },
  { id: 7, name: "Lot" },
];

export const conditions: Condition[] = [
  { id: 1, name: "Needs Work / Renovation" },
  { id: 2, name: "Good / Nice Condition" },
  { id: 3, name: "Great / Excellent Condition" },
  { id: 4, name: "Move-In Condition" },
  { id: 5, name: "Beautiful" },
  { id: 6, name: "Luxury / State of the Art" },
  { id: 7, name: "New / Pre-Construction / Renovated" },
  { id: 8, name: "Tenant / Income Status" },
  { id: 9, name: "Shul / Special Use" },
];

export const zonings: Zoning[] = [
  { id: 1, code: "R5" },
  { id: 2, code: "R6" },
];

export const features: Feature[] = [
  { id: 1, name: "S.Detached" },
  { id: 2, name: "Detached" },
  { id: 3, name: "Parking" },
  { id: 4, name: "Garage" },
  { id: 5, name: "Brick" },
  { id: 6, name: "Income" },
  { id: 7, name: "Duplex" },
  { id: 8, name: "Big Porch" },
  { id: 9, name: "Delivered Vacant" },
  { id: 10, name: "Exclusive Roof" },
  { id: 11, name: "Air Rights" },
  { id: 12, name: "Lot of Potential" },
  { id: 13, name: "Multifamily" },
  { id: 14, name: "1st & Basement" },
  { id: 15, name: "1st Floor" },
  { id: 16, name: "3-flr + Basement" },
  { id: 17, name: "2nd Floor" },
  { id: 18, name: "3rd Floor" },
  { id: 19, name: "4th Floor" },
  { id: 20, name: "Hi Floor" },
  { id: 21, name: "Elevator" },
  { id: 22, name: "Backyard" },
];

// =============================================================================
// CYCLE SCHEDULE (from database.sql defaults)
// =============================================================================

export const cycleSchedules: CycleSchedule[] = [
  { weekNumber: 1, dayOfMonth: 1, description: "Start of the month" },
  { weekNumber: 2, dayOfMonth: 15, description: "Middle of the month" },
  { weekNumber: 3, dayOfMonth: 25, description: "End of the month" },
];

// =============================================================================
// LISTINGS DATA (from legacy.csv - cleaned up)
// =============================================================================

export const listings: Listing[] = [
  {
    id: 102,
    address: "1634 59th St",
    locationDescription: "59/16",
    dimensions: "16x63 on 24x100",
    rooms: 5,
    squareFootage: 2600,
    price: 2700000,
    onMarket: true, // New-True
    isActive: true,
    cycleGroup: 1,
    propertyTypeId: 1,
    conditionId: 2,
    zoningId: 2,
    featureIds: [4, 5, 22],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: 103,
    address: "1838 63rd St",
    locationDescription: "Low 60's/18",
    dimensions: "22x35 on 30x",
    rooms: 5,
    squareFootage: 2100,
    price: 1850000,
    onMarket: false, // old-false
    isActive: false,
    cycleGroup: 1,
    propertyTypeId: 1,
    conditionId: 1,
    zoningId: 1,
    featureIds: [5, 12],
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
  {
    id: 104,
    address: "2016 63rd St",
    locationDescription: "Low 60's/20",
    dimensions: "16x47 on 24x92",
    rooms: 5,
    squareFootage: 2256,
    price: 1650000,
    onMarket: false, // old-false
    isActive: false,
    cycleGroup: 1,
    propertyTypeId: 1,
    conditionId: 1,
    zoningId: 1,
    featureIds: [5],
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: 105,
    address: "1933 59th St",
    locationDescription: "Hi 50's/19",
    dimensions: "20x70 on 20x100",
    rooms: 5,
    squareFootage: 3800,
    price: 4600000,
    onMarket: false, // old-false
    isActive: true,
    cycleGroup: 1,
    propertyTypeId: 1,
    conditionId: 6,
    zoningId: 2,
    featureIds: [2, 4, 5, 22],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: 106,
    address: "1258 38th St",
    locationDescription: "Hi 30's/12",
    dimensions: "18x60 on 25x100",
    rooms: 6,
    squareFootage: 3200,
    price: 2300000,
    onMarket: true, // New-True
    isActive: true,
    cycleGroup: 1,
    propertyTypeId: 2,
    conditionId: 2,
    zoningId: 2,
    featureIds: [5, 6, 13],
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: 107,
    address: "1674 42nd St",
    locationDescription: "Low 40's/17",
    dimensions: "17x55 on 20x100",
    rooms: 4,
    squareFootage: 2200,
    price: 2300000,
    onMarket: true, // New-True
    isActive: true,
    cycleGroup: 2,
    propertyTypeId: 1,
    conditionId: 4,
    zoningId: 1,
    featureIds: [3, 5],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 108,
    address: "1074 53rd St",
    locationDescription: "Mid 50's/11",
    dimensions: "20x55 on 20x100",
    rooms: 4,
    squareFootage: 2800,
    price: 2500000,
    onMarket: true, // New-True
    isActive: false,
    cycleGroup: 2,
    propertyTypeId: 1,
    conditionId: 2,
    zoningId: 1,
    featureIds: [5, 22],
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: 109,
    address: "5408 18th Ave",
    locationDescription: "Mid 50's/18",
    dimensions: "17x30 on 17x98",
    rooms: 3,
    squareFootage: 1500,
    price: 1700000,
    onMarket: true, // New-True
    isActive: true,
    cycleGroup: 2,
    propertyTypeId: 5,
    conditionId: 4,
    zoningId: null,
    featureIds: [21],
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: 110,
    address: "123 Ave J",
    locationDescription: "Ave J",
    dimensions: "18x55 on 18x100",
    rooms: null,
    squareFootage: 2500,
    price: 1750000,
    onMarket: false, // old-false
    isActive: false,
    cycleGroup: 2,
    propertyTypeId: 3,
    conditionId: 8,
    zoningId: 2,
    featureIds: [6, 13],
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
  },
  {
    id: 111,
    address: "1337 42nd St",
    locationDescription: "Low 40's/14",
    dimensions: "20x50 on 20x100",
    rooms: null, // Was "shul" in CSV
    squareFootage: 2800,
    price: 2200000,
    onMarket: true, // New-True
    isActive: true,
    cycleGroup: 2,
    propertyTypeId: null,
    conditionId: 9,
    zoningId: 1,
    featureIds: [9],
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: 112,
    address: "1114 57th St",
    locationDescription: "Mid 50's/11",
    dimensions: "16x50 on 20x100",
    rooms: 5,
    squareFootage: 2400,
    price: 2500000,
    onMarket: false, // empty in CSV
    isActive: false,
    cycleGroup: 2,
    propertyTypeId: 1,
    conditionId: 2,
    zoningId: 1,
    featureIds: [5],
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
  },
  {
    id: 113,
    address: "2143 59th St",
    locationDescription: "Hi 50's/21",
    dimensions: "22x70 on 34x100",
    rooms: 6,
    squareFootage: 5280,
    price: 4900000,
    onMarket: false, // empty in CSV
    isActive: true,
    cycleGroup: 2,
    propertyTypeId: 2,
    conditionId: 6,
    zoningId: 2,
    featureIds: [2, 4, 5, 22],
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: 114,
    address: "789 E 5th St",
    locationDescription: "East 5th",
    dimensions: "20x40 on 28x100",
    rooms: null,
    squareFootage: null,
    price: 2500000,
    onMarket: false, // empty in CSV
    isActive: false,
    cycleGroup: 3,
    propertyTypeId: 7,
    conditionId: null,
    zoningId: 2,
    featureIds: [11, 12],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: 115,
    address: "787 E 5th St",
    locationDescription: "East 5th",
    dimensions: "20x55 on 27x100",
    rooms: null,
    squareFootage: null,
    price: 2800000,
    onMarket: false, // empty in CSV
    isActive: false,
    cycleGroup: 3,
    propertyTypeId: 7,
    conditionId: null,
    zoningId: 2,
    featureIds: [11, 12],
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: 116,
    address: "1630 55th St",
    locationDescription: "Mid 50's/16",
    dimensions: "20x50 on 20x100",
    rooms: null,
    squareFootage: null,
    price: 2300000,
    onMarket: false, // empty in CSV
    isActive: true,
    cycleGroup: 3,
    propertyTypeId: 1,
    conditionId: 1,
    zoningId: 1,
    featureIds: [5, 12],
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: 117,
    address: "118 Webster Ave",
    locationDescription: "Webster",
    dimensions: "18x44 on 18x110",
    rooms: 3,
    squareFootage: 2376,
    price: 2000000,
    onMarket: false, // empty in CSV
    isActive: false,
    cycleGroup: 3,
    propertyTypeId: 1,
    conditionId: 2,
    zoningId: 1,
    featureIds: [5, 22],
    createdAt: new Date("2024-01-21"),
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: 118,
    address: "1734 47th St",
    locationDescription: "Hi 40's/17",
    dimensions: "23x60 on 30x100",
    rooms: 6,
    squareFootage: 4000,
    price: 3900000,
    onMarket: false, // empty in CSV
    isActive: true,
    cycleGroup: 3,
    propertyTypeId: 2,
    conditionId: 3,
    zoningId: 2,
    featureIds: [2, 4, 5, 22],
    createdAt: new Date("2024-01-23"),
    updatedAt: new Date("2024-01-23"),
  },
  {
    id: 119,
    address: "1852 60th St",
    locationDescription: "60's/18",
    dimensions: "18x62 on 18x100",
    rooms: 4,
    squareFootage: 2500,
    price: 2100000,
    onMarket: false, // empty in CSV
    isActive: false,
    cycleGroup: 3,
    propertyTypeId: 1,
    conditionId: 2,
    zoningId: 1,
    featureIds: [5],
    createdAt: new Date("2024-01-24"),
    updatedAt: new Date("2024-01-24"),
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getPropertyTypeById(id: number | null): PropertyType | null {
  if (!id) return null;
  return propertyTypes.find((pt) => pt.id === id) || null;
}

export function getConditionById(id: number | null): Condition | null {
  if (!id) return null;
  return conditions.find((c) => c.id === id) || null;
}

export function getZoningById(id: number | null): Zoning | null {
  if (!id) return null;
  return zonings.find((z) => z.id === id) || null;
}

export function getFeaturesByIds(ids: number[]): Feature[] {
  return features.filter((f) => ids.includes(f.id));
}

export function getListingWithRelations(
  listing: Listing
): ListingWithRelations {
  return {
    ...listing,
    propertyType: getPropertyTypeById(listing.propertyTypeId),
    condition: getConditionById(listing.conditionId),
    zoning: getZoningById(listing.zoningId),
    features: getFeaturesByIds(listing.featureIds),
  };
}

export function getAllListingsWithRelations(): ListingWithRelations[] {
  return listings.map(getListingWithRelations);
}

export function getListingsByCycle(
  cycleGroup: 1 | 2 | 3
): ListingWithRelations[] {
  return listings
    .filter((l) => l.cycleGroup === cycleGroup)
    .map(getListingWithRelations);
}

export function getNextSendDate(weekNumber: 1 | 2 | 3): Date {
  const schedule = cycleSchedules.find((s) => s.weekNumber === weekNumber);
  if (!schedule) return new Date();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  let sendDate = new Date(year, month, schedule.dayOfMonth);

  // If the date has passed this month, get next month's date
  if (sendDate < now) {
    sendDate = new Date(year, month + 1, schedule.dayOfMonth);
  }

  return sendDate;
}

export function formatPrice(price: number | null): string {
  if (price === null) return "Price TBD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatSquareFootage(sqft: number | null): string {
  if (sqft === null) return "—";
  return `${sqft.toLocaleString()} sq ft`;
}
