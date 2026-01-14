"use client";

import { useState, useEffect } from "react";
import { Save, Calendar, Info, RotateCcw, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/page-header";
import { toast } from "sonner";
import { sendTestEmailAction, sendSamplePropertiesEmailAction, updateCycleSchedules } from "@/lib/actions";
import { CycleSchedule } from "@/lib/db/schema";
import { EmailRecipientsManager } from "@/components/settings/email-recipients-manager";

interface ScheduleFormData {
  week1Day: number;
  week2Day: number;
  week3Day: number;
}

interface SettingsClientProps {
  initialSchedules: CycleSchedule[];
}

const DEFAULT_SCHEDULES: ScheduleFormData = {
  week1Day: 1,
  week2Day: 15,
  week3Day: 25,
};

export function SettingsClient({ initialSchedules }: SettingsClientProps) {
  // Initialize from database or use defaults
  const [schedule, setSchedule] = useState<ScheduleFormData>(() => {
    if (initialSchedules.length === 3) {
      return {
        week1Day: initialSchedules.find((s) => s.weekNumber === 1)?.dayOfMonth ?? 1,
        week2Day: initialSchedules.find((s) => s.weekNumber === 2)?.dayOfMonth ?? 15,
        week3Day: initialSchedules.find((s) => s.weekNumber === 3)?.dayOfMonth ?? 25,
      };
    }
    return DEFAULT_SCHEDULES;
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isSendingSample, setIsSendingSample] = useState(false);

  const handleChange = (week: keyof ScheduleFormData, value: string) => {
    const numValue = parseInt(value) || 1;
    const clampedValue = Math.max(1, Math.min(31, numValue));
    setSchedule((prev) => ({ ...prev, [week]: clampedValue }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateCycleSchedules(schedule);
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
    setSchedule(DEFAULT_SCHEDULES);
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

  const getNextDate = (dayOfMonth: number): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    let date = new Date(year, month, dayOfMonth);
    if (date < now) {
      date = new Date(year, month + 1, dayOfMonth);
    }

    return date.toLocaleDateString("en-US", {
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
              Email Cycle Schedule
            </CardTitle>
            <CardDescription>
              Set the day of the month when each cycle&apos;s email blast is triggered.
              The system automatically sends the email at midnight on the specified day.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Week 1 */}
            <div className="grid gap-4 sm:grid-cols-2 items-start p-4 rounded-lg bg-muted/30 border border-border">
              <div className="space-y-2">
                <Label htmlFor="week1" className="text-base font-semibold">
                  Week 1 Cycle
                </Label>
                <p className="text-sm text-muted-foreground">
                  Typically properties for start of month
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="week1"
                    type="number"
                    min={1}
                    max={31}
                    value={schedule.week1Day}
                    onChange={(e) => handleChange("week1Day", e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">
                    day of month
                  </span>
                </div>
                <p className="text-xs text-primary">
                  Next: {getNextDate(schedule.week1Day)}
                </p>
              </div>
            </div>

            {/* Week 2 */}
            <div className="grid gap-4 sm:grid-cols-2 items-start p-4 rounded-lg bg-muted/30 border border-border">
              <div className="space-y-2">
                <Label htmlFor="week2" className="text-base font-semibold">
                  Week 2 Cycle
                </Label>
                <p className="text-sm text-muted-foreground">
                  Mid-month property collection
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="week2"
                    type="number"
                    min={1}
                    max={31}
                    value={schedule.week2Day}
                    onChange={(e) => handleChange("week2Day", e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">
                    day of month
                  </span>
                </div>
                <p className="text-xs text-primary">
                  Next: {getNextDate(schedule.week2Day)}
                </p>
              </div>
            </div>

            {/* Week 3 */}
            <div className="grid gap-4 sm:grid-cols-2 items-start p-4 rounded-lg bg-muted/30 border border-border">
              <div className="space-y-2">
                <Label htmlFor="week3" className="text-base font-semibold">
                  Week 3 Cycle
                </Label>
                <p className="text-sm text-muted-foreground">
                  End of month offerings
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="week3"
                    type="number"
                    min={1}
                    max={31}
                    value={schedule.week3Day}
                    onChange={(e) => handleChange("week3Day", e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">
                    day of month
                  </span>
                </div>
                <p className="text-xs text-primary">
                  Next: {getNextDate(schedule.week3Day)}
                </p>
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
