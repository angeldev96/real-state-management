import { NextRequest, NextResponse } from "next/server";
import { getActiveEmailRecipients, getListingsByCycle, getOrCreateCycleRotationConfig, ensureCycleRotationState, advanceCycleRotation, createCycleRun } from "@/lib/db/queries";
import { sendPropertyEmail } from "@/lib/email";

const CYCLE_NAMES: Record<number, string> = {
  1: "Cycle 1",
  2: "Cycle 2",
  3: "Cycle 3",
};

export async function POST(request: NextRequest) {
  const secret = process.env.CYCLE_ROTATION_SECRET;
  const provided = request.headers.get("x-cron-secret");
  const vercelCron = request.headers.get("x-vercel-cron");

  if (secret && provided !== secret && !vercelCron) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = await getOrCreateCycleRotationConfig();
    const state = await ensureCycleRotationState(config);
    const now = new Date();

    if (state.nextRunAt) {
      const nextRun = new Date(state.nextRunAt);
      if (now < nextRun) {
        return NextResponse.json({
          success: true,
          message: "Not time yet",
          data: {
            nextRunAt: state.nextRunAt,
            currentCycle: state.currentCycle,
          },
        });
      }
    }
    const cycleNumber = state.currentCycle as 1 | 2 | 3;

    const recipients = await getActiveEmailRecipients();
    if (recipients.length === 0) {
      await createCycleRun({
        cycleNumber,
        scheduledFor: state.nextRunAt ?? now,
        sentAt: now,
        status: "failed",
        error: "No active recipients",
      });
      return NextResponse.json({ success: false, error: "No active recipients" }, { status: 409 });
    }

    const listings = await getListingsByCycle(cycleNumber);
    if (listings.length === 0) {
      await createCycleRun({
        cycleNumber,
        scheduledFor: state.nextRunAt ?? now,
        sentAt: now,
        status: "failed",
        error: "No listings for this cycle",
      });
      return NextResponse.json({ success: false, error: "No listings for this cycle" }, { status: 409 });
    }

    const emails = recipients.map((recipient) => recipient.email);
    const cycleName = CYCLE_NAMES[cycleNumber] ?? `Cycle ${cycleNumber}`;

    const result = await sendPropertyEmail(emails, {
      cycleNumber,
      listings,
      cycleName,
    });

    if (!result.success) {
      await createCycleRun({
        cycleNumber,
        scheduledFor: state.nextRunAt ?? now,
        sentAt: now,
        status: "failed",
        error: "Email send failed",
      });
      return NextResponse.json({ success: false, error: "Email send failed" }, { status: 500 });
    }

    const updatedState = await advanceCycleRotation(now);

    return NextResponse.json({
      success: true,
      message: `Sent ${cycleName} to ${emails.length} recipients`,
      data: {
        cycleNumber,
        recipientCount: emails.length,
        nextCycle: updatedState.currentCycle,
        nextRunAt: updatedState.nextRunAt,
      },
    });
  } catch (error) {
    console.error("Cycle rotation error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
