"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db/index";
import { listings, listingFeatures } from "./db/schema";
import { eq } from "drizzle-orm";
import { ListingFormData } from "./types";

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
    const result = await db.insert(listings).values(listingData).returning({ id: listings.id });
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
