"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db/index";
import { listings, listingFeatures } from "./db/schema";
import { eq } from "drizzle-orm";
import { ListingFormData } from "./types";
import { requireAuth } from "./auth/require-auth";
import { sendTestEmail, sendSamplePropertiesEmail } from "./email";
import { 
  getAllListingsWithRelations, 
  createEmailRecipient, 
  getAllEmailRecipients, 
  getEmailRecipientByEmail, 
  updateEmailRecipient, 
  deleteEmailRecipient, 
  toggleEmailRecipientActive, 
  upsertCycleRotationConfig, 
  recalculateCycleRotationState,
  createPropertyType,
  updatePropertyType,
  togglePropertyType,
  deletePropertyType,
  createCondition,
  updateCondition,
  toggleCondition,
  deleteCondition,
  createZoning,
  updateZoning,
  toggleZoning,
  deleteZoning,
  createFeature,
  updateFeature,
  toggleFeature,
  deleteFeature
} from "./db/queries";
import { getSession } from "./auth/session";

export type ActionResponse = {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
};

export async function createListing(data: ListingFormData): Promise<ActionResponse> {
  try {
    // Require authentication
    const session = await requireAuth();
    
    if (!session) {
      return { success: false, message: "Unauthorized", error: "Authentication required" };
    }
    
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
    // Require authentication
    const session = await requireAuth();
    
    if (!session) {
      return { success: false, message: "Unauthorized", error: "Authentication required" };
    }
    
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
    // Require authentication
    const session = await requireAuth();
    
    if (!session) {
      return { success: false, message: "Unauthorized", error: "Authentication required" };
    }
    
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
    // Require authentication
    const session = await requireAuth();
    
    if (!session) {
      return { success: false, message: "Unauthorized", error: "Authentication required" };
    }
    
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
    // Require authentication
    const session = await requireAuth();
    
    if (!session) {
      return { success: false, message: "Unauthorized", error: "Authentication required" };
    }
    
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
    // Require authentication
    const session = await requireAuth();
    if (!session) {
      return { success: false, message: "Unauthorized", error: "Authentication required" };
    }

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
    // Require authentication
    const session = await requireAuth();
    if (!session) {
      return { success: false, message: "Unauthorized", error: "Authentication required" };
    }

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

// Cycle Rotation Actions
export interface CycleRotationFormData {
  dayOfWeek: number;
  sendHour: number;
  sendMinute: number;
}

export async function updateCycleRotationConfig(data: CycleRotationFormData): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: "Unauthorized" };
    }

    if (data.dayOfWeek < 0 || data.dayOfWeek > 6) {
      return { success: false, message: "Invalid day of week" };
    }

    if (data.sendHour < 0 || data.sendHour > 23 || data.sendMinute < 0 || data.sendMinute > 59) {
      return { success: false, message: "Invalid send time" };
    }

    const config = await upsertCycleRotationConfig({
      dayOfWeek: data.dayOfWeek,
      sendHour: data.sendHour,
      sendMinute: data.sendMinute,
    });

    await recalculateCycleRotationState(config);
    revalidatePath("/settings");

    return { success: true, message: "Cycle rotation updated successfully" };
  } catch (error) {
    console.error("Error updating cycle rotation:", error);
    return {
      success: false,
      message: "Failed to update cycle rotation",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =============================================================================
// EMAIL RECIPIENTS ACTIONS
// =============================================================================

export interface EmailRecipientData {
  email: string;
  name?: string;
}

// Add email recipient
export async function addEmailRecipient(data: EmailRecipientData): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: "Unauthorized" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, message: "Invalid email format" };
    }

    // Check if email already exists
    const existing = await getEmailRecipientByEmail(data.email);
    if (existing) {
      return { success: false, message: "This email is already in the list" };
    }

    const newRecipient = await createEmailRecipient({
      email: data.email.toLowerCase().trim(),
      name: data.name?.trim() || null,
      isActive: true,
    });

    revalidatePath("/settings");
    return {
      success: true,
      message: "Email added successfully",
      data: newRecipient,
    };
  } catch (error) {
    console.error("Error adding email recipient:", error);
    return {
      success: false,
      message: "Failed to add email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get all email recipients
export async function getEmailRecipients(): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: "Unauthorized" };
    }
    const recipients = await getAllEmailRecipients();
    return {
      success: true,
      message: "Email recipients retrieved",
      data: recipients,
    };
  } catch (error) {
    console.error("Error fetching email recipients:", error);
    return {
      success: false,
      message: "Failed to retrieve emails",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Update email recipient
export async function updateEmailRecipientAction(
  id: number,
  data: EmailRecipientData
): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: "Unauthorized" };
    }

    // Validate email format if provided
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return { success: false, message: "Invalid email format" };
      }

      // Check if email already exists (excluding current record)
      const existing = await getEmailRecipientByEmail(data.email);
      if (existing && existing.id !== id) {
        return { success: false, message: "This email is already in the list" };
      }
    }

    const updated = await updateEmailRecipient(id, {
      email: data.email?.toLowerCase().trim(),
      name: data.name?.trim() || null,
    });

    if (!updated) {
      return { success: false, message: "Email recipient not found" };
    }

    revalidatePath("/settings");
    return {
      success: true,
      message: "Email updated successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Error updating email recipient:", error);
    return {
      success: false,
      message: "Failed to update email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Toggle active status
export async function toggleEmailRecipientActiveAction(id: number): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: "Unauthorized" };
    }
    const updated = await toggleEmailRecipientActive(id);

    if (!updated) {
      return { success: false, message: "Email recipient not found" };
    }

    revalidatePath("/settings");
    return {
      success: true,
      message: `Email ${updated.isActive ? "activated" : "deactivated"} successfully`,
      data: updated,
    };
  } catch (error) {
    console.error("Error toggling email recipient status:", error);
    return {
      success: false,
      message: "Failed to toggle email status",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Delete email recipient
export async function deleteEmailRecipientAction(id: number): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: "Unauthorized" };
    }
    await deleteEmailRecipient(id);

    revalidatePath("/settings");
    return {
      success: true,
      message: "Email deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting email recipient:", error);
    return {
      success: false,
      message: "Failed to delete email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
// =============================================================================
// CLASSIFICATION ACTIONS (Lookup Tables)
// =============================================================================

// Common wrapper for lookup actions to reduce boilerplate
async function handleLookupAction(
  actionFn: () => Promise<any>,
  successMsg: string,
  errorMsg: string
): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session) return { success: false, message: "Unauthorized" };

    const result = await actionFn();
    if (!result && successMsg.includes("Toggle")) return { success: false, message: "Item not found" };

    revalidatePath("/settings");
    revalidatePath("/listings"); // Revalidate listings as they use these lookups
    return { success: true, message: successMsg, data: result };
  } catch (error) {
    console.error(`Error in lookup action:`, error);
    return {
      success: false,
      message: errorMsg,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Property Type Actions
export const addPropertyTypeAction = async (name: string) => 
  handleLookupAction(() => createPropertyType(name), "Property type added", "Failed to add property type");

export const updatePropertyTypeAction = async (id: number, name: string) => 
  handleLookupAction(() => updatePropertyType(id, name), "Property type updated", "Failed to update property type");

export const togglePropertyTypeAction = async (id: number) => 
  handleLookupAction(() => togglePropertyType(id), "Property type status toggled", "Failed to toggle status");

export const deletePropertyTypeAction = async (id: number) => 
  handleLookupAction(() => deletePropertyType(id), "Property type deleted", "Failed to delete property type");

// Condition Actions
export const addConditionAction = async (name: string) => 
  handleLookupAction(() => createCondition(name), "Condition added", "Failed to add condition");

export const updateConditionAction = async (id: number, name: string) => 
  handleLookupAction(() => updateCondition(id, name), "Condition updated", "Failed to update condition");

export const toggleConditionAction = async (id: number) => 
  handleLookupAction(() => toggleCondition(id), "Condition status toggled", "Failed to toggle status");

export const deleteConditionAction = async (id: number) => 
  handleLookupAction(() => deleteCondition(id), "Condition deleted", "Failed to delete condition");

// Zoning Actions
export const addZoningAction = async (code: string) => 
  handleLookupAction(() => createZoning(code), "Zoning added", "Failed to add zoning");

export const updateZoningAction = async (id: number, code: string) => 
  handleLookupAction(() => updateZoning(id, code), "Zoning updated", "Failed to update zoning");

export const toggleZoningAction = async (id: number) => 
  handleLookupAction(() => toggleZoning(id), "Zoning status toggled", "Failed to toggle status");

export const deleteZoningAction = async (id: number) => 
  handleLookupAction(() => deleteZoning(id), "Zoning deleted", "Failed to delete zoning");

// Feature Actions
export const addFeatureAction = async (name: string) => 
  handleLookupAction(() => createFeature(name), "Feature added", "Failed to add feature");

export const updateFeatureAction = async (id: number, name: string) => 
  handleLookupAction(() => updateFeature(id, name), "Feature updated", "Failed to update feature");

export const toggleFeatureAction = async (id: number) => 
  handleLookupAction(() => toggleFeature(id), "Feature status toggled", "Failed to toggle status");

export const deleteFeatureAction = async (id: number) => 
  handleLookupAction(() => deleteFeature(id), "Feature deleted", "Failed to delete feature");
