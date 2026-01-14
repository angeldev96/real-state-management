import { getSession } from "./session";
import { redirect } from "next/navigation";
import { JWTUserPayload } from "./jwt";

/**
 * Require authentication for server components and API routes
 * Redirects to login if not authenticated
 */
export async function requireAuth(): Promise<JWTUserPayload> {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }
  
  return session;
}

/**
 * Require admin role
 * Returns 403 if user is not an admin
 */
export async function requireAdmin(): Promise<JWTUserPayload> {
  const session = await requireAuth();
  
  if (session.role !== "admin") {
    redirect("/unauthorized");
  }
  
  return session;
}

/**
 * Check if user has admin role (for conditional rendering)
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === "admin";
}

/**
 * Check if user can access resource (must be admin or resource owner)
 */
export async function canAccessResource(resourceUserId: number): Promise<boolean> {
  const session = await getSession();
  
  if (!session) {
    return false;
  }
  
  // Admins can access all resources
  if (session.role === "admin") {
    return true;
  }
  
  // Users can only access their own resources
  return session.userId === resourceUserId;
}
