"use client";

import { useState } from "react";
import { Send, Mail, Users, Building2, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/page-header";
import { toast } from "sonner";
import { sendBatchEmailAction } from "@/lib/actions";
import { BatchEmailList } from "@/components/batch/batch-email-list";

type BatchStatus = "idle" | "sending" | "sent" | "failed";

interface BatchResult {
  sent: number;
  failed: number;
}

interface BatchSendClientProps {
  currentCycle: 1 | 2 | 3;
  listingsCount: number;
  batch1Count: number;
  batch2Count: number;
  totalRecipients: number;
}

export function BatchSendClient({
  currentCycle,
  listingsCount,
  batch1Count,
  batch2Count,
  totalRecipients,
}: BatchSendClientProps) {
  const [batch1Status, setBatch1Status] = useState<BatchStatus>("idle");
  const [batch2Status, setBatch2Status] = useState<BatchStatus>("idle");
  const [batch1Result, setBatch1Result] = useState<BatchResult | null>(null);
  const [batch2Result, setBatch2Result] = useState<BatchResult | null>(null);

  const handleSendBatch = async (batchNumber: 1 | 2) => {
    const setStatus = batchNumber === 1 ? setBatch1Status : setBatch2Status;
    const setResult = batchNumber === 1 ? setBatch1Result : setBatch2Result;

    setStatus("sending");
    setResult(null);

    try {
      const result = await sendBatchEmailAction(batchNumber, currentCycle);

      if (result.success) {
        setStatus("sent");
        const data = result.data as BatchResult;
        setResult(data);
        toast.success(result.message);
      } else {
        setStatus("failed");
        if (result.data) {
          setResult(result.data as BatchResult);
        }
        toast.error(result.message);
      }
    } catch {
      setStatus("failed");
      toast.error(`Failed to send Batch ${batchNumber}`);
    }
  };

  return (
    <div>
      <PageHeader
        title="Batch Email Send"
        description="Manually send property listing emails in batches to your recipient list"
      />

      <div className="grid gap-6 max-w-4xl">
        {/* Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Mail className="w-5 h-5 text-primary" />
              Send Overview
            </CardTitle>
            <CardDescription>
              Current email campaign status and configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Send className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Current Cycle</p>
                </div>
                <p className="text-2xl font-semibold">Cycle {currentCycle}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Listings in Cycle</p>
                </div>
                <p className="text-2xl font-semibold">{listingsCount}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Total Recipients</p>
                </div>
                <p className="text-2xl font-semibold">{totalRecipients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Batch Cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Batch 1 */}
          <BatchCard
            batchNumber={1}
            recipientCount={batch1Count}
            status={batch1Status}
            result={batch1Result}
            currentCycle={currentCycle}
            listingsCount={listingsCount}
            onSend={() => handleSendBatch(1)}
          />

          {/* Batch 2 */}
          <BatchCard
            batchNumber={2}
            recipientCount={batch2Count}
            status={batch2Status}
            result={batch2Result}
            currentCycle={currentCycle}
            listingsCount={listingsCount}
            onSend={() => handleSendBatch(2)}
          />
        </div>

        <Separator />

        {/* Email List Manager */}
        <BatchEmailList />
      </div>
    </div>
  );
}

interface BatchCardProps {
  batchNumber: 1 | 2;
  recipientCount: number;
  status: BatchStatus;
  result: BatchResult | null;
  currentCycle: 1 | 2 | 3;
  listingsCount: number;
  onSend: () => void;
}

function BatchCard({
  batchNumber,
  recipientCount,
  status,
  result,
  currentCycle,
  listingsCount,
  onSend,
}: BatchCardProps) {
  const startIndex = (batchNumber - 1) * 500 + 1;
  const endIndex = startIndex + recipientCount - 1;

  return (
    <Card className={status === "sent" ? "border-green-500/50 bg-green-50/30" : status === "failed" ? "border-red-500/50 bg-red-50/30" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-serif">
          <span className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Batch {batchNumber}
          </span>
          <StatusBadge status={status} />
        </CardTitle>
        <CardDescription>
          Recipients {startIndex} - {endIndex} ({recipientCount} emails)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recipients</span>
            <span className="font-medium">{recipientCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Content</span>
            <span className="font-medium">Cycle {currentCycle} ({listingsCount} listings)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Method</span>
            <span className="font-medium">BCC (private)</span>
          </div>
        </div>

        {result && (
          <div className="p-3 rounded-lg bg-muted/50 border text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sent</span>
              <span className="font-medium text-green-600">{result.sent}</span>
            </div>
            {result.failed > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Failed</span>
                <span className="font-medium text-red-600">{result.failed}</span>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={onSend}
          disabled={status === "sending" || recipientCount === 0}
          className="w-full"
          variant={status === "sent" ? "outline" : "default"}
        >
          {status === "sending" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : status === "sent" ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Resend Batch {batchNumber}
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Batch {batchNumber}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: BatchStatus }) {
  switch (status) {
    case "idle":
      return (
        <span className="text-xs font-normal px-2 py-1 rounded-full bg-muted text-muted-foreground">
          Pending
        </span>
      );
    case "sending":
      return (
        <span className="text-xs font-normal px-2 py-1 rounded-full bg-blue-100 text-blue-700">
          Sending...
        </span>
      );
    case "sent":
      return (
        <span className="text-xs font-normal px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Sent
        </span>
      );
    case "failed":
      return (
        <span className="text-xs font-normal px-2 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Failed
        </span>
      );
  }
}
