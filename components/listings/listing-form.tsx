"use client";

import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { ListingFormData, ListingWithRelations, PropertyType, Condition, Zoning, Feature } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ListingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing?: ListingWithRelations | null;
  onSubmit: (data: ListingFormData) => void;
  propertyTypes: PropertyType[];
  conditions: Condition[];
  zonings: Zoning[];
  features: Feature[];
}

const defaultFormData: ListingFormData = {
  address: "",
  locationDescription: "",
  dimensions: "",
  rooms: "",
  squareFootage: "",
  price: "",
  onMarket: true, // New property (shows NEW badge)
  isActive: true, // Active in system
  cycleGroup: 1,
  propertyTypeId: "",
  conditionId: "",
  zoningId: "",
  featureIds: [],
};

export function ListingForm({
  open,
  onOpenChange,
  listing,
  onSubmit,
  propertyTypes,
  conditions,
  zonings,
  features,
}: ListingFormProps) {
  const [formData, setFormData] = useState<ListingFormData>(defaultFormData);
  const isEditing = !!listing;

  useEffect(() => {
    if (listing) {
      setFormData({
        address: listing.address,
        locationDescription: listing.locationDescription || "",
        dimensions: listing.dimensions || "",
        rooms: listing.rooms?.toString() || "",
        squareFootage: listing.squareFootage?.toString() || "",
        price: listing.price?.toString() || "",
        onMarket: listing.onMarket,
        isActive: listing.isActive,
        cycleGroup: listing.cycleGroup,
        propertyTypeId: listing.propertyTypeId?.toString() || "",
        conditionId: listing.conditionId?.toString() || "",
        zoningId: listing.zoningId?.toString() || "",
        featureIds: listing.featureIds,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [listing, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  const featureOptions = features.map((f) => ({
    value: f.id.toString(),
    label: f.name,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {isEditing ? "Edit Listing" : "New Listing"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the property details below."
              : "Add a new property to the system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Location
            </h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="e.g., 1634 59th St"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="locationDescription">
                    Location Description
                  </Label>
                  <Input
                    id="locationDescription"
                    value={formData.locationDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        locationDescription: e.target.value,
                      })
                    }
                    placeholder="e.g., Low 60's/18"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dimensions">Lot Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) =>
                      setFormData({ ...formData, dimensions: e.target.value })
                    }
                    placeholder="e.g., 16x63 on 24x100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Property Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="e.g., 2700000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rooms">Rooms</Label>
                <Input
                  id="rooms"
                  type="number"
                  step="0.5"
                  value={formData.rooms}
                  onChange={(e) =>
                    setFormData({ ...formData, rooms: e.target.value })
                  }
                  placeholder="e.g., 5"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="squareFootage">Square Footage</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  value={formData.squareFootage}
                  onChange={(e) =>
                    setFormData({ ...formData, squareFootage: e.target.value })
                  }
                  placeholder="e.g., 2600"
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Classification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Property Type</Label>
                <Select
                  value={formData.propertyTypeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, propertyTypeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Condition</Label>
                <Select
                  value={formData.conditionId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, conditionId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem
                        key={condition.id}
                        value={condition.id.toString()}
                      >
                        {condition.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Zoning</Label>
                <Select
                  value={formData.zoningId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, zoningId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select zoning" />
                  </SelectTrigger>
                  <SelectContent>
                    {zonings.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id.toString()}>
                        {zone.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Features
            </h3>
            <MultiSelect
              options={featureOptions}
              selected={formData.featureIds.map((id) => id.toString())}
              onChange={(selected) =>
                setFormData({
                  ...formData,
                  featureIds: selected.map((s) => parseInt(s)),
                })
              }
              placeholder="Select features..."
            />
          </div>

          {/* Cycle Assignment */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Email Cycle Assignment
            </h3>
            <div className="flex gap-2">
              {([1, 2, 3] as const).map((week) => (
                <Button
                  key={week}
                  type="button"
                  variant={formData.cycleGroup === week ? "default" : "outline"}
                  className={cn(
                    "flex-1 h-14 flex-col",
                    formData.cycleGroup === week &&
                      "bg-primary hover:bg-primary/90"
                  )}
                  onClick={() => setFormData({ ...formData, cycleGroup: week })}
                >
                  <span className="font-semibold">Week {week}</span>
                  <span className="text-xs opacity-70">
                    {week === 1 ? "1st" : week === 2 ? "15th" : "25th"} of month
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Status Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
              <div className="space-y-0.5">
                <Label htmlFor="onMarket" className="text-base font-medium">
                  New Property (On Market)
                </Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, displays &quot;NEW LISTING&quot; badge in emails. 
                  Disable when property is no longer new but still for sale.
                </p>
              </div>
              <Switch
                id="onMarket"
                checked={formData.onMarket}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, onMarket: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-base font-medium">
                  Active Status
                </Label>
                <p className="text-sm text-muted-foreground">
                  Active = Property is in the system. Archived = Removed from active listings.
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? "Save Changes" : "Create Listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
