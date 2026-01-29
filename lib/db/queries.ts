import { db } from "./index";
import { listings, propertyTypes, conditions, zonings, features, listingFeatures, cycleSchedules, emailRecipients, emailSettings, cycleRotationConfig, cycleRotationState, cycleRuns } from "./schema";
import { eq, and, inArray } from "drizzle-orm";
import type { NewEmailRecipient, EmailRecipient, EmailSettings, NewEmailSettings, CycleRotationConfig, CycleRotationState, NewCycleRotationConfig, NewCycleRun } from "./schema";
import { DateTime } from "luxon";

// Types for our enriched data - matches the original ListingWithRelations type
export interface ListingWithRelations {
  id: number;
  address: string;
  locationDescription: string | null;
  dimensions: string | null;
  rooms: number | null;
  squareFootage: number | null;
  price: number | null;
  onMarket: boolean;
  isActive: boolean;
  cycleGroup: 1 | 2 | 3; // Match the type from lib/types.ts
  propertyTypeId: number | null;
  conditionId: number | null;
  zoningId: number | null;
  featureIds: number[]; // Keep for backward compatibility
  createdAt: Date;
  updatedAt: Date;
  // Relations
  propertyType: { id: number; name: string; isActive: boolean } | null;
  condition: { id: number; name: string; isActive: boolean } | null;
  zoning: { id: number; code: string; isActive: boolean } | null;
  features: Array<{ id: number; name: string; isActive: boolean }>;
}

export interface CycleStats {
  weekNumber: 1 | 2 | 3;
  dayOfMonth: number;
  description: string | null;
  totalListings: number;
  activeListings: number;
  nextSendDate: Date;
}

// Efficient single-query data fetching with JOINs
export async function getAllListingsWithRelations(): Promise<ListingWithRelations[]> {
  const allListings = await db
    .select({
      listing: listings,
      propertyType: propertyTypes,
      condition: conditions,
      zoning: zonings,
    })
    .from(listings)
    .leftJoin(propertyTypes, eq(listings.propertyTypeId, propertyTypes.id))
    .leftJoin(conditions, eq(listings.conditionId, conditions.id))
    .leftJoin(zonings, eq(listings.zoningId, zonings.id))
    .orderBy(listings.id);

  // Get all features for all listings in a single query
  const listingIds = allListings.map((l: any) => l.listing.id);
  const allFeatures = await db
    .select({
      listingId: listingFeatures.listingId,
      feature: features,
    })
    .from(listingFeatures)
    .innerJoin(features, eq(listingFeatures.featureId, features.id))
    .where(inArray(listingFeatures.listingId, listingIds));

  // Create a map for fast lookup
  const featuresMap = new Map<number, Array<{ id: number; name: string }>>();
  for (const feature of allFeatures) {
    if (!featuresMap.has(feature.listingId)) {
      featuresMap.set(feature.listingId, []);
    }
    featuresMap.get(feature.listingId)!.push(feature.feature);
  }

  // Combine results
  return allListings.map(({ listing, propertyType, condition, zoning }: any) => {
    const features = featuresMap.get(listing.id) || [];
    return {
      ...listing,
      propertyType,
      condition,
      zoning,
      cycleGroup: listing.cycleGroup as 1 | 2 | 3, // Cast to the correct type
      featureIds: features.map((f: any) => f.id), // Extract IDs for backward compatibility
      features,
    };
  });
}

