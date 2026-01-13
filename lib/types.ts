// =============================================================================
// LOOKUP TYPES (Catalog Tables)
// =============================================================================

export interface PropertyType {
  id: number;
  name: string;
}

export interface Condition {
  id: number;
  name: string;
}

export interface Zoning {
  id: number;
  code: string;
}

export interface Feature {
  id: number;
  name: string;
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
  isActive: boolean;
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
  isActive: boolean;
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
  weekNumber: 1 | 2 | 3;
  totalListings: number;
  activeListings: number;
  nextSendDate: Date;
}
