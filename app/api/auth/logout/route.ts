import { NextRequest, NextResponse } from "next/server";
import { logoutUser } from "@/lib/auth/queries";
import { AUTH_CONFIG } from "@/lib/auth/config";

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get(AUTH_CONFIG.refreshCookieName)?.value;

    if (refreshToken) {
      // Remove session from database
      await logoutUser(refreshToken);
    }

    // Clear cookies
    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    
    response.cookies.delete(AUTH_CONFIG.cookieName);
    response.cookies.delete(AUTH_CONFIG.refreshCookieName);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
