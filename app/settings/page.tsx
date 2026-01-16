import { requireAuth } from "@/lib/auth/require-auth";
import { 
  getOrCreateCycleRotationConfig, 
  ensureCycleRotationState,
  getPropertyTypes,
  getConditions,
  getZonings,
  getFeatures
} from "@/lib/db/queries";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  // Require authentication - redirects to /login if not authenticated
  await requireAuth();
  
  const [config, state, propertyTypes, conditions, zonings, features] = await Promise.all([
    getOrCreateCycleRotationConfig(),
    ensureCycleRotationState(await getOrCreateCycleRotationConfig()),
    getPropertyTypes(),
    getConditions(),
    getZonings(),
    getFeatures(),
  ]);

  return (
    <SettingsClient 
      rotationConfig={config} 
      rotationState={state}
      propertyTypes={propertyTypes}
      conditions={conditions}
      zonings={zonings}
      features={features}
    />
  );
}
