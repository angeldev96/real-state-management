"use client";

import { Building2, Calendar, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CycleStatsCardProps {
  weekNumber: 1 | 2 | 3;
  totalListings: number;
  activeListings: number;
  nextSendDate: Date;
  isCurrentCycle?: boolean;
}

export function CycleStatsCard({
  weekNumber,
  totalListings,
  activeListings,
  nextSendDate,
  isCurrentCycle,
}: CycleStatsCardProps) {
  const formattedDate = nextSendDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        isCurrentCycle && "ring-2 ring-primary ring-offset-2"
      )}
    >
      {isCurrentCycle && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
          Next Up
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Week {weekNumber}
            </p>
            <h3 className="text-2xl font-serif font-semibold mt-1">
              {totalListings} Properties
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">Active Listings:</span>
            <span className="font-semibold text-foreground">
              {activeListings}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Scheduled:</span>
            <span className="font-semibold text-foreground">{formattedDate}</span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">Active Rate</span>
            <span className="font-medium">
              {totalListings > 0
                ? Math.round((activeListings / totalListings) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{
                width: `${
                  totalListings > 0
                    ? (activeListings / totalListings) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
