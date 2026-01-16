import { ListingWithRelations, ListingFilters } from "./types";

export function filterListings(
  listings: ListingWithRelations[],
  filters: ListingFilters
): ListingWithRelations[] {
  return listings.filter((listing) => {
    // Search filter
    if (
      filters.search &&
      !listing.address.toLowerCase().includes(filters.search.toLowerCase()) &&
      !listing.locationDescription?.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Cycle filter
    if (filters.cycleGroup !== null && listing.cycleGroup !== filters.cycleGroup) {
      return false;
    }

    // Property type filter
    if (filters.propertyTypeId !== null && listing.propertyTypeId !== filters.propertyTypeId) {
      return false;
    }

    // Condition filter
    if (filters.conditionId !== null && listing.conditionId !== filters.conditionId) {
      return false;
    }

    // Zoning filter
    if (filters.zoningId !== null && listing.zoningId !== filters.zoningId) {
      return false;
    }

    // Active status filter
    if (filters.isActive !== null && listing.isActive !== filters.isActive) {
      return false;
    }

    return true;
  });
}
