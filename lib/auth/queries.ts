import { db } from "../db/index";
import { users, sessions } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";
import { hashPassword, verifyPassword } from "./password";
import { createAccessToken, createRefreshToken, getRefreshTokenExpiry, verifyRefreshToken } from "./jwt";

export interface LoginResult {
  success: boolean;
  error?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: number;
    email: string;
    name: string;
    role: "admin" | "user";
  };
}

/**
 * Authenticate user with email/username and password
 */
export async function authenticateUser(email: string, password: string): Promise<LoginResult> {
  try {
    // Find user by email/username (case-insensitive for emails, exact for usernames)
    const userResults = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.isActive, true)))
      .limit(1);

    // If not found, try lowercase (for email format)
    let user = userResults[0];
    if (!user) {
      const lowerResults = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email.toLowerCase()), eq(users.isActive, true)))
        .limit(1);
      user = lowerResults[0];
    }

    if (!user) {
      return { success: false, error: "Invalid username or password" };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Create tokens
    const accessToken = await createAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "admin" | "user",
    });

    const refreshToken = await createRefreshToken(user.id);

    // Store refresh token in database
    await db.insert(sessions).values({
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    });

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, user.id));

    return {
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as "admin" | "user",
      },
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<LoginResult> {
  try {
    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return { success: false, error: "Invalid refresh token" };
    }

    // Check if refresh token exists in database and is not expired
    const sessionResults = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.token, refreshToken), gt(sessions.expiresAt, new Date())))
      .limit(1);

    if (sessionResults.length === 0) {
      return { success: false, error: "Session expired" };
    }

    // Get user
    const userResults = await db
      .select()
      .from(users)
      .where(and(eq(users.id, payload.userId), eq(users.isActive, true)))
      .limit(1);

    if (userResults.length === 0) {
      return { success: false, error: "User not found" };
    }

    const user = userResults[0];

    // Create new access token
    const accessToken = await createAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "admin" | "user",
    });

    return {
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as "admin" | "user",
      },
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    return { success: false, error: "Failed to refresh token" };
  }
}

/**
 * Logout user - remove session from database
 */
export async function logoutUser(refreshToken: string): Promise<boolean> {
  try {
    await db.delete(sessions).where(eq(sessions.token, refreshToken));
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}

/**
 * Create a new user
 */
export async function createUser(
  email: string,
  password: string,
  name: string,
  role: "admin" | "user" = "user"
): Promise<{ success: boolean; error?: string; userId?: number }> {
  try {
    // Check if email already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: "Email already exists" };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user
    const result = await db.insert(users).values({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
    }).returning();

    return { success: true, userId: result[0]?.id };
  } catch (error) {
    console.error("Create user error:", error);
    return { success: false, error: "Failed to create user" };
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<void> {
  await db.delete(sessions).where(gt(sessions.expiresAt, new Date()));
}
