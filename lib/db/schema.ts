import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

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
