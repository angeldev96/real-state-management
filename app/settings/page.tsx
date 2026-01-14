import { requireAuth } from "@/lib/auth/require-auth";
import { getCycleSchedules } from "@/lib/db/queries";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  // Require authentication - redirects to /login if not authenticated
  await requireAuth();
  
  const schedules = await getCycleSchedules();

  return <SettingsClient initialSchedules={schedules} />;
}
