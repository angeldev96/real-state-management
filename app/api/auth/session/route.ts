import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { refreshAccessToken } from "@/lib/auth/queries";
import { AUTH_CONFIG } from "@/lib/auth/config";

export async function GET(request: NextRequest) {
  try {
    // Try to get access token
    const accessToken = request.cookies.get(AUTH_CONFIG.cookieName)?.value;

    if (accessToken) {
      const payload = await verifyAccessToken(accessToken);
      if (payload) {
        return NextResponse.json({
          success: true,
          user: {
            userId: payload.userId,
            email: payload.email,
            name: payload.name,
            role: payload.role,
          },
        });
      }
    }

    // Access token invalid or expired, try refresh token
    const refreshToken = request.cookies.get(AUTH_CONFIG.refreshCookieName)?.value;

    if (refreshToken) {
      const result = await refreshAccessToken(refreshToken);

      if (result.success && result.accessToken) {
        const response = NextResponse.json({
          success: true,
          user: result.user,
        });

        // Set new access token
        response.cookies.set(AUTH_CONFIG.cookieName, result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 15 * 60,
        });

        return response;
      }
    }

    // No valid session
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
