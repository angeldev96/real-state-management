// =============================================================================
// LOOKUP TYPES (Catalog Tables)
// =============================================================================

export interface PropertyType {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Condition {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Zoning {
  id: number;
  code: string;
  isActive: boolean;
}

export interface Feature {
  id: number;
  name: string;
  isActive: boolean;
}

// =============================================================================
// CORE BUSINESS TYPES
// =============================================================================

export interface CycleSchedule {
  weekNumber: 1 | 2 | 3;
  dayOfMonth: number;
  description: string;
}

export interface Listing {
  id: number;
  address: string;
  locationDescription: string | null;
  dimensions: string | null;
  rooms: number | null;
  squareFootage: number | null;
  price: number | null;
  onMarket: boolean; // TRUE = Nueva propiedad (badge "NEW"), FALSE = No nueva pero aún en venta
  isActive: boolean; // TRUE = Active, FALSE = Archived
  cycleGroup: 1 | 2 | 3;
  propertyTypeId: number | null;
  conditionId: number | null;
  zoningId: number | null;
  featureIds: number[];
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// ENRICHED TYPES (with resolved relationships)
// =============================================================================

export interface ListingWithRelations extends Listing {
  propertyType: PropertyType | null;
  condition: Condition | null;
  zoning: Zoning | null;
  features: Feature[];
}

// =============================================================================
// FORM TYPES
// =============================================================================

export interface ListingFormData {
  address: string;
  locationDescription: string;
  dimensions: string;
  rooms: string;
  squareFootage: string;
  price: string;
  onMarket: boolean; // TRUE = Nueva propiedad (badge "NEW")
  isActive: boolean; // TRUE = Active, FALSE = Archived
  cycleGroup: 1 | 2 | 3;
  propertyTypeId: string;
  conditionId: string;
  zoningId: string;
  featureIds: number[];
}

// =============================================================================
// FILTER TYPES
// =============================================================================

export interface ListingFilters {
  search: string;
  cycleGroup: number | null;
  propertyTypeId: number | null;
  conditionId: number | null;
  zoningId: number | null;
  isActive: boolean | null;
}

// =============================================================================
// STATS TYPES
// =============================================================================

export interface CycleStats {
  weekNumber: number;
  dayOfMonth: number;
  description: string | null;
  totalListings: number;
  activeListings: number;
  nextSendDate: Date;
}
