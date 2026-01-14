"use client";

import { useState } from "react";
import { Save, Calendar, Info, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/page-header";
import { toast } from "sonner";

interface ScheduleFormData {
  week1Day: number;
  week2Day: number;
  week3Day: number;
}

export default function SettingsClientPage() {
  // Default schedule values
  const [schedule, setSchedule] = useState<ScheduleFormData>({
    week1Day: 1,
    week2Day: 15,
    week3Day: 25,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (week: keyof ScheduleFormData, value: string) => {
    const numValue = parseInt(value) || 1;
    const clampedValue = Math.max(1, Math.min(31, numValue));
    setSchedule((prev) => ({ ...prev, [week]: clampedValue }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In real app, this would call an API
    console.log("Saving schedule:", schedule);
    toast.success("Schedule updated successfully");
    setHasChanges(false);
  };

  const handleReset = () => {
    setSchedule({
      week1Day: 1,
      week2Day: 15,
      week3Day: 25,
    });
    setHasChanges(true);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your email campaign schedule and system preferences"
      />

      <div className="max-w-4xl space-y-6">
        {/* Email Schedule Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Email Campaign Schedule</CardTitle>
            </div>
            <CardDescription>
              Set the days of the month when each weekly cycle should send emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="week1">Week 1 - Day of Month</Label>
                <Input
                  id="week1"
                  type="number"
                  min="1"
                  max="31"
                  value={schedule.week1Day}
                  onChange={(e) => handleChange("week1Day", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Typically day 1-10</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="week2">Week 2 - Day of Month</Label>
                <Input
                  id="week2"
                  type="number"
                  min="1"
                  max="31"
                  value={schedule.week2Day}
                  onChange={(e) => handleChange("week2Day", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Typically day 11-20</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="week3">Week 3 - Day of Month</Label>
                <Input
                  id="week3"
                  type="number"
                  min="1"
                  max="31"
                  value={schedule.week3Day}
                  onChange={(e) => handleChange("week3Day", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Typically day 21-31</p>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-blue-900">Schedule Configuration Tips</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Emails are sent automatically on the configured days</li>
                    <li>Each cycle group rotates through the month</li>
                    <li>Choose days that don&apos;t overlap with holidays or weekends</li>
                    <li>Changes take effect immediately for upcoming sends</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>

              <Button onClick={handleSave} disabled={!hasChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Future Settings Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
            <CardDescription>Configure email templates and sender settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Manage system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
