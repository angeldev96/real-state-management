// Auth configuration

// Validate JWT_SECRET in production
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  
  if (process.env.NODE_ENV === "production" && !secret) {
    throw new Error(
      "JWT_SECRET environment variable is required in production. " +
      "Please set it in your Vercel project settings."
    );
  }
  
  return secret || "eretz-realty-dev-secret-key-only-for-local-development";
};

export const AUTH_CONFIG = {
  // JWT Settings
  jwtSecret: getJwtSecret(),
  accessTokenExpiry: "7d", // 7 days
  refreshTokenExpiry: "7d", // 7 days
  
  // Cookie settings
  cookieName: "eretz-auth-token",
  refreshCookieName: "eretz-refresh-token",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  },
  
  // Password settings
  saltRounds: 12,
  
  // Routes
  loginPath: "/login",
  protectedPaths: ["/", "/listings", "/settings", "/users"],
  publicPaths: ["/login", "/api/auth/login"],
} as const;
