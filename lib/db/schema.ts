import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// =============================================================================
// USERS TABLE (Authentication)
// =============================================================================

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Hashed with bcrypt
  name: text("name").notNull(),
  role: text("role", { enum: ["admin", "user"] }).notNull().default("user"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
});

// =============================================================================
// SESSIONS TABLE (JWT Refresh Tokens)
// =============================================================================

export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(), // Refresh token
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// =============================================================================
// LOOKUP TABLES (Catalog Tables)
// =============================================================================

export const propertyTypes = sqliteTable("property_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

export const conditions = sqliteTable("conditions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

export const zonings = sqliteTable("zonings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
});

export const features = sqliteTable("features", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

// =============================================================================
// CYCLE SCHEDULE (Scheduler Configuration)
// =============================================================================

export const cycleSchedules = sqliteTable("cycle_schedules", {
  weekNumber: integer("week_number").primaryKey(),
  dayOfMonth: integer("day_of_month").notNull(),
  description: text("description"),
});

// =============================================================================
// EMAIL RECIPIENTS (Email Distribution List)
// =============================================================================

export const emailRecipients = sqliteTable("email_recipients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name"), // Optional name for the recipient
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// =============================================================================
// MAIN TABLE: LISTINGS
// =============================================================================

export const listings = sqliteTable("listings", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  // Direct data from CSV
  address: text("address").notNull(),
  locationDescription: text("location_description"),
  dimensions: text("dimensions"),

  // Numeric data (nullable for messy data)
  rooms: integer("rooms"),
  squareFootage: integer("square_footage"),
  price: integer("price"),

  // Business logic
  onMarket: integer("on_market", { mode: "boolean" }).notNull().default(true),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  cycleGroup: integer("cycle_group").notNull().references(() => cycleSchedules.weekNumber),

  // Foreign keys
  propertyTypeId: integer("property_type_id").references(() => propertyTypes.id),
  conditionId: integer("condition_id").references(() => conditions.id),
  zoningId: integer("zoning_id").references(() => zonings.id),

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// =============================================================================
// MANY-TO-MANY: LISTING FEATURES
// =============================================================================

export const listingFeatures = sqliteTable("listing_features", {
  listingId: integer("listing_id").notNull().references(() => listings.id, { onDelete: "cascade" }),
  featureId: integer("feature_id").notNull().references(() => features.id, { onDelete: "cascade" }),
});

// =============================================================================
// TYPES FOR INSERT/SELECT
// =============================================================================

export type NewListing = typeof listings.$inferInsert;
export type Listing = typeof listings.$inferSelect;
export type PropertyType = typeof propertyTypes.$inferSelect;
export type Condition = typeof conditions.$inferSelect;
export type Zoning = typeof zonings.$inferSelect;
export type Feature = typeof features.$inferSelect;
export type CycleSchedule = typeof cycleSchedules.$inferSelect;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type EmailRecipient = typeof emailRecipients.$inferSelect;
export type NewEmailRecipient = typeof emailRecipients.$inferInsert;