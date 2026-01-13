"use client";

import { useState, useMemo } from "react";
import { Plus, Mail, TrendingUp, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { CycleStatsCard } from "@/components/dashboard/cycle-stats-card";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingForm } from "@/components/listings/listing-form";
import {
  getAllListingsWithRelations,
  getListingsByCycle,
  getNextSendDate,
  cycleSchedules,
} from "@/lib/mock-data";
import { ListingWithRelations, ListingFormData } from "@/lib/types";
import { toast } from "sonner";

export default function CycleManagerPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingListing, setEditingListing] =
    useState<ListingWithRelations | null>(null);
  const [activeTab, setActiveTab] = useState("1");

  const allListings = useMemo(() => getAllListingsWithRelations(), []);

  // Calculate stats for each cycle
  const cycleStats = useMemo(() => {
    return ([1, 2, 3] as const).map((week) => {
      const cycleListings = getListingsByCycle(week);
      return {
        weekNumber: week,
        totalListings: cycleListings.length,
        activeListings: cycleListings.filter((l) => l.onMarket).length, // Count NEW listings
        nextSendDate: getNextSendDate(week),
      };
    });
  }, []);

  // Determine which cycle is next
  const nextCycle = useMemo(() => {
    const now = new Date();
    const sortedDates = cycleStats
      .map((stat) => ({ ...stat, diff: stat.nextSendDate.getTime() - now.getTime() }))
      .filter((stat) => stat.diff > 0)
      .sort((a, b) => a.diff - b.diff);
    return sortedDates[0]?.weekNumber || 1;
  }, [cycleStats]);

  // Global summary stats
  const summaryStats = useMemo(() => {
    const total = allListings.length;
    const newListings = allListings.filter((l) => l.onMarket).length; // Count NEW listings
    const active = allListings.filter((l) => l.isActive).length;
    const nextDate = getNextSendDate(nextCycle);
    return { total, newListings, active, nextCycle, nextDate };
  }, [allListings, nextCycle]);

  const handleEdit = (listing: ListingWithRelations) => {
    setEditingListing(listing);
    setFormOpen(true);
  };

  const handleFormSubmit = (data: ListingFormData) => {
    // In real app, this would call an API
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
        title="Cycle Manager"
        description="Manage your weekly email campaigns and property distribution"
        action={
          <Button onClick={handleNewListing} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Listing
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 stagger-children">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Listings</p>
                <p className="text-3xl font-serif font-semibold">
                  {summaryStats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Listings</p>
                <p className="text-3xl font-serif font-semibold">
                  {summaryStats.newListings}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Send</p>
                <p className="text-xl font-serif font-semibold">
                  {summaryStats.nextDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-chart-4/20 flex items-center justify-center">
                <span className="text-xl font-bold text-chart-4">
                  {summaryStats.nextCycle}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Cycle</p>
                <p className="text-xl font-serif font-semibold">
                  Week {summaryStats.nextCycle}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
            <TabsTrigger value="1" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Week 1
              <span className="ml-2 text-xs opacity-70">
                ({getListingsByCycle(1).length})
              </span>
            </TabsTrigger>
            <TabsTrigger value="2" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Week 2
              <span className="ml-2 text-xs opacity-70">
                ({getListingsByCycle(2).length})
              </span>
            </TabsTrigger>
            <TabsTrigger value="3" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Week 3
              <span className="ml-2 text-xs opacity-70">
                ({getListingsByCycle(3).length})
              </span>
            </TabsTrigger>
          </TabsList>

          <p className="text-sm text-muted-foreground hidden sm:block">
            Scheduled for day{" "}
            <span className="font-semibold text-foreground">
              {cycleSchedules.find((s) => s.weekNumber === parseInt(activeTab))
                ?.dayOfMonth || "—"}
            </span>{" "}
            of each month
          </p>
        </div>

        {([1, 2, 3] as const).map((week) => (
          <TabsContent key={week} value={week.toString()} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
              {getListingsByCycle(week).map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onEdit={handleEdit}
                />
              ))}
              {getListingsByCycle(week).length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    No listings assigned to Week {week}
                  </p>
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
      <ListingForm
        open={formOpen}
        onOpenChange={setFormOpen}
        listing={editingListing}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
