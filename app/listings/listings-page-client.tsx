"use client";

import { useState, useMemo } from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { ListingsTable } from "@/components/listings/listings-table";

import { ListingCard } from "@/components/listings/listing-card";
import { ListingForm } from "@/components/listings/listing-form";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ListingWithRelations, ListingFilters, ListingFormData, PropertyType, Condition, Zoning, Feature } from "@/lib/types";
import { createListing, updateListing } from "@/lib/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { filterListings } from "@/lib/listings";

type ViewMode = "table" | "grid";

interface ListingsPageClientProps {
  allListings: ListingWithRelations[];
  propertyTypes: PropertyType[];
  conditions: Condition[];
  zonings: Zoning[];
  features: Feature[];
}

export function ListingsPageClient({ 
  allListings,
  propertyTypes,
  conditions,
  zonings,
  features,
}: ListingsPageClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [formOpen, setFormOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<ListingWithRelations | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ListingFilters>({
    search: "",
    cycleGroup: null,
    propertyTypeId: null,
    conditionId: null,
    zoningId: null,
    isActive: null,
  });
  const itemsPerPage = 20;

  // Apply filters
  const filteredListings = useMemo(() => {
    return filterListings(allListings, filters);
  }, [allListings, filters]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredListings.slice(startIndex, endIndex);
  }, [filteredListings, currentPage, itemsPerPage]);

  // Calculate current range for display
  const startItem = filteredListings.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, filteredListings.length);

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
    toast.success(listing.isActive ? `Archived ${listing.address}` : `Activated ${listing.address}`);
  };

  const handleFormSubmit = async (data: ListingFormData) => {
    const result = editingListing
      ? await updateListing(editingListing.id, data)
      : await createListing(data);

    if (result.success) {
      toast.success(result.message);
      setEditingListing(null);
      setFormOpen(false);
      // Refresh the page to show updated data
      window.location.reload();
    } else {
      toast.error(result.message);
    }
  };

  const handleNewListing = () => {
    setEditingListing(null);
    setFormOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="All Listings"
        description={`${startItem}-${endItem} of ${filteredListings.length} properties`}
        action={
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center border border-border rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-8 px-3", viewMode === "table" && "bg-muted")}
                onClick={() => setViewMode("table")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-8 px-3", viewMode === "grid" && "bg-muted")}
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


      {/* Content */}
      {viewMode === "table" ? (
        <ListingsTable
          listings={paginatedListings}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          filters={filters}
          onFilterChange={setFilters}
          propertyTypes={propertyTypes}
          conditions={conditions}
          zonings={zonings}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
          {paginatedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onEdit={handleEdit} />
          ))}
          {paginatedListings.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground mb-4">No listings match your filters</p>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {/* Show ellipsis if there are more pages */}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Listing Form Dialog */}
      <ListingForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        listing={editingListing} 
        onSubmit={handleFormSubmit}
        propertyTypes={propertyTypes}
        conditions={conditions}
        zonings={zonings}
        features={features}
      />
    </div>
  );
}
