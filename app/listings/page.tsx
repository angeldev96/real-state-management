"use client";

import { useState, useMemo } from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { ListingsTable } from "@/components/listings/listings-table";
import { ListingFiltersBar } from "@/components/listings/listing-filters";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingForm } from "@/components/listings/listing-form";
import { getAllListingsWithRelations } from "@/lib/mock-data";
import { ListingWithRelations, ListingFilters, ListingFormData } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ViewMode = "table" | "grid";

export default function ListingsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [formOpen, setFormOpen] = useState(false);
  const [editingListing, setEditingListing] =
    useState<ListingWithRelations | null>(null);
  const [filters, setFilters] = useState<ListingFilters>({
    search: "",
    cycleGroup: null,
    propertyTypeId: null,
    conditionId: null,
    zoningId: null,
    isActive: null,
  });

  const allListings = useMemo(() => getAllListingsWithRelations(), []);

  // Apply filters
  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      // Search filter
      if (
        filters.search &&
        !listing.address.toLowerCase().includes(filters.search.toLowerCase()) &&
        !listing.locationDescription
          ?.toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Cycle filter
      if (
        filters.cycleGroup !== null &&
        listing.cycleGroup !== filters.cycleGroup
      ) {
        return false;
      }

      // Property type filter
      if (
        filters.propertyTypeId !== null &&
        listing.propertyTypeId !== filters.propertyTypeId
      ) {
        return false;
      }

      // Condition filter
      if (
        filters.conditionId !== null &&
        listing.conditionId !== filters.conditionId
      ) {
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
  }, [allListings, filters]);

  const handleEdit = (listing: ListingWithRelations) => {
    setEditingListing(listing);
    setFormOpen(true);
  };

  const handleDelete = (listing: ListingWithRelations) => {
    // In real app, this would call an API with confirmation
    toast.success(`Deleted ${listing.address}`);
  };

  const handleToggleActive = (listing: ListingWithRelations) => {
    // In real app, this would call an API
    toast.success(
      listing.isActive
        ? `Archived ${listing.address}`
        : `Activated ${listing.address}`
    );
  };

  const handleFormSubmit = (data: ListingFormData) => {
    console.log("Form submitted:", data);
    toast.success(
      editingListing
        ? `Updated ${data.address}`
        : `Created listing for ${data.address}`
    );
    setEditingListing(null);
  };

  const handleNewListing = () => {
    setEditingListing(null);
    setFormOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="All Listings"
        description={`${filteredListings.length} properties in the system`}
        action={
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center border border-border rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-3",
                  viewMode === "table" && "bg-muted"
                )}
                onClick={() => setViewMode("table")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-3",
                  viewMode === "grid" && "bg-muted"
                )}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>

            <Button onClick={handleNewListing} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Listing
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <ListingFiltersBar filters={filters} onChange={setFilters} />

      {/* Content */}
      {viewMode === "table" ? (
        <ListingsTable
          listings={filteredListings}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onEdit={handleEdit}
            />
          ))}
          {filteredListings.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No listings match your filters
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    search: "",
                    cycleGroup: null,
                    propertyTypeId: null,
                    conditionId: null,
                    zoningId: null,
                    isActive: null,
                  })
                }
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Listing Form Dialog */}
      <ListingForm
        open={formOpen}
        onOpenChange={setFormOpen}
        listing={editingListing}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
