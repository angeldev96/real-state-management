import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_CONFIG } from "@/lib/auth/config";

// Proxy runs on Node.js runtime
import { jwtVerify } from "jose";

async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(AUTH_CONFIG.jwtSecret);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public paths and static files
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/cycle/rotate") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check for access token
  const accessToken = request.cookies.get(AUTH_CONFIG.cookieName)?.value;
  const refreshToken = request.cookies.get(AUTH_CONFIG.refreshCookieName)?.value;

  // If we have a valid access token, allow the request
  if (accessToken) {
    const isValid = await verifyToken(accessToken);
    if (isValid) {
      return NextResponse.next();
    }
  }

  // If access token is invalid but we have a refresh token,
  // let the request through - the API will handle token refresh
  if (refreshToken) {
    // Try to refresh the token via API call
    // For now, redirect to login if access token is invalid
    // The session API will handle the refresh
    const refreshValid = await verifyToken(refreshToken);
    if (refreshValid) {
      // Allow through, let client-side handle refresh
      return NextResponse.next();
    }
  }

  // No valid tokens, redirect to login
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth routes (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
