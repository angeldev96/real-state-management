import { PageHeader } from "@/components/layout/page-header";
import { CycleManagerClient } from "@/components/cycle/cycle-manager-client";
import { requireAuth } from "@/lib/auth/require-auth";
import { 
  getAllListingsWithRelations, 
  getCycleStats,
  getPropertyTypes,
  getConditions,
  getZonings,
  getFeatures,
} from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function CycleManagerPage() {
  // Require authentication - redirects to /login if not authenticated
  await requireAuth();
  
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
