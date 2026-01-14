import { PageHeader } from "@/components/layout/page-header";
import { CycleManagerClient } from "@/components/cycle/cycle-manager-client";
import { 
  getAllListingsWithRelations, 
  getCycleStats,
  getPropertyTypes,
  getConditions,
  getZonings,
  getFeatures,
} from "@/lib/db/queries";

export default async function CycleManagerPage() {
  // Server-side data fetching - no client-side computation
  const [allListings, cycleStats, propertyTypes, conditions, zonings, features] = await Promise.all([
    getAllListingsWithRelations(),
    getCycleStats(),
    getPropertyTypes(),
    getConditions(),
    getZonings(),
    getFeatures(),
  ]);

  return (
    <div>
      <PageHeader
        title="Cycle Manager"
        description="Manage your weekly email campaigns and property distribution"
      />

      {/* Client component for interactive parts */}
      <CycleManagerClient 
        allListings={allListings} 
        cycleStats={cycleStats}
        propertyTypes={propertyTypes}
        conditions={conditions}
        zonings={zonings}
        features={features}
      />
    </div>
  );
}