export async function getListingsByCycle(cycleGroup: number): Promise<ListingWithRelations[]> {
  const cycleListings = await db
    .select({
      listing: listings,
      propertyType: propertyTypes,
      condition: conditions,
      zoning: zonings,
    })
    .from(listings)
    .leftJoin(propertyTypes, eq(listings.propertyTypeId, propertyTypes.id))
    .leftJoin(conditions, eq(listings.conditionId, conditions.id))
    .leftJoin(zonings, eq(listings.zoningId, zonings.id))
    .where(eq(listings.cycleGroup, cycleGroup))
    .orderBy(listings.id);

  if (cycleListings.length === 0) return [];

  // Get features for these listings
  const listingIds = cycleListings.map((l: any) => l.listing.id);
  const allFeatures = await db
    .select({
      listingId: listingFeatures.listingId,
      feature: features,
    })
    .from(listingFeatures)
    .innerJoin(features, eq(listingFeatures.featureId, features.id))
    .where(inArray(listingFeatures.listingId, listingIds));

  const featuresMap = new Map<number, Array<{ id: number; name: string }>>();
  for (const feature of allFeatures) {
    if (!featuresMap.has(feature.listingId)) {
      featuresMap.set(feature.listingId, []);
    }
    featuresMap.get(feature.listingId)!.push(feature.feature);
  }

  return cycleListings.map(({ listing, propertyType, condition, zoning }: any) => {
    const features = featuresMap.get(listing.id) || [];
    return {
      ...listing,
      propertyType,
      condition,
      zoning,
      cycleGroup: listing.cycleGroup as 1 | 2 | 3, // Cast to the correct type
      featureIds: features.map((f: any) => f.id), // Extract IDs for backward compatibility
      features,
    };
  });
}

export async function getCycleSchedules() {
  return db.select().from(cycleSchedules);
}

// =============================================================================
// CYCLE ROTATION (Weekly Cycles)
// =============================================================================

function getNextWeeklyRunAt(config: CycleRotationConfig, fromDate = new Date()): Date {
  const now = DateTime.fromJSDate(fromDate, { zone: "America/New_York" });
  const scheduledBase = now.set({
    hour: config.sendHour,
    minute: config.sendMinute,
    second: 0,
    millisecond: 0,
  });

  const currentDow = scheduledBase.weekday % 7; // Sunday -> 0, Monday -> 1, ...
  let deltaDays = (config.dayOfWeek - currentDow + 7) % 7;

  if (deltaDays === 0 && scheduledBase <= now) {
    deltaDays = 7;
  }

  const next = scheduledBase.plus({ days: deltaDays });
  return next.toUTC().toJSDate();
}

export async function getCycleRotationConfig(): Promise<CycleRotationConfig | undefined> {
  const [config] = await db.select().from(cycleRotationConfig).limit(1);
  return config;
}

export async function getOrCreateCycleRotationConfig(): Promise<CycleRotationConfig> {
  const existing = await getCycleRotationConfig();
  if (existing) return existing;

  const [created] = await db
    .insert(cycleRotationConfig)
    .values({
      id: 1,
      dayOfWeek: 3,
      sendHour: 0,
      sendMinute: 0,
    })
    .returning();
  return created;
}

