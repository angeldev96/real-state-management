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

type SortField = "address" | "price" | "cycleGroup" | "rooms" | "squareFootage";
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
  const [sortField, setSortField] = useState<SortField>("address");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(["price", "type", "cycle", "status"])
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
      <div className="flex justify-end">
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
              checked={visibleColumns.has("price")}
              onCheckedChange={() => toggleColumn("price")}
            >
              Price
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.has("size")}
              onCheckedChange={() => toggleColumn("size")}
            >
              Size (sq ft)
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
              checked={visibleColumns.has("zoning")}
              onCheckedChange={() => toggleColumn("zoning")}
            >
              Zoning
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.has("condition")}
              onCheckedChange={() => toggleColumn("condition")}
            >
              Condition
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.has("status")}
              onCheckedChange={() => toggleColumn("status")}
            >
              Active Status
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b-0">
              <TableHead className="w-[300px]">
                <SortButton field="address">Address</SortButton>
              </TableHead>
              {visibleColumns.has("price") && (
                <TableHead>
                  <SortButton field="price">Price</SortButton>
                </TableHead>
              )}
              {visibleColumns.has("size") && (
                <TableHead>
                  <SortButton field="squareFootage">Size</SortButton>
                </TableHead>
              )}
              {visibleColumns.has("type") && <TableHead className="font-bold">Type</TableHead>}
              {visibleColumns.has("cycle") && (
                <TableHead className="font-bold">
                  <SortButton field="cycleGroup">Cycle</SortButton>
                </TableHead>
              )}
              {visibleColumns.has("zoning") && <TableHead className="font-bold">Zoning</TableHead>}
              {visibleColumns.has("condition") && (
                <TableHead className="font-bold">Condition</TableHead>
              )}
              {visibleColumns.has("status") && <TableHead className="font-bold">Status</TableHead>}
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
            {/* Filters Row */}
            <TableRow className="bg-muted/30 border-t-0 -mt-2">
              <TableCell className="py-2">
                <div className="relative">
                  <Input
                    placeholder="Filter address..."
                    value={filters.search}
                    onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                    className="h-8 text-xs bg-background"
                  />
                </div>
              </TableCell>
              {visibleColumns.has("price") && <TableCell className="py-2"></TableCell>}
              {visibleColumns.has("size") && <TableCell className="py-2"></TableCell>}
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
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
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
                      <SelectValue placeholder="All Cycles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cycles</SelectItem>
                      <SelectItem value="1">Week 1</SelectItem>
                      <SelectItem value="2">Week 2</SelectItem>
                      <SelectItem value="3">Week 3</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              )}
              {visibleColumns.has("zoning") && (
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
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="All Zones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Zones</SelectItem>
                      {zonings.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id.toString()}>
                          {zone.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              )}
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
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="All Conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      {conditions.map((condition) => (
                        <SelectItem key={condition.id} value={condition.id.toString()}>
                          {condition.name}
                        </SelectItem>
                      ))}
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
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
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
                  colSpan={visibleColumns.size + 2}
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
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCell>
                    <div className="max-w-[280px]">
                      <p className="font-semibold truncate">{listing.address}</p>
                      {listing.locationDescription && (
                        <p className="text-[10px] text-muted-foreground truncate">
                          {listing.locationDescription}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  {visibleColumns.has("price") && (
                    <TableCell className="font-semibold text-primary">
                      {formatPrice(listing.price)}
                    </TableCell>
                  )}
                  {visibleColumns.has("size") && (
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatSquareFootage(listing.squareFootage)}
                    </TableCell>
                  )}
                  {visibleColumns.has("type") && (
                    <TableCell>
                      {listing.propertyType ? (
                        <Badge variant="outline" className="text-[10px] py-0 bg-muted/30">
                          {listing.propertyType.name}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.has("cycle") && (
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-bold text-[10px] py-0",
                          listing.cycleGroup === 1 && "border-chart-1 text-chart-1 bg-chart-1/5",
                          listing.cycleGroup === 2 && "border-chart-2 text-chart-2 bg-chart-2/5",
                          listing.cycleGroup === 3 && "border-chart-3 text-chart-3 bg-chart-3/5"
                        )}
                      >
                        Week {listing.cycleGroup}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.has("zoning") && (
                    <TableCell className="whitespace-nowrap">
                      {listing.zoning ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 px-1 font-normal opacity-70"
                        >
                          {listing.zoning.code}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.has("condition") && (
                    <TableCell className="whitespace-nowrap">
                      {listing.condition ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 px-1 font-normal opacity-70"
                        >
                          {listing.condition.name}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.has("status") && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {listing.onMarket && (
                          <Badge className="bg-destructive hover:bg-destructive text-destructive-foreground text-[10px] py-0 px-1 font-bold">
                            NEW
                          </Badge>
                        )}
                        <Badge
                          variant={listing.isActive ? "default" : "secondary"}
                          className={cn(
                            "text-[10px] py-0 px-1 font-bold",
                            listing.isActive ? "bg-emerald-600" : "opacity-60"
                          )}
                        >
                          {listing.isActive ? "Active" : "Archived"}
                        </Badge>
                      </div>
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
                          onClick={() => onDelete?.(listing)}
                        >
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

