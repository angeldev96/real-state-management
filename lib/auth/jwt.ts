import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { AUTH_CONFIG } from "./config";

// User payload in JWT
export interface JWTUserPayload extends JWTPayload {
  userId: number;
  email: string;
  name: string;
  role: "admin" | "user";
}

// Get secret key as Uint8Array (required by jose)
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(AUTH_CONFIG.jwtSecret);
}

/**
 * Create an access token (short-lived)
 */
export async function createAccessToken(payload: Omit<JWTUserPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(AUTH_CONFIG.accessTokenExpiry)
    .sign(getSecretKey());
}

/**
 * Create a refresh token (long-lived)
 */
export async function createRefreshToken(userId: number): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setJti(Math.random().toString(36).substring(7) + Date.now().toString())
    .setExpirationTime(AUTH_CONFIG.refreshTokenExpiry)
    .sign(getSecretKey());
}

/**
 * Verify and decode an access token
 */
export async function verifyAccessToken(token: string): Promise<JWTUserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as JWTUserPayload;
  } catch {
    return null;
  }
}

/**
 * Verify a refresh token
 */
export async function verifyRefreshToken(token: string): Promise<{ userId: number } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return { userId: payload.userId as number };
  } catch {
    return null;
  }
}

/**
 * Calculate expiry date for refresh token storage
 */
export function getRefreshTokenExpiry(): Date {
  const days = parseInt(AUTH_CONFIG.refreshTokenExpiry);
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}
