"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Check, X, RotateCcw, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LookupItem {
  id: number;
  name?: string;
  code?: string;
  isActive: boolean;
}

interface LookupManagerProps {
  title: string;
  items: LookupItem[];
  onAdd: (value: string) => Promise<any>;
  onUpdate: (id: number, value: string) => Promise<any>;
  onToggle: (id: number) => Promise<any>;
  onDelete: (id: number) => Promise<any>;
  label: string; // "Name" or "Code"
  isCode?: boolean;
}

export function LookupManager({
  title,
  items,
  onAdd,
  onUpdate,
  onToggle,
  onDelete,
  label,
  isCode = false,
}: LookupManagerProps) {
  const [newValue, setNewValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!newValue.trim()) return;
    setIsLoading(true);
    try {
      const result = await onAdd(newValue.trim());
      if (result.success) {
        toast.success(result.message);
        setNewValue("");
        setIsAdding(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editValue.trim()) return;
    setIsLoading(true);
    try {
      const result = await onUpdate(id, editValue.trim());
      if (result.success) {
        toast.success(result.message);
        setEditingId(null);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const result = await onToggle(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This might affect existing listings.")) return;
    try {
      const result = await onDelete(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold font-serif">{title}</h3>
        {!isAdding && (
          <Button size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add {title}
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-primary/30 bg-primary/5">
          <Input
            placeholder={`Enter ${label.toLowerCase()}...`}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1"
            autoFocus
          />
          <Button size="sm" onClick={handleAdd} disabled={isLoading || !newValue.trim()}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{label}</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                  No {title.toLowerCase()} found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} className={cn(!item.isActive && "opacity-60 bg-muted/20")}>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-8"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium">{isCode ? item.code : item.name}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? "default" : "secondary"}>
                      {item.isActive ? "Active" : "Archived"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {editingId === item.id ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-green-600"
                            onClick={() => handleUpdate(item.id)}
                            disabled={isLoading}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingId(item.id);
                              setEditValue(isCode ? (item.code || "") : (item.name || ""));
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn("h-8 w-8", item.isActive ? "text-amber-600" : "text-green-600")}
                            onClick={() => handleToggle(item.id)}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
