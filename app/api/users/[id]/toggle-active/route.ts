import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { users, sessions } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication and admin role
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    if (session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }
    
    // Prevent self-deactivation
    if (session.userId === userId) {
      return NextResponse.json(
        { success: false, error: "Cannot deactivate your own account" },
        { status: 400 }
      );
    }

    // Get current user state
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Toggle active state
    await db
      .update(users)
      .set({ isActive: !user[0].isActive, updatedAt: new Date() })
      .where(eq(users.id, userId));

    // If deactivating, invalidate all their sessions
    if (user[0].isActive) {
      await db.delete(sessions).where(eq(sessions.userId, userId));
    }

    return NextResponse.json({
      success: true,
      message: user[0].isActive ? "User deactivated and logged out" : "User activated",
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}
