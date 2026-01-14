import { requireAdmin } from "@/lib/auth/require-auth";
import UsersClientPage from "./users-client";

export default async function UsersPage() {
  // Require authentication AND admin role - redirects if not admin
  await requireAdmin();
  
  return <UsersClientPage />;
}
