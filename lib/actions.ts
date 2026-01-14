"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db/index";
import { listings, listingFeatures } from "./db/schema";
import { eq } from "drizzle-orm";
import { ListingFormData } from "./types";
import { sendTestEmail, sendSamplePropertiesEmail } from "./email";
import { updateAllCycleSchedules as dbUpdateAllCycleSchedules, getAllListingsWithRelations } from "./db/queries";

export type ActionResponse = {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
};

export async function createListing(data: ListingFormData): Promise<ActionResponse> {
  try {
    // Convert form data to database format
    const listingData = {
      address: data.address,
      locationDescription: data.locationDescription || null,
      dimensions: data.dimensions || null,
      rooms: data.rooms ? parseInt(data.rooms) || null : null,
      squareFootage: data.squareFootage ? parseInt(data.squareFootage) || null : null,
      price: data.price ? parseInt(data.price) || null : null,
      onMarket: data.onMarket,
      isActive: data.isActive,
      cycleGroup: data.cycleGroup,
      propertyTypeId: data.propertyTypeId ? parseInt(data.propertyTypeId) || null : null,
      conditionId: data.conditionId ? parseInt(data.conditionId) || null : null,
      zoningId: data.zoningId ? parseInt(data.zoningId) || null : null,
    };

    // Insert listing
    const result = await db.insert(listings).values(listingData).returning();
    const listingId = result[0]?.id;

    if (!listingId) {
      return { success: false, message: "Failed to create listing" };
    }

    // Insert features
    if (data.featureIds && data.featureIds.length > 0) {
      const featureValues = data.featureIds.map((featureId) => ({
        listingId,
        featureId,
      }));
      await db.insert(listingFeatures).values(featureValues);
    }

    revalidatePath("/");
    return { success: true, message: "Listing created successfully", data: { id: listingId } };
  } catch (error) {
    console.error("Error creating listing:", error);
    return {
      success: false,
      message: "Failed to create listing",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateListing(id: number, data: ListingFormData): Promise<ActionResponse> {
  try {
    // Convert form data to database format
    const listingData = {
      address: data.address,
      locationDescription: data.locationDescription || null,
      dimensions: data.dimensions || null,
      rooms: data.rooms ? parseInt(data.rooms) || null : null,
      squareFootage: data.squareFootage ? parseInt(data.squareFootage) || null : null,
      price: data.price ? parseInt(data.price) || null : null,
      onMarket: data.onMarket,
      isActive: data.isActive,
      cycleGroup: data.cycleGroup,
      propertyTypeId: data.propertyTypeId ? parseInt(data.propertyTypeId) || null : null,
      conditionId: data.conditionId ? parseInt(data.conditionId) || null : null,
      zoningId: data.zoningId ? parseInt(data.zoningId) || null : null,
      updatedAt: new Date(),
    };

    // Update listing
    await db.update(listings).set(listingData).where(eq(listings.id, id));

    // Delete existing features and insert new ones
    await db.delete(listingFeatures).where(eq(listingFeatures.listingId, id));

    if (data.featureIds && data.featureIds.length > 0) {
      const featureValues = data.featureIds.map((featureId) => ({
        listingId: id,
        featureId,
      }));
      await db.insert(listingFeatures).values(featureValues);
    }

    revalidatePath("/");
    return { success: true, message: "Listing updated successfully", data: { id } };
  } catch (error) {
    console.error("Error updating listing:", error);
    return {
      success: false,
      message: "Failed to update listing",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteListing(id: number): Promise<ActionResponse> {
  try {
    await db.delete(listings).where(eq(listings.id, id));
    revalidatePath("/");
    return { success: true, message: "Listing deleted successfully", data: { id } };
  } catch (error) {
    console.error("Error deleting listing:", error);
    return {
      success: false,
      message: "Failed to delete listing",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function toggleListingMarketStatus(id: number): Promise<ActionResponse> {
  try {
    const listing = await db.select().from(listings).where(eq(listings.id, id)).limit(1);

    if (listing.length === 0) {
      return { success: false, message: "Listing not found" };
    }

    await db
      .update(listings)
      .set({ onMarket: !listing[0].onMarket, updatedAt: new Date() })
      .where(eq(listings.id, id));

    revalidatePath("/");
    return { success: true, message: "Listing status updated successfully", data: { id } };
  } catch (error) {
    console.error("Error toggling listing status:", error);
    return {
      success: false,
      message: "Failed to update listing status",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function toggleListingActiveStatus(id: number): Promise<ActionResponse> {
  try {
    const listing = await db.select().from(listings).where(eq(listings.id, id)).limit(1);

    if (listing.length === 0) {
      return { success: false, message: "Listing not found" };
    }

    await db
      .update(listings)
      .set({ isActive: !listing[0].isActive, updatedAt: new Date() })
      .where(eq(listings.id, id));

    revalidatePath("/");
    return { success: true, message: "Listing status updated successfully", data: { id } };
  } catch (error) {
    console.error("Error toggling listing status:", error);
    return {
      success: false,
      message: "Failed to update listing status",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Email Actions
export async function sendTestEmailAction(email: string): Promise<ActionResponse> {
  try {
    const result = await sendTestEmail(email);

    if (!result.success) {
      return {
        success: false,
        message: "Failed to send test email",
        error: result.error ? String(result.error) : "Unknown error",
      };
    }

    return { success: true, message: `Test email sent to ${email}` };
  } catch (error) {
    console.error("Error sending test email:", error);
    return {
      success: false,
      message: "Failed to send test email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendSamplePropertiesEmailAction(email: string): Promise<ActionResponse> {
  try {
    // Get first 5 listings
    const allListings = await getAllListingsWithRelations();
    const sampleListings = allListings.slice(0, 5);

    if (sampleListings.length === 0) {
      return { success: false, message: "No listings found to send" };
    }

    const result = await sendSamplePropertiesEmail(email, sampleListings);

    if (!result.success) {
      return {
        success: false,
        message: "Failed to send sample properties email",
        error: result.error ? String(result.error) : "Unknown error",
      };
    }

    return { success: true, message: `Sample properties email sent to ${email} (${sampleListings.length} properties)` };
  } catch (error) {
    console.error("Error sending sample properties email:", error);
    return {
      success: false,
      message: "Failed to send sample properties email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Cycle Schedule Actions
export interface CycleScheduleData {
  week1Day: number;
  week2Day: number;
  week3Day: number;
}

export async function updateCycleSchedules(data: CycleScheduleData): Promise<ActionResponse> {
  try {
    const schedules = [
      { weekNumber: 1 as const, dayOfMonth: data.week1Day, description: "Typically properties for start of month" },
      { weekNumber: 2 as const, dayOfMonth: data.week2Day, description: "Mid-month property collection" },
      { weekNumber: 3 as const, dayOfMonth: data.week3Day, description: "End of month offerings" },
    ];

    await dbUpdateAllCycleSchedules(schedules);
    revalidatePath("/settings");
    return { success: true, message: "Schedule updated successfully" };
  } catch (error) {
    console.error("Error updating cycle schedules:", error);
    return {
      success: false,
      message: "Failed to update schedule",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
