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
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const conditions = sqliteTable("conditions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const zonings = sqliteTable("zonings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const features = sqliteTable("features", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
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
// CYCLE ROTATION (Weekly Cycle Engine)
// =============================================================================

export const cycleRotationConfig = sqliteTable("cycle_rotation_config", {
  id: integer("id").primaryKey(),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sunday ... 6=Saturday
  sendHour: integer("send_hour").notNull().default(0),
  sendMinute: integer("send_minute").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const cycleRotationState = sqliteTable("cycle_rotation_state", {
  id: integer("id").primaryKey(),
  currentCycle: integer("current_cycle").notNull().default(1), // 1, 2, 3
  lastRunAt: integer("last_run_at", { mode: "timestamp" }),
  nextRunAt: integer("next_run_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const cycleRuns = sqliteTable("cycle_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cycleNumber: integer("cycle_number").notNull(),
  scheduledFor: integer("scheduled_for", { mode: "timestamp" }).notNull(),
  sentAt: integer("sent_at", { mode: "timestamp" }),
  status: text("status", { enum: ["pending", "sent", "failed"] }).notNull().default("pending"),
  error: text("error"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// =============================================================================
// EMAIL SETTINGS (Email Template Configuration)
// =============================================================================

export const emailSettings = sqliteTable("email_settings", {
  id: integer("id").primaryKey(),
  // Header/Intro text (centered, appears before the listings)
  introText: text("intro_text").notNull().default("please review,\nFeel free to call for more details.\nplease reply listing number for more details\n\nThanks,\nDuvid Rubin"),
  // Footer agent info (left-aligned)
  agentTitle: text("agent_title").notNull().default("Licensed Real Estate Agent"),
  agentName: text("agent_name").notNull().default("David Rubin"),
  companyName: text("company_name").notNull().default("Eretz realty"),
  agentAddress: text("agent_address").notNull().default("5916 18th Ave"),
  agentCityStateZip: text("agent_city_state_zip").notNull().default("Brooklyn, N.Y. 11204"),
  agentPhone1: text("agent_phone_1").notNull().default("C-917.930.2028"),
  agentPhone2: text("agent_phone_2").notNull().default("718.256.9595 X 209"),
  agentEmail: text("agent_email").notNull().default("drubin@eretzltd.com"),
  // Legal disclaimer (red text)
  legalDisclaimer: text("legal_disclaimer").notNull().default("IMPORTANT NOTICE: This message and any attachments are solely for the intended recipient and may contain confidential information which is, or may be, legally privileged or otherwise protected by law from further disclosure. If you are not the intended recipient, any disclosure, copying, use, or distribution of the information included in this e-mail and any attachments is prohibited. If you have received this communication in error, please notify the sender by reply e-mail and immediately and permanently delete this e-mail and any attachments."),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
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
export type CycleRotationConfig = typeof cycleRotationConfig.$inferSelect;
export type NewCycleRotationConfig = typeof cycleRotationConfig.$inferInsert;
export type CycleRotationState = typeof cycleRotationState.$inferSelect;
export type NewCycleRotationState = typeof cycleRotationState.$inferInsert;
export type CycleRun = typeof cycleRuns.$inferSelect;
export type NewCycleRun = typeof cycleRuns.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type EmailRecipient = typeof emailRecipients.$inferSelect;
export type NewEmailRecipient = typeof emailRecipients.$inferInsert;
export type EmailSettings = typeof emailSettings.$inferSelect;
export type NewEmailSettings = typeof emailSettings.$inferInsert;