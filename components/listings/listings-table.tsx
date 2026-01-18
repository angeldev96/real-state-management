"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  Edit2,
  Trash2,
  MoreHorizontal,
  Eye,
  EyeOff,
  Settings2,
  Columns,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListingWithRelations, ListingFilters, PropertyType, Condition, Zoning } from "@/lib/types";
import { formatPrice, formatSquareFootage } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface ListingsTableProps {
  listings: ListingWithRelations[];
  onEdit?: (listing: ListingWithRelations) => void;
  onDelete?: (listing: ListingWithRelations) => void;
  onToggleActive?: (listing: ListingWithRelations) => void;
  // Filters props
  filters: ListingFilters;
  onFilterChange: (filters: ListingFilters) => void;
  propertyTypes: PropertyType[];
  conditions: Condition[];
  zonings: Zoning[];
}

type SortField = "id" | "address" | "price" | "cycleGroup" | "rooms" | "squareFootage" | "dimensions";
type SortDirection = "asc" | "desc";

export function ListingsTable({
  listings,
  onEdit,
  onDelete,
  onToggleActive,
  filters,
  onFilterChange,
  propertyTypes,
  conditions,
  zonings,
}: ListingsTableProps) {
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  
  // Default visible columns to match email design
  // Order: #, Location, Dimensions, Rooms, Sq. Ft., Condition, Other, Notes, Price
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(["id", "location", "dimensions", "rooms", "size", "condition", "other", "notes", "price"])
  );

  const toggleColumn = (column: string) => {
    const newColumns = new Set(visibleColumns);
    if (newColumns.has(column)) {
      newColumns.delete(column);
    } else {
      newColumns.add(column);
    }
    setVisibleColumns(newColumns);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedListings = [...listings].sort((a, b) => {
    let aValue: number | string | null = null;
    let bValue: number | string | null = null;

    switch (sortField) {
      case "id":
        aValue = a.id;
        bValue = b.id;
        break;
      case "address":
        aValue = a.address.toLowerCase();
        bValue = b.address.toLowerCase();
        break;
      case "price":
        aValue = a.price ?? 0;
        bValue = b.price ?? 0;
        break;
      case "cycleGroup":
        aValue = a.cycleGroup;
        bValue = b.cycleGroup;
        break;
      case "rooms":
        aValue = a.rooms ?? 0;
        bValue = b.rooms ?? 0;
        break;
      case "squareFootage":
        aValue = a.squareFootage ?? 0;
        bValue = b.squareFootage ?? 0;
        break;
      case "dimensions":
        aValue = a.dimensions || "";
        bValue = b.dimensions || "";
        break;
    }

    if (aValue === null || bValue === null) return 0;
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent font-bold text-foreground"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-3 w-3" />
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {sortedListings.length} properties
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Columns className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={visibleColumns.has("id")}
              onCheckedChange={() => toggleColumn("id")}
            >
              # (ID)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.has("location")}
              onCheckedChange={() => toggleColumn("location")}
            >
              Location
            </DropdownMenuCheckboxItem>
             <DropdownMenuCheckboxItem
              checked={visibleColumns.has("dimensions")}
              onCheckedChange={() => toggleColumn("dimensions")}
            >
              Dimensions
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.has("rooms")}
              onCheckedChange={() => toggleColumn("rooms")}
            >
              Rooms
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.has("size")}
              onCheckedChange={() => toggleColumn("size")}
            >
              Sq. Ft.
            </DropdownMenuCheckboxItem>
             <DropdownMenuCheckboxItem
              checked={visibleColumns.has("condition")}
              onCheckedChange={() => toggleColumn("condition")}
            >
              Condition
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.has("other")}
              onCheckedChange={() => toggleColumn("other")}
            >
              Other (Features)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.has("notes")}
              onCheckedChange={() => toggleColumn("notes")}
            >
              Notes (Zoning)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.has("price")}
              onCheckedChange={() => toggleColumn("price")}
            >
              Price
            </DropdownMenuCheckboxItem>
             <DropdownMenuCheckboxItem
              checked={visibleColumns.has("type")}
              onCheckedChange={() => toggleColumn("type")}
            >
              Property Type
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.has("cycle")}
              onCheckedChange={() => toggleColumn("cycle")}
            >
              Cycle Week
            </DropdownMenuCheckboxItem>
             <DropdownMenuCheckboxItem
              checked={visibleColumns.has("status")}
              onCheckedChange={() => toggleColumn("status")}
            >
              Status
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b-0">
              {/* # (ID) */}
              {visibleColumns.has("id") && (
                <TableHead className="w-[80px]">
                   <SortButton field="id">#</SortButton>
                </TableHead>
              )}
              
              {/* Location */}
              {visibleColumns.has("location") && (
                <TableHead className="w-[200px]">
                   <SortButton field="address">Location</SortButton>
                </TableHead>
              )}
              
              {/* Dimensions */}
              {visibleColumns.has("dimensions") && (
                <TableHead className="text-center">
                   <SortButton field="dimensions">Dimensions</SortButton>
                </TableHead>
              )}

              {/* Rooms */}
              {visibleColumns.has("rooms") && (
                <TableHead className="text-center">
                  <SortButton field="rooms">Rooms</SortButton>
                </TableHead>
              )}

              {/* Sq. Ft. */}
              {visibleColumns.has("size") && (
                <TableHead className="text-center">
                  <SortButton field="squareFootage">Sq. Ft.</SortButton>
                </TableHead>
              )}

              {/* Condition */}
              {visibleColumns.has("condition") && (
                <TableHead className="text-center font-bold">Condition</TableHead>
              )}

              {/* Other (Features) */}
              {visibleColumns.has("other") && (
                <TableHead className="text-center font-bold">Other</TableHead>
              )}

              {/* Notes (Zoning) */}
              {visibleColumns.has("notes") && (
                <TableHead className="text-center font-bold">Notes</TableHead>
              )}

              {/* Price */}
              {visibleColumns.has("price") && (
                <TableHead className="text-right">
                  <SortButton field="price">Price</SortButton>
                </TableHead>
              )}
              
              {/* Extra Columns (Default Hidden but toggleable) */}
              {visibleColumns.has("type") && <TableHead className="font-bold">Type</TableHead>}
              {visibleColumns.has("cycle") && (
                <TableHead className="font-bold">
                  <SortButton field="cycleGroup">Cycle</SortButton>
                </TableHead>
              )}
              {visibleColumns.has("status") && <TableHead className="font-bold">Status</TableHead>}
              
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
            
            {/* Filters Row */}
            <TableRow className="bg-muted/30 border-t-0 -mt-2">
               {visibleColumns.has("id") && <TableCell className="py-2"></TableCell>}
               {visibleColumns.has("location") && (
                <TableCell className="py-2">
                   <Input
                    placeholder="Filter..."
                    value={filters.search}
                    onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                    className="h-8 text-xs bg-background w-full"
                  />
                </TableCell>
               )}
               {visibleColumns.has("dimensions") && <TableCell className="py-2"></TableCell>}
               {visibleColumns.has("rooms") && <TableCell className="py-2"></TableCell>}
               {visibleColumns.has("size") && <TableCell className="py-2"></TableCell>}
               {visibleColumns.has("condition") && (
                 <TableCell className="py-2">
                   <Select
                    value={filters.conditionId?.toString() || "all"}
                    onValueChange={(value) =>
                      onFilterChange({
                        ...filters,
                        conditionId: value === "all" ? null : parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs bg-background w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {conditions.map((condition) => (
                        <SelectItem key={condition.id} value={condition.id.toString()}>
                          {condition.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                 </TableCell>
               )}
               {visibleColumns.has("other") && <TableCell className="py-2"></TableCell>}
               {visibleColumns.has("notes") && (
                 <TableCell className="py-2">
                    <Select
                    value={filters.zoningId?.toString() || "all"}
                    onValueChange={(value) =>
                      onFilterChange({
                        ...filters,
                        zoningId: value === "all" ? null : parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs bg-background w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {zonings.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id.toString()}>
                          {zone.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                 </TableCell>
               )}
               {visibleColumns.has("price") && <TableCell className="py-2"></TableCell>}

               {/* Extra Filters */}
               {visibleColumns.has("type") && (
                <TableCell className="py-2">
                   <Select
                    value={filters.propertyTypeId?.toString() || "all"}
                    onValueChange={(value) =>
                      onFilterChange({
                        ...filters,
                        propertyTypeId: value === "all" ? null : parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
               )}
               {visibleColumns.has("cycle") && (
                <TableCell className="py-2">
                   <Select
                    value={filters.cycleGroup?.toString() || "all"}
                    onValueChange={(value) =>
                      onFilterChange({
                        ...filters,
                        cycleGroup: value === "all" ? null : parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
               )}
               {visibleColumns.has("status") && (
                 <TableCell className="py-2">
                    <Select
                    value={
                      filters.isActive === null
                        ? "all"
                        : filters.isActive
                        ? "active"
                        : "archived"
                    }
                    onValueChange={(value) =>
                      onFilterChange({
                        ...filters,
                        isActive: value === "all" ? null : value === "active" ? true : false,
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                 </TableCell>
               )}

               <TableCell className="py-2"></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedListings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.size + 1}
                  className="h-24 text-center"
                >
                  <p className="text-muted-foreground">No listings found</p>
                </TableCell>
              </TableRow>
            ) : (
              sortedListings.map((listing, index) => (
                <TableRow
                  key={listing.id}
                  className={cn("group transition-colors", !listing.isActive && "bg-muted/20")}
                >
                  {/* # (ID) */}
                  {visibleColumns.has("id") && (
                    <TableCell className="font-medium text-xs">
                       {listing.onMarket ? (
                          <span className="font-bold text-emerald-700">New {listing.id}</span>
                       ) : (
                          listing.id
                       )}
                    </TableCell>
                  )}

                  {/* Location */}
                  {visibleColumns.has("location") && (
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="font-semibold truncate text-sm">{listing.address}</p>
                        {listing.locationDescription && (
                          <p className="text-[10px] text-muted-foreground truncate">
                            {listing.locationDescription}
                          </p>
                        )}
                      </div>
                    </TableCell>
                  )}

                  {/* Dimensions */}
                  {visibleColumns.has("dimensions") && (
                    <TableCell className="text-center text-xs">
                      {listing.dimensions || "-"}
                    </TableCell>
                  )}

                  {/* Rooms */}
                  {visibleColumns.has("rooms") && (
                    <TableCell className="text-center text-xs">
                      {listing.rooms || "-"}
                    </TableCell>
                  )}

                  {/* Sq. Ft. */}
                  {visibleColumns.has("size") && (
                    <TableCell className="text-center whitespace-nowrap text-muted-foreground text-xs">
                      {listing.squareFootage ? listing.squareFootage.toLocaleString() : "-"}
                    </TableCell>
                  )}

                  {/* Condition */}
                  {visibleColumns.has("condition") && (
                    <TableCell className="text-center whitespace-nowrap">
                       {listing.condition ? (
                        <span className="text-xs text-muted-foreground">{listing.condition.name}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}

                  {/* Other (Features) */}
                  {visibleColumns.has("other") && (
                    <TableCell className="text-center">
                       {listing.features && listing.features.length > 0 ? (
                          <span className="text-xs text-muted-foreground">
                            {listing.features.map(f => f.name).join(", ")}
                          </span>
                       ) : (
                          <span className="text-muted-foreground">-</span>
                       )}
                    </TableCell>
                  )}

                  {/* Notes (Zoning) */}
                  {visibleColumns.has("notes") && (
                    <TableCell className="text-center whitespace-nowrap">
                       {listing.zoning ? (
                        <span className="text-xs text-muted-foreground">{listing.zoning.code}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  
                  {/* Price */}
                  {visibleColumns.has("price") && (
                    <TableCell className="font-bold text-sm text-right">
                      {listing.price ? listing.price.toLocaleString() : "-"}
                    </TableCell>
                  )}
                  
                  {/* Extra Columns */}
                  {visibleColumns.has("type") && (
                    <TableCell>
                       {listing.propertyType?.name || "-"}
                    </TableCell>
                  )}
                   {visibleColumns.has("cycle") && (
                    <TableCell>
                       Week {listing.cycleGroup}
                    </TableCell>
                  )}
                   {visibleColumns.has("status") && (
                    <TableCell>
                       {listing.isActive ? "Active" : "Archived"}
                    </TableCell>
                  )}

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(listing)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleActive?.(listing)}>
                          {listing.isActive ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Mark as Archived
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Mark as Active
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete?.(listing)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