export async function upsertCycleRotationConfig(config: NewCycleRotationConfig): Promise<CycleRotationConfig> {
  const existing = await getCycleRotationConfig();

  if (existing) {
    const [updated] = await db
      .update(cycleRotationConfig)
      .set({
        dayOfWeek: config.dayOfWeek,
        sendHour: config.sendHour ?? existing.sendHour,
        sendMinute: config.sendMinute ?? existing.sendMinute,
        updatedAt: new Date(),
      })
      .where(eq(cycleRotationConfig.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(cycleRotationConfig)
    .values({
      id: 1,
      dayOfWeek: config.dayOfWeek,
      sendHour: config.sendHour ?? 0,
      sendMinute: config.sendMinute ?? 0,
    })
    .returning();
  return created;
}

export async function getCycleRotationState(): Promise<CycleRotationState | undefined> {
  const [state] = await db.select().from(cycleRotationState).limit(1);
  return state;
}

export async function ensureCycleRotationState(config: CycleRotationConfig): Promise<CycleRotationState> {
  const existing = await getCycleRotationState();
  if (existing) return existing;

  const nextRunAt = getNextWeeklyRunAt(config);
  const [created] = await db
    .insert(cycleRotationState)
    .values({
      id: 1,
      currentCycle: 1,
      nextRunAt,
    })
    .returning();
  return created;
}

export async function recalculateCycleRotationState(
  config: CycleRotationConfig,
  fromDate = new Date()
): Promise<CycleRotationState> {
  const state = await ensureCycleRotationState(config);
  const nextRunAt = getNextWeeklyRunAt(config, fromDate);

  const [updated] = await db
    .update(cycleRotationState)
    .set({
      nextRunAt,
      updatedAt: new Date(),
    })
    .where(eq(cycleRotationState.id, state.id))
    .returning();

  return updated;
}

export async function createCycleRun(data: NewCycleRun) {
  const [created] = await db.insert(cycleRuns).values(data).returning();
  return created;
}

export async function advanceCycleRotation(runAt = new Date()): Promise<CycleRotationState> {
  const config = await getCycleRotationConfig();
  if (!config) {
    throw new Error("Cycle rotation config not found");
  }

  const state = await ensureCycleRotationState(config);
  const nextCycle = state.currentCycle % 3 + 1;
  const nextRunAt = getNextWeeklyRunAt(config, runAt);

  await createCycleRun({
    cycleNumber: state.currentCycle,
    scheduledFor: state.nextRunAt ?? runAt,
    sentAt: runAt,
    status: "sent",
  });

  const [updated] = await db
    .update(cycleRotationState)
    .set({
      currentCycle: nextCycle,
      lastRunAt: runAt,
      nextRunAt,
      updatedAt: new Date(),
    })
    .where(eq(cycleRotationState.id, state.id))
    .returning();

  return updated;
}

export async function updateCycleSchedule(weekNumber: 1 | 2 | 3, dayOfMonth: number, description?: string) {
  // Check if schedule exists
  const existing = await db
    .select()
    .from(cycleSchedules)
    .where(eq(cycleSchedules.weekNumber, weekNumber))
    .limit(1);

  if (existing.length > 0) {
    // Update existing
    await db
      .update(cycleSchedules)
      .set({ dayOfMonth, description: description || null })
      .where(eq(cycleSchedules.weekNumber, weekNumber));
  } else {
    // Insert new
    await db.insert(cycleSchedules).values({ weekNumber, dayOfMonth, description: description || null });
  }
}

export async function updateAllCycleSchedules(schedules: { weekNumber: 1 | 2 | 3; dayOfMonth: number; description?: string }[]) {
  for (const schedule of schedules) {
    await updateCycleSchedule(schedule.weekNumber, schedule.dayOfMonth, schedule.description);
  }
}

export async function getCycleStats(): Promise<CycleStats[]> {
  const schedules = await getCycleSchedules();

  const stats = await Promise.all(
    schedules.map(async (schedule: any) => {
      const cycleListings = await db
        .select()
        .from(listings)
        .where(eq(listings.cycleGroup, schedule.weekNumber));

      return {
        weekNumber: schedule.weekNumber as 1 | 2 | 3, // Cast to the correct type
        dayOfMonth: schedule.dayOfMonth,
        description: schedule.description,
        totalListings: cycleListings.length,
        activeListings: cycleListings.filter((l: any) => l.onMarket).length,
        nextSendDate: getNextSendDate(schedule.dayOfMonth),
      };
    })
  );

  return stats;
}

export async function getPropertyTypes() {
  return db.select().from(propertyTypes);
}

export async function getConditions() {
  return db.select().from(conditions);
}

export async function getZonings() {
  return db.select().from(zonings);
}

export async function getFeatures() {
  return db.select().from(features);
}

// =============================================================================
// LOOKUP MANAGEMENT (CRUD)
// =============================================================================

// Property Types
export async function createPropertyType(name: string) {
  const [created] = await db.insert(propertyTypes).values({ name }).returning();
  return created;
}

export async function updatePropertyType(id: number, name: string) {
  const [updated] = await db.update(propertyTypes).set({ name }).where(eq(propertyTypes.id, id)).returning();
  return updated;
}

export async function togglePropertyType(id: number) {
  const [item] = await db.select().from(propertyTypes).where(eq(propertyTypes.id, id)).limit(1);
  if (!item) return null;
  const [updated] = await db.update(propertyTypes).set({ isActive: !item.isActive }).where(eq(propertyTypes.id, id)).returning();
  return updated;
}

export async function deletePropertyType(id: number) {
  await db.delete(propertyTypes).where(eq(propertyTypes.id, id));
}

// Conditions
export async function createCondition(name: string) {
  const [created] = await db.insert(conditions).values({ name }).returning();
  return created;
}

export async function updateCondition(id: number, name: string) {
  const [updated] = await db.update(conditions).set({ name }).where(eq(conditions.id, id)).returning();
  return updated;
}

export async function toggleCondition(id: number) {
  const [item] = await db.select().from(conditions).where(eq(conditions.id, id)).limit(1);
  if (!item) return null;
  const [updated] = await db.update(conditions).set({ isActive: !item.isActive }).where(eq(conditions.id, id)).returning();
  return updated;
}

export async function deleteCondition(id: number) {
  await db.delete(conditions).where(eq(conditions.id, id));
}

// Zonings
export async function createZoning(code: string) {
  const [created] = await db.insert(zonings).values({ code }).returning();
  return created;
}

export async function updateZoning(id: number, code: string) {
  const [updated] = await db.update(zonings).set({ code }).where(eq(zonings.id, id)).returning();
  return updated;
}

export async function toggleZoning(id: number) {
  const [item] = await db.select().from(zonings).where(eq(zonings.id, id)).limit(1);
  if (!item) return null;
  const [updated] = await db.update(zonings).set({ isActive: !item.isActive }).where(eq(zonings.id, id)).returning();
  return updated;
}

export async function deleteZoning(id: number) {
  await db.delete(zonings).where(eq(zonings.id, id));
}

// Features
export async function createFeature(name: string) {
  const [created] = await db.insert(features).values({ name }).returning();
  return created;
}

export async function updateFeature(id: number, name: string) {
  const [updated] = await db.update(features).set({ name }).where(eq(features.id, id)).returning();
  return updated;
}

export async function toggleFeature(id: number) {
  const [item] = await db.select().from(features).where(eq(features.id, id)).limit(1);
  if (!item) return null;
  const [updated] = await db.update(features).set({ isActive: !item.isActive }).where(eq(features.id, id)).returning();
  return updated;
}

export async function deleteFeature(id: number) {
  await db.delete(features).where(eq(features.id, id));
}

export async function getListingById(id: number): Promise<ListingWithRelations | null> {
  const result = await db
    .select({
      listing: listings,
      propertyType: propertyTypes,
      condition: conditions,
      zoning: zonings,
    })
    .from(listings)
    .leftJoin(propertyTypes, eq(listings.propertyTypeId, propertyTypes.id))
    .leftJoin(conditions, eq(listings.conditionId, conditions.id))
    .leftJoin(zonings, eq(listings.zoningId, zonings.id))
    .where(eq(listings.id, id))
    .limit(1);

  if (result.length === 0) return null;

  const { listing, propertyType, condition, zoning } = result[0];

  // Get features for this listing
  const listingFeaturesData = await db
    .select({
      feature: features,
    })
    .from(listingFeatures)
    .innerJoin(features, eq(listingFeatures.featureId, features.id))
    .where(eq(listingFeatures.listingId, id));

  const featureItems: Array<{ id: number; name: string }> = listingFeaturesData.map((f: any) => f.feature);
  return {
    ...listing,
    propertyType,
    condition,
    zoning,
    cycleGroup: listing.cycleGroup as 1 | 2 | 3, // Cast to the correct type
    featureIds: featureItems.map((f: any) => f.id), // Extract IDs for backward compatibility
    features: featureItems,
  };
}

// Helper function to calculate next send date
function getNextSendDate(dayOfMonth: number): Date {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  let sendDate = new Date(year, month, dayOfMonth);

  if (sendDate < now) {
    sendDate = new Date(year, month + 1, dayOfMonth);
  }

  return sendDate;
}

// Summary stats
export async function getSummaryStats() {
  const allListings = await db.select().from(listings);

  const total = allListings.length;
  const newListings = allListings.filter((l: any) => l.onMarket).length;
  const active = allListings.filter((l: any) => l.isActive).length;

  return {
    total,
    newListings,
    active,
  };
}

// =============================================================================
// EMAIL RECIPIENTS QUERIES
// =============================================================================

// Get all email recipients
export async function getAllEmailRecipients(): Promise<EmailRecipient[]> {
  const recipients = await db.select().from(emailRecipients);
  return recipients;
}

// Get active email recipients only
export async function getActiveEmailRecipients(): Promise<EmailRecipient[]> {
  const recipients = await db
    .select()
    .from(emailRecipients)
    .where(eq(emailRecipients.isActive, true));
  return recipients;
}

// Get recipient by ID
export async function getEmailRecipientById(id: number): Promise<EmailRecipient | undefined> {
  const [recipient] = await db
    .select()
    .from(emailRecipients)
    .where(eq(emailRecipients.id, id));
  return recipient;
}

// Get recipient by email
export async function getEmailRecipientByEmail(email: string): Promise<EmailRecipient | undefined> {
  const [recipient] = await db
    .select()
    .from(emailRecipients)
    .where(eq(emailRecipients.email, email));
  return recipient;
}

// Create new email recipient
export async function createEmailRecipient(data: NewEmailRecipient): Promise<EmailRecipient> {
  const [newRecipient] = await db.insert(emailRecipients).values(data).returning();
  return newRecipient;
}

// Update email recipient
export async function updateEmailRecipient(
  id: number,
  data: Partial<NewEmailRecipient>
): Promise<EmailRecipient | undefined> {
  const [updated] = await db
    .update(emailRecipients)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(emailRecipients.id, id))
    .returning();
  return updated;
}

// Toggle active status
export async function toggleEmailRecipientActive(id: number): Promise<EmailRecipient | undefined> {
  const recipient = await getEmailRecipientById(id);
  if (!recipient) return undefined;

  const [updated] = await db
    .update(emailRecipients)
    .set({ isActive: !recipient.isActive, updatedAt: new Date() })
    .where(eq(emailRecipients.id, id))
    .returning();
  return updated;
}

// Delete email recipient
export async function deleteEmailRecipient(id: number): Promise<void> {
  await db.delete(emailRecipients).where(eq(emailRecipients.id, id));
}

// =============================================================================
// EMAIL SETTINGS QUERIES
// =============================================================================

const DEFAULT_EMAIL_SETTINGS: Omit<EmailSettings, "id" | "createdAt" | "updatedAt"> = {
  introText: "please review,\nFeel free to call for more details.\nplease reply listing number for more details\n\nThanks,\nDuvid Rubin",
  agentTitle: "Licensed Real Estate Agent",
  agentName: "David Rubin",
  companyName: "Eretz realty",
  agentAddress: "5916 18th Ave",
  agentCityStateZip: "Brooklyn, N.Y. 11204",
  agentPhone1: "C-917.930.2028",
  agentPhone2: "718.256.9595 X 209",
  agentEmail: "drubin@eretzltd.com",
  legalDisclaimer: "IMPORTANT NOTICE: This message and any attachments are solely for the intended recipient and may contain confidential information which is, or may be, legally privileged or otherwise protected by law from further disclosure. If you are not the intended recipient, any disclosure, copying, use, or distribution of the information included in this e-mail and any attachments is prohibited. If you have received this communication in error, please notify the sender by reply e-mail and immediately and permanently delete this e-mail and any attachments.",
};

// Get email settings (creates default if not exists)
export async function getOrCreateEmailSettings(): Promise<EmailSettings> {
  const [existing] = await db.select().from(emailSettings).limit(1);
  if (existing) return existing;

  const [created] = await db
    .insert(emailSettings)
    .values({
      id: 1,
      ...DEFAULT_EMAIL_SETTINGS,
    })
    .returning();
  return created;
}

// Update email settings
export async function updateEmailSettings(data: Partial<NewEmailSettings>): Promise<EmailSettings> {
  const existing = await getOrCreateEmailSettings();

  const [updated] = await db
    .update(emailSettings)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(emailSettings.id, existing.id))
    .returning();
  return updated;
}
