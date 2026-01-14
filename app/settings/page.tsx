import { requireAuth } from "@/lib/auth/require-auth";
import SettingsClientPage from "./settings-client";

export default async function SettingsPage() {
  // Require authentication - redirects to /login if not authenticated
  await requireAuth();
  
  return <SettingsClientPage />;
}
