import { db } from "./index";
import { listings, propertyTypes, conditions, zonings, features, listingFeatures, cycleSchedules, emailRecipients } from "./schema";
import { eq, and, inArray } from "drizzle-orm";
import type { NewEmailRecipient, EmailRecipient } from "./schema";

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
  propertyType: { id: number; name: string } | null;
  condition: { id: number; name: string } | null;
  zoning: { id: number; code: string } | null;
  features: Array<{ id: number; name: string }>;
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
