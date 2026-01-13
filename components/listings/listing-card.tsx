"use client";

import { MapPin, Maximize, BedDouble, DollarSign, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListingWithRelations } from "@/lib/types";
import { formatPrice, formatSquareFootage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  listing: ListingWithRelations;
  onEdit?: (listing: ListingWithRelations) => void;
}

export function ListingCard({ listing, onEdit }: ListingCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        !listing.isActive && "opacity-60"
      )}
    >
      {/* NEW Badge - Only show when onMarket is true */}
      {listing.onMarket && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-destructive text-destructive-foreground font-semibold shadow-md animate-pulse">
            NEW LISTING
          </Badge>
        </div>
      )}

      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-semibold text-lg text-foreground truncate">
              {listing.address}
            </h3>
            {listing.locationDescription && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{listing.locationDescription}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-semibold text-primary">
            {formatPrice(listing.price)}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {listing.rooms && (
            <div className="flex items-center gap-2 text-sm">
              <BedDouble className="w-4 h-4 text-muted-foreground" />
              <span>{listing.rooms} Rooms</span>
            </div>
          )}
          {listing.squareFootage && (
            <div className="flex items-center gap-2 text-sm">
              <Maximize className="w-4 h-4 text-muted-foreground" />
              <span>{formatSquareFootage(listing.squareFootage)}</span>
            </div>
          )}
          {listing.dimensions && (
            <div className="col-span-2 text-sm text-muted-foreground">
              Lot: {listing.dimensions}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {listing.propertyType && (
            <Badge variant="secondary" className="text-xs">
              {listing.propertyType.name}
            </Badge>
          )}
          {listing.zoning && (
            <Badge variant="outline" className="text-xs">
              {listing.zoning.code}
            </Badge>
          )}
          {listing.condition && (
            <Badge variant="outline" className="text-xs">
              {listing.condition.name}
            </Badge>
          )}
        </div>

        {/* Features */}
        {listing.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {listing.features.slice(0, 3).map((feature) => (
              <span
                key={feature.id}
                className="text-xs px-2 py-0.5 bg-accent/30 text-accent-foreground rounded"
              >
                {feature.name}
              </span>
            ))}
            {listing.features.length > 3 && (
              <span className="text-xs px-2 py-0.5 text-muted-foreground">
                +{listing.features.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Week {listing.cycleGroup} Cycle
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onEdit?.(listing)}
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
