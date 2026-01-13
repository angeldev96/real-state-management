"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  Edit2,
  Trash2,
  MoreHorizontal,
  Eye,
  EyeOff,
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
} from "@/components/ui/dropdown-menu";
import { ListingWithRelations } from "@/lib/types";
import { formatPrice, formatSquareFootage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ListingsTableProps {
  listings: ListingWithRelations[];
  onEdit?: (listing: ListingWithRelations) => void;
  onDelete?: (listing: ListingWithRelations) => void;
  onToggleActive?: (listing: ListingWithRelations) => void;
}

type SortField = "address" | "price" | "cycleGroup" | "rooms" | "squareFootage";
type SortDirection = "asc" | "desc";

export function ListingsTable({
  listings,
  onEdit,
  onDelete,
  onToggleActive,
}: ListingsTableProps) {
  const [sortField, setSortField] = useState<SortField>("address");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

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
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[250px]">
              <SortButton field="address">Address</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="price">Price</SortButton>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <SortButton field="rooms">Rooms</SortButton>
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <SortButton field="squareFootage">Size</SortButton>
            </TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead>
              <SortButton field="cycleGroup">Cycle</SortButton>
            </TableHead>
            <TableHead>On Market</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedListings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                <p className="text-muted-foreground">No listings found</p>
              </TableCell>
            </TableRow>
          ) : (
            sortedListings.map((listing, index) => (
              <TableRow
                key={listing.id}
                className={cn(
                  "group transition-colors",
                  !listing.isActive && "opacity-50"
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TableCell>
                  <div>
                    <p className="font-medium">{listing.address}</p>
                    {listing.locationDescription && (
                      <p className="text-xs text-muted-foreground">
                        {listing.locationDescription}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  {formatPrice(listing.price)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {listing.rooms ?? "—"}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {formatSquareFootage(listing.squareFootage)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {listing.propertyType ? (
                    <Badge variant="secondary" className="text-xs">
                      {listing.propertyType.name}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      listing.cycleGroup === 1 && "border-chart-1 text-chart-1",
                      listing.cycleGroup === 2 && "border-chart-2 text-chart-2",
                      listing.cycleGroup === 3 && "border-chart-3 text-chart-3"
                    )}
                  >
                    Week {listing.cycleGroup}
                  </Badge>
                </TableCell>
                <TableCell>
                  {listing.onMarket ? (
                    <Badge className="bg-destructive text-destructive-foreground text-xs font-semibold">
                      NEW
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={listing.isActive ? "default" : "secondary"}
                    className="text-xs font-medium"
                  >
                    {listing.isActive ? "Active" : "Archived"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
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
  );
}
