import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { JWTUserPayload } from "@/lib/auth/jwt";

/**
 * API Route Guard - Use this in API routes to require authentication
 * Returns session or null if unauthorized
 */
export async function requireAuthAPI(): Promise<{
  session: JWTUserPayload | null;
  error: NextResponse | null;
}> {
  const session = await getSession();
  
  if (!session) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, error: "Unauthorized - Authentication required" },
        { status: 401 }
      ),
    };
  }
  
  return { session, error: null };
}

/**
 * API Route Guard - Require admin role
 */
export async function requireAdminAPI(): Promise<{
  session: JWTUserPayload | null;
  error: NextResponse | null;
}> {
  const { session, error } = await requireAuthAPI(request);
  
  if (error) {
    return { session: null, error };
  }
  
  if (session?.role !== "admin") {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      ),
    };
  }
  
  return { session, error: null };
}

/**
 * API Route Guard - Check resource ownership
 */
export async function requireResourceOwnerAPI(
  _request: NextRequest,
  resourceUserId: number
): Promise<{
  session: JWTUserPayload | null;
  error: NextResponse | null;
}> {
  const { session, error } = await requireAuthAPI();
  
  if (error) {
    return { session: null, error };
  }
  
  // Admins can access any resource
  if (session?.role === "admin") {
    return { session, error: null };
  }
  
  // Users can only access their own resources
  if (session?.userId !== resourceUserId) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, error: "Forbidden - You can only access your own resources" },
        { status: 403 }
      ),
    };
  }
  
  return { session, error: null };
}
