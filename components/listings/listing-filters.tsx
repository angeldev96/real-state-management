"use client";

import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ListingFilters } from "@/lib/types";
import {
  propertyTypes,
  conditions,
  zonings,
} from "@/lib/mock-data";

interface ListingFiltersProps {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}

export function ListingFiltersBar({ filters, onChange }: ListingFiltersProps) {
  const activeFiltersCount = [
    filters.cycleGroup,
    filters.propertyTypeId,
    filters.conditionId,
    filters.zoningId,
    filters.isActive,
  ].filter((v) => v !== null).length;

  const clearFilters = () => {
    onChange({
      search: "",
      cycleGroup: null,
      propertyTypeId: null,
      conditionId: null,
      zoningId: null,
      isActive: null,
    });
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 flex-wrap">
          <Select
            value={filters.cycleGroup?.toString() || "all"}
            onValueChange={(value) =>
              onChange({
                ...filters,
                cycleGroup: value === "all" ? null : parseInt(value),
              })
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cycles</SelectItem>
              <SelectItem value="1">Week 1</SelectItem>
              <SelectItem value="2">Week 2</SelectItem>
              <SelectItem value="3">Week 3</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.propertyTypeId?.toString() || "all"}
            onValueChange={(value) =>
              onChange({
                ...filters,
                propertyTypeId: value === "all" ? null : parseInt(value),
              })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
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

          <Select
            value={filters.zoningId?.toString() || "all"}
            onValueChange={(value) =>
              onChange({
                ...filters,
                zoningId: value === "all" ? null : parseInt(value),
              })
            }
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Zoning" />
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

          <Select
            value={
              filters.isActive === null
                ? "all"
                : filters.isActive
                ? "active"
                : "archived"
            }
            onValueChange={(value) =>
              onChange({
                ...filters,
                isActive:
                  value === "all" ? null : value === "active" ? true : false,
              })
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.conditionId?.toString() || "all"}
            onValueChange={(value) =>
              onChange({
                ...filters,
                conditionId: value === "all" ? null : parseInt(value),
              })
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Condition" />
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
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={clearFilters}
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
