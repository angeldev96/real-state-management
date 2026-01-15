"use client";

import { useState } from "react";
import { Save, Calendar, Info, RotateCcw, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { toast } from "sonner";
import { sendTestEmailAction, sendSamplePropertiesEmailAction, updateCycleRotationConfig } from "@/lib/actions";
import type { CycleRotationConfig, CycleRotationState } from "@/lib/db/schema";
import { EmailRecipientsManager } from "@/components/settings/email-recipients-manager";

interface RotationFormData {
  dayOfWeek: number;
  sendTime: string;
}

interface SettingsClientProps {
  rotationConfig: CycleRotationConfig;
  rotationState: CycleRotationState;
}

const DEFAULT_ROTATION: RotationFormData = {
  dayOfWeek: 3,
  sendTime: "00:00",
};

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function SettingsClient({ rotationConfig, rotationState }: SettingsClientProps) {
  const [rotation, setRotation] = useState<RotationFormData>(() => {
    if (rotationConfig) {
      const hour = String(rotationConfig.sendHour).padStart(2, "0");
      const minute = String(rotationConfig.sendMinute).padStart(2, "0");
      return {
        dayOfWeek: rotationConfig.dayOfWeek,
        sendTime: `${hour}:${minute}`,
      };
    }
    return DEFAULT_ROTATION;
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isSendingSample, setIsSendingSample] = useState(false);

  const handleChange = (field: keyof RotationFormData, value: string) => {
    if (field === "dayOfWeek") {
      const numValue = parseInt(value) || 0;
      const clampedValue = Math.max(0, Math.min(6, numValue));
      setRotation((prev) => ({ ...prev, dayOfWeek: clampedValue }));
      setHasChanges(true);
      return;
    }

    setRotation((prev) => ({ ...prev, sendTime: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const [hourStr, minuteStr] = (rotation.sendTime || "00:00").split(":");
      const result = await updateCycleRotationConfig({
        dayOfWeek: rotation.dayOfWeek,
        sendHour: parseInt(hourStr || "0", 10),
        sendMinute: parseInt(minuteStr || "0", 10),
      });
      if (result.success) {
        toast.success(result.message);
        setHasChanges(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update schedule");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setRotation(DEFAULT_ROTATION);
    setHasChanges(true);
  };

  const handleSendTestEmail = async () => {
    if (!testEmail || !testEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSendingTest(true);
    try {
      const result = await sendTestEmailAction(testEmail);
      if (result.success) {
        toast.success(result.message);
        setTestEmail("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to send test email");
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSendSamplePropertiesEmail = async () => {
    if (!testEmail || !testEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSendingSample(true);
    try {
      const result = await sendSamplePropertiesEmailAction(testEmail);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to send sample properties email");
    } finally {
      setIsSendingSample(false);
    }
  };

  const getNextRunLabel = (): string => {
    if (!rotationState?.nextRunAt) return "Not scheduled";
    const next = new Date(rotationState.nextRunAt);
    return next.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      <PageHeader
        title="Schedule Settings"
        description="Configure when each weekly cycle sends emails"
      />

      <div className="grid gap-6 max-w-3xl">
        {/* Email Recipients Manager */}
        <EmailRecipientsManager />

        {/* Test Email Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Mail className="w-5 h-5 text-primary" />
              Test Email Configuration
            </CardTitle>
            <CardDescription>
              Send test emails to verify your Resend configuration and preview the property email template.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="your-email@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSendTestEmail}
                  disabled={isSendingTest || !testEmail}
                  variant="outline"
                  className="flex-1"
                >
                  {isSendingTest ? "Sending..." : "Send Simple Test"}
                </Button>
                <Button
                  onClick={handleSendSamplePropertiesEmail}
                  disabled={isSendingSample || !testEmail}
                  className="flex-1"
                >
                  {isSendingSample ? "Sending..." : "Send Properties Test"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Simple Test:</strong> Basic configuration test email<br />
                <strong>Properties Test:</strong> Sample email with 5 listings from your database
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Schedule Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Calendar className="w-5 h-5 text-primary" />
              Cycle Rotation Schedule
            </CardTitle>
            <CardDescription>
              Configure the weekly rotation. Each Wednesday (or selected day), the system sends
              the next cycle: 1 → 2 → 3 → 1.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 items-start p-4 rounded-lg bg-muted/30 border border-border">
              <div className="space-y-2">
                <Label htmlFor="cycle-day" className="text-base font-semibold">
                  Cycle Send Day
                </Label>
                <p className="text-sm text-muted-foreground">
                  Cycles rotate weekly in order: 1 → 2 → 3 → 1.
                </p>
              </div>
              <div className="space-y-2">
                <Select
                  value={String(rotation.dayOfWeek)}
                  onValueChange={(value) => handleChange("dayOfWeek", value)}
                >
                  <SelectTrigger id="cycle-day">
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAY_LABELS.map((label, index) => (
                      <SelectItem key={label} value={String(index)}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-primary">
                  Next: {getNextRunLabel()}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 items-start p-4 rounded-lg bg-muted/30 border border-border">
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Send Time
                </Label>
                <p className="text-sm text-muted-foreground">
                  Time is based on New York time.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={rotation.sendTime ?? "00:00"}
                  onChange={(e) => handleChange("sendTime", e.target.value)}
                  className="w-32"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-3 rounded-lg bg-background/50 border border-border">
                <p className="text-xs text-muted-foreground">Current Cycle</p>
                <p className="text-lg font-semibold">Cycle {rotationState?.currentCycle ?? 1}</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-border">
                <p className="text-xs text-muted-foreground">Next Send</p>
                <p className="text-sm font-medium">{getNextRunLabel()}</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-border">
                <p className="text-xs text-muted-foreground">Rotation</p>
                <p className="text-sm font-medium">1 → 2 → 3 → 1</p>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-serif">
              <Info className="w-5 h-5 text-primary" />
              How The Cycle Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              The <strong>Cycle System</strong> is the core of Eretz Realty
              marketing strategy. Instead of sending all listings at once, properties
              are distributed across three weekly cycles.
            </p>
            <div className="space-y-2">
              <p className="font-medium">Key Benefits:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Protects your exclusive data from competitors</li>
                <li>Keeps subscribers engaged with regular content</li>
                <li>Allows curated &quot;mixes&quot; of property types per email</li>
                <li>Spreads exposure throughout the month</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-background/50 border border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> If a scheduled day falls on a day that doesn&apos;t
                exist in a month (e.g., Feb 30), the email will be sent on the last
                day of that month instead.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
