"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Mail, Check, X, Edit2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  getBatchEmailsAction,
  addBatchEmailAction,
  updateBatchEmailAction,
  deleteBatchEmailAction,
} from "@/lib/actions";
import type { BatchRecipient } from "@/lib/batch-emails";

const PAGE_SIZE = 25;

export function BatchEmailList() {
  const [recipients, setRecipients] = useState<BatchRecipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Add form
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Edit state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    setIsLoading(true);
    try {
      const result = await getBatchEmailsAction();
      if (result.success && result.data) {
        setRecipients(result.data as BatchRecipient[]);
      }
    } catch {
      toast.error("Failed to load emails");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter + paginate
  const filtered = useMemo(() => {
    if (!search.trim()) return recipients.map((r, i) => ({ ...r, originalIndex: i }));
    const q = search.toLowerCase();
    return recipients
      .map((r, i) => ({ ...r, originalIndex: i }))
      .filter((r) => r.email.toLowerCase().includes(q) || (r.name && r.name.toLowerCase().includes(q)));
  }, [recipients, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleAdd = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsAdding(true);
    try {
      const result = await addBatchEmailAction({ email: newEmail, name: newName || undefined });
      if (result.success) {
        toast.success(result.message);
        setNewEmail("");
        setNewName("");
        await loadRecipients();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to add email");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (originalIndex: number) => {
    if (!confirm("Are you sure you want to remove this email?")) return;
    try {
      const result = await deleteBatchEmailAction(originalIndex);
      if (result.success) {
        toast.success(result.message);
        await loadRecipients();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to delete email");
    }
  };

  const startEditing = (originalIndex: number, recipient: BatchRecipient) => {
    setEditingIndex(originalIndex);
    setEditEmail(recipient.email);
    setEditName(recipient.name || "");
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditEmail("");
    setEditName("");
  };

  const handleUpdate = async () => {
    if (editingIndex === null) return;
    if (!editEmail || !editEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const result = await updateBatchEmailAction(editingIndex, {
        email: editEmail,
        name: editName || undefined,
      });
      if (result.success) {
        toast.success(result.message);
        cancelEditing();
        await loadRecipients();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to update email");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-serif">
          <span className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Email Recipients List
          </span>
          <Badge variant="secondary">{recipients.length} Total</Badge>
        </CardTitle>
        <CardDescription>
          View and manage the email addresses in your batch send list. Emails 1-500 go to Batch 1, 501-1000 go to Batch 2.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Email */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-4">
          <h3 className="font-semibold text-sm">Add New Email</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="batch-new-email">Email Address *</Label>
              <Input
                id="batch-new-email"
                type="email"
                placeholder="email@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch-new-name">Name (Optional)</Label>
              <Input
                id="batch-new-name"
                type="text"
                placeholder="John Doe"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
              />
            </div>
          </div>
          <Button onClick={handleAdd} disabled={isAdding || !newEmail} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            {isAdding ? "Adding..." : "Add Email"}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">
              {search ? `Results: ${filtered.length}` : `All Recipients (${recipients.length})`}
            </h3>
            {filtered.length > 0 && (
              <span className="text-xs text-muted-foreground">
                Showing {(safeCurrentPage - 1) * PAGE_SIZE + 1}-{Math.min(safeCurrentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {search ? "No emails match your search." : "No emails in the list yet."}
            </div>
          ) : (
            <div className="space-y-2">
              {paginated.map((recipient) => (
                <div
                  key={recipient.originalIndex}
                  className="flex items-center justify-between p-3 rounded-lg border bg-background border-border"
                >
                  {editingIndex === recipient.originalIndex ? (
                    <div className="flex-1 grid gap-2 sm:grid-cols-2 mr-2">
                      <Input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="text-sm"
                        onKeyDown={(e) => { if (e.key === "Enter") handleUpdate(); if (e.key === "Escape") cancelEditing(); }}
                      />
                      <Input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Name (optional)"
                        className="text-sm"
                        onKeyDown={(e) => { if (e.key === "Enter") handleUpdate(); if (e.key === "Escape") cancelEditing(); }}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono w-8 shrink-0">
                          #{recipient.originalIndex + 1}
                        </span>
                        <span className="font-medium truncate">{recipient.email}</span>
                        {recipient.originalIndex < 500 ? (
                          <Badge variant="outline" className="text-xs shrink-0">B1</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs shrink-0">B2</Badge>
                        )}
                      </div>
                      {recipient.name && (
                        <p className="text-sm text-muted-foreground ml-10">{recipient.name}</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    {editingIndex === recipient.originalIndex ? (
                      <>
                        <Button size="sm" variant="ghost" onClick={handleUpdate} className="h-8 w-8 p-0">
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-8 w-8 p-0">
                          <X className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => startEditing(recipient.originalIndex, recipient)} className="h-8 w-8 p-0">
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(recipient.originalIndex)} className="h-8 w-8 p-0">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {safeCurrentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
