// Auth configuration
export const AUTH_CONFIG = {
  // JWT Settings
  jwtSecret: process.env.JWT_SECRET || "eretz-realty-super-secret-key-change-in-production",
  accessTokenExpiry: "15m", // 15 minutes
  refreshTokenExpiry: "7d", // 7 days
  
  // Cookie settings
  cookieName: "eretz-auth-token",
  refreshCookieName: "eretz-refresh-token",
  
  // Password settings
  saltRounds: 12,
  
  // Routes
  loginPath: "/login",
  protectedPaths: ["/", "/listings", "/settings"],
  publicPaths: ["/login", "/api/auth/login"],
} as const;
