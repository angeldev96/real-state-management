import { requireAuth } from "@/lib/auth/require-auth";
import {
  getOrCreateCycleRotationConfig,
  ensureCycleRotationState,
  getListingsByCycle,
} from "@/lib/db/queries";
import { getBatchRecipients, getTotalRecipients } from "@/lib/batch-emails";
import { BatchSendClient } from "./batch-send-client";

export const dynamic = "force-dynamic";

export default async function BatchSendPage() {
  await requireAuth();

  const config = await getOrCreateCycleRotationConfig();
  const state = await ensureCycleRotationState(config);
  const cycleNumber = state.currentCycle as 1 | 2 | 3;
  const listings = await getListingsByCycle(cycleNumber);

  const batch1Recipients = getBatchRecipients(1);
  const batch2Recipients = getBatchRecipients(2);
  const totalRecipients = getTotalRecipients();

  return (
    <BatchSendClient
      currentCycle={cycleNumber}
      listingsCount={listings.length}
      batch1Count={batch1Recipients.length}
      batch2Count={batch2Recipients.length}
      totalRecipients={totalRecipients}
    />
  );
}
