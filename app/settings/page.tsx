"use client";

import { useState } from "react";
import { Save, Calendar, Info, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/page-header";
import { cycleSchedules } from "@/lib/mock-data";
import { toast } from "sonner";

interface ScheduleFormData {
  week1Day: number;
  week2Day: number;
  week3Day: number;
}

export default function SettingsPage() {
  const [schedule, setSchedule] = useState<ScheduleFormData>({
    week1Day: cycleSchedules.find((s) => s.weekNumber === 1)?.dayOfMonth || 1,
    week2Day: cycleSchedules.find((s) => s.weekNumber === 2)?.dayOfMonth || 15,
    week3Day: cycleSchedules.find((s) => s.weekNumber === 3)?.dayOfMonth || 25,
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
              <Button onClick={handleSave} disabled={!hasChanges}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
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
              The <strong>Cycle System</strong> is the core of Eric&apos;s Realty
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
