import { getCycleSchedules } from "@/lib/db/queries";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const schedules = await getCycleSchedules();

  return <SettingsClient initialSchedules={schedules} />;
}
