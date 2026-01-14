"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Mail, Check, X, Edit2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  addEmailRecipient,
  getEmailRecipients,
  deleteEmailRecipientAction,
  toggleEmailRecipientActiveAction,
  updateEmailRecipientAction,
} from "@/lib/actions";
import type { EmailRecipient } from "@/lib/db/schema";

export function EmailRecipientsManager() {
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    setIsLoading(true);
    try {
      const result = await getEmailRecipients();
      if (result.success && result.data) {
        setRecipients(result.data as EmailRecipient[]);
      }
    } catch (error) {
      toast.error("Failed to load email recipients");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsAdding(true);
    try {
      const result = await addEmailRecipient({ email, name: name || undefined });
      if (result.success) {
        toast.success(result.message);
        setEmail("");
        setName("");
        await loadRecipients();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to add email");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this email from the list?")) {
      return;
    }

    try {
      const result = await deleteEmailRecipientAction(id);
      if (result.success) {
        toast.success(result.message);
        await loadRecipients();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete email");
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      const result = await toggleEmailRecipientActiveAction(id);
      if (result.success) {
        toast.success(result.message);
        await loadRecipients();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to toggle email status");
    }
  };

  const startEditing = (recipient: EmailRecipient) => {
    setEditingId(recipient.id);
    setEditEmail(recipient.email);
    setEditName(recipient.name || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditEmail("");
    setEditName("");
  };

  const handleUpdate = async (id: number) => {
    if (!editEmail || !editEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const result = await updateEmailRecipientAction(id, {
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
    } catch (error) {
      toast.error("Failed to update email");
    }
  };

  const activeCount = recipients.filter((r) => r.isActive).length;
  const totalCount = recipients.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-serif">
          <span className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Email Distribution List
          </span>
          <Badge variant="secondary">
            {activeCount} / {totalCount} Active
          </Badge>
        </CardTitle>
        <CardDescription>
          Manage the list of email addresses that will receive property listings.
          Only active emails will receive the scheduled emails.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Email Form */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-4">
          <h3 className="font-semibold text-sm">Add New Recipient</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-email">Email Address *</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-name">Name (Optional)</Label>
              <Input
                id="new-name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
              />
            </div>
          </div>
          <Button onClick={handleAdd} disabled={isAdding || !email} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            {isAdding ? "Adding..." : "Add Email"}
          </Button>
        </div>

        {/* Email List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Recipients ({totalCount})</h3>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : recipients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No email recipients yet. Add your first recipient above.
            </div>
          ) : (
            <div className="space-y-2">
              {recipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    recipient.isActive
                      ? "bg-background border-border"
                      : "bg-muted/50 border-muted-foreground/20"
                  }`}
                >
                  {editingId === recipient.id ? (
                    // Edit Mode
                    <div className="flex-1 grid gap-2 sm:grid-cols-2 mr-2">
                      <Input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="text-sm"
                      />
                      <Input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Name (optional)"
                        className="text-sm"
                      />
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            !recipient.isActive && "text-muted-foreground line-through"
                          }`}
                        >
                          {recipient.email}
                        </span>
                        {!recipient.isActive && (
                          <Badge variant="outline" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      {recipient.name && (
                        <p className="text-sm text-muted-foreground">{recipient.name}</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    {editingId === recipient.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdate(recipient.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelEditing}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(recipient)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleActive(recipient.id)}
                          className="h-8 w-8 p-0"
                        >
                          {recipient.isActive ? (
                            <X className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(recipient.id)}
                          className="h-8 w-8 p-0"
                        >
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

        {recipients.length > 0 && (
          <div className="p-3 rounded-lg bg-background/50 border border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Tip:</strong> You can deactivate recipients without deleting them. Inactive emails
              won&apos;t receive scheduled emails but can be reactivated at any time.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
