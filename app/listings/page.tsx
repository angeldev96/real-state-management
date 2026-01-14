import { getAllListingsWithRelations, getPropertyTypes, getConditions, getZonings, getFeatures } from "@/lib/db/queries";
import { requireAuth } from "@/lib/auth/require-auth";
import { ListingsPageClient } from "./listings-page-client";

export default async function ListingsPage() {
  // Require authentication - redirects to /login if not authenticated
  await requireAuth();
  
  const [allListings, propertyTypes, conditions, zonings, features] = await Promise.all([
    getAllListingsWithRelations(),
    getPropertyTypes(),
    getConditions(),
    getZonings(),
    getFeatures(),
  ]);

  return (
    <ListingsPageClient
      allListings={allListings}
      propertyTypes={propertyTypes}
      conditions={conditions}
      zonings={zonings}
      features={features}
    />
  );
}
