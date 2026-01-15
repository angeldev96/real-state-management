import { cookies } from "next/headers";
import { AUTH_CONFIG } from "./config";
import { verifyAccessToken, JWTUserPayload } from "./jwt";

/**
 * Get the current session from cookies (for Server Components)
 */
export async function getSession(): Promise<JWTUserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_CONFIG.cookieName)?.value;
  
  if (!token) {
    return null;
  }
  
  return verifyAccessToken(token);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Get current user info from session
 */
export async function getCurrentUser(): Promise<JWTUserPayload | null> {
  return getSession();
}

/**
 * Set auth cookies (for API routes)
 */
export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  
  // Access token - shorter expiry, httpOnly
  cookieStore.set(AUTH_CONFIG.cookieName, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
  
  // Refresh token - longer expiry, httpOnly
  cookieStore.set(AUTH_CONFIG.refreshCookieName, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Clear auth cookies (for logout)
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_CONFIG.cookieName);
  cookieStore.delete(AUTH_CONFIG.refreshCookieName);
}
