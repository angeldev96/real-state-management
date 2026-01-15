import { requireAuth } from "@/lib/auth/require-auth";
import { getOrCreateCycleRotationConfig, ensureCycleRotationState } from "@/lib/db/queries";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  // Require authentication - redirects to /login if not authenticated
  await requireAuth();
  
  const config = await getOrCreateCycleRotationConfig();
  const state = await ensureCycleRotationState(config);

  return <SettingsClient rotationConfig={config} rotationState={state} />;
}
