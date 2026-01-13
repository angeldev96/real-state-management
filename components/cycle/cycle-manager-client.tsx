"use client";

import { useState, lazy, Suspense } from "react";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CycleStatsCard } from "@/components/dashboard/cycle-stats-card";
import { ListingCard } from "@/components/listings/listing-card";
import { createListing, updateListing } from "@/lib/actions";
import { ListingWithRelations, ListingFormData } from "@/lib/types";
import type { CycleStats as DatabaseCycleStats } from "@/lib/db/queries";
import { toast } from "sonner";

// Dynamic import for code splitting - heavy form component loads only when needed
const ListingForm = lazy(() =>
  import("@/components/listings/listing-form").then((mod) => ({
    default: mod.ListingForm,
  }))
);

interface CycleManagerClientProps {
  allListings: ListingWithRelations[];
  cycleStats: DatabaseCycleStats[];
}

export function CycleManagerClient({ allListings, cycleStats }: CycleManagerClientProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<ListingWithRelations | null>(null);
  const [activeTab, setActiveTab] = useState("1");

  // Group listings by cycle
  const listingsByCycle = {
    1: allListings.filter((l) => l.cycleGroup === 1),
    2: allListings.filter((l) => l.cycleGroup === 2),
    3: allListings.filter((l) => l.cycleGroup === 3),
  };

  // Determine which cycle is next
  const now = new Date();
  const nextCycle = cycleStats
    .map((stat) => ({ ...stat, diff: stat.nextSendDate.getTime() - now.getTime() }))
    .filter((stat) => stat.diff > 0)
    .sort((a, b) => a.diff - b.diff)[0]?.weekNumber || 1;

  // Global summary stats
  const summaryStats = {
    total: allListings.length,
    newListings: allListings.filter((l) => l.onMarket).length,
    active: allListings.filter((l) => l.isActive).length,
    nextCycle,
    nextDate: cycleStats.find((s) => s.weekNumber === nextCycle)?.nextSendDate || new Date(),
  };

  const handleEdit = (listing: ListingWithRelations) => {
    setEditingListing(listing);
    setFormOpen(true);
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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 stagger-children">
        <Card
          icon={<TrendingUp className="w-6 h-6 text-primary" />}
          title="Total Listings"
          value={summaryStats.total}
          className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20"
        />
        <Card
          icon={<Mail className="w-6 h-6 text-destructive" />}
          title="New Listings"
          value={summaryStats.newListings}
          className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20"
        />
        <Card
          icon={<Calendar className="w-6 h-6 text-accent-foreground" />}
          title="Next Send"
          value={summaryStats.nextDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
          className="bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30"
        />
        <Card
          icon={<span className="text-xl font-bold text-chart-4">{summaryStats.nextCycle}</span>}
          title="Next Cycle"
          value={`Week ${summaryStats.nextCycle}`}
          className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20"
        />
      </div>

      {/* Cycle Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 stagger-children">
        {cycleStats.map((stats) => (
          <CycleStatsCard
            key={stats.weekNumber}
            {...stats}
            isCurrentCycle={stats.weekNumber === nextCycle}
          />
        ))}
      </div>

      {/* Cycle Tabs with Listings */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50">
            <TabsTrigger
              value="1"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Week 1
              <span className="ml-2 text-xs opacity-70">({listingsByCycle[1].length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="2"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Week 2
              <span className="ml-2 text-xs opacity-70">({listingsByCycle[2].length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="3"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Week 3
              <span className="ml-2 text-xs opacity-70">({listingsByCycle[3].length})</span>
            </TabsTrigger>
          </TabsList>

          <Button onClick={handleNewListing} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Listing
          </Button>
        </div>

        {[1, 2, 3].map((week) => (
          <TabsContent key={week} value={week.toString()} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
              {listingsByCycle[week as keyof typeof listingsByCycle].map((listing) => (
                <ListingCard key={listing.id} listing={listing} onEdit={handleEdit} />
              ))}
              {listingsByCycle[week as keyof typeof listingsByCycle].length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <p className="text-muted-foreground mb-4">No listings assigned to Week {week}</p>
                  <Button variant="outline" onClick={handleNewListing}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Listing
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Listing Form Dialog */}
      <Suspense fallback={null}>
        <ListingForm
          open={formOpen}
          onOpenChange={setFormOpen}
          listing={editingListing}
          onSubmit={handleFormSubmit}
        />
      </Suspense>
    </div>
  );
}

// Helper component for summary cards
function Card({
  icon,
  title,
  value,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border p-6 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-current/20 flex items-center justify-center opacity-80">
          {icon}
        </div>
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-3xl font-serif font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TrendingUp({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function Mail({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function Calendar({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
