"use client";

import React, { useState, useEffect } from "react";
import { Save, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getEmailSettingsAction, updateEmailSettingsAction } from "@/lib/actions";
import type { EmailSettings } from "@/lib/db/schema";

export function EmailTemplateSettings() {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Form state
  const [introText, setIntroText] = useState("");
  const [agentTitle, setAgentTitle] = useState("");
  const [agentName, setAgentName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [agentAddress, setAgentAddress] = useState("");
  const [agentCityStateZip, setAgentCityStateZip] = useState("");
  const [agentPhone1, setAgentPhone1] = useState("");
  const [agentPhone2, setAgentPhone2] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [legalDisclaimer, setLegalDisclaimer] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const result = await getEmailSettingsAction();
      if (result.success && result.data) {
        const data = result.data as EmailSettings;
        setSettings(data);
        setIntroText(data.introText);
        setAgentTitle(data.agentTitle);
        setAgentName(data.agentName);
        setCompanyName(data.companyName);
        setAgentAddress(data.agentAddress);
        setAgentCityStateZip(data.agentCityStateZip);
        setAgentPhone1(data.agentPhone1);
        setAgentPhone2(data.agentPhone2);
        setAgentEmail(data.agentEmail);
        setLegalDisclaimer(data.legalDisclaimer);
      }
    } catch (error) {
      toast.error("Failed to load email settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = () => {
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateEmailSettingsAction({
        introText,
        agentTitle,
        agentName,
        companyName,
        agentAddress,
        agentCityStateZip,
        agentPhone1,
        agentPhone2,
        agentEmail,
        legalDisclaimer,
      });

      if (result.success) {
        toast.success(result.message);
        setHasChanges(false);
        if (result.data) {
          setSettings(result.data as EmailSettings);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save email settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading email settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <FileText className="w-5 h-5 text-primary" />
          Email Template Content
        </CardTitle>
        <CardDescription>
          Customize the introduction text and footer that appear in property emails.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Introduction Text (Centered) */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-base mb-1">Introduction Text</h3>
            <p className="text-sm text-muted-foreground mb-3">
              This text appears at the top of the email, centered above the property listings.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="intro-text">Message</Label>
            <Textarea
              id="intro-text"
              value={introText}
              onChange={(e) => {
                setIntroText(e.target.value);
                handleChange();
              }}
              rows={6}
              placeholder="Enter the introduction message..."
              className="font-mono text-sm"
            />
          </div>
        </div>

        <Separator />

        {/* Footer - Agent Info (Left Aligned) */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-base mb-1">Agent Information</h3>
            <p className="text-sm text-muted-foreground mb-3">
              This information appears in the footer, aligned to the left.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="agent-title">Title</Label>
              <Input
                id="agent-title"
                value={agentTitle}
                onChange={(e) => {
                  setAgentTitle(e.target.value);
                  handleChange();
                }}
                placeholder="Licensed Real Estate Agent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-name">Name</Label>
              <Input
                id="agent-name"
                value={agentName}
                onChange={(e) => {
                  setAgentName(e.target.value);
                  handleChange();
                }}
                placeholder="David Rubin"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-name">Company</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                handleChange();
              }}
              placeholder="Eretz realty"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="agent-address">Address</Label>
              <Input
                id="agent-address"
                value={agentAddress}
                onChange={(e) => {
                  setAgentAddress(e.target.value);
                  handleChange();
                }}
                placeholder="5916 18th Ave"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-city">City, State, ZIP</Label>
              <Input
                id="agent-city"
                value={agentCityStateZip}
                onChange={(e) => {
                  setAgentCityStateZip(e.target.value);
                  handleChange();
                }}
                placeholder="Brooklyn, N.Y. 11204"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="agent-phone1">Phone 1</Label>
              <Input
                id="agent-phone1"
                value={agentPhone1}
                onChange={(e) => {
                  setAgentPhone1(e.target.value);
                  handleChange();
                }}
                placeholder="C-917.930.2028"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-phone2">Phone 2</Label>
              <Input
                id="agent-phone2"
                value={agentPhone2}
                onChange={(e) => {
                  setAgentPhone2(e.target.value);
                  handleChange();
                }}
                placeholder="718.256.9595 X 209"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-email">Email</Label>
            <Input
              id="agent-email"
              type="email"
              value={agentEmail}
              onChange={(e) => {
                setAgentEmail(e.target.value);
                handleChange();
              }}
              placeholder="drubin@eretzltd.com"
            />
          </div>
        </div>

        <Separator />

        {/* Legal Disclaimer (Red Text) */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-base mb-1">Legal Disclaimer</h3>
            <p className="text-sm text-muted-foreground mb-3">
              This notice appears at the bottom of the email in <span className="text-red-600 font-medium">red text</span>.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="legal-disclaimer">Disclaimer Text</Label>
            <Textarea
              id="legal-disclaimer"
              value={legalDisclaimer}
              onChange={(e) => {
                setLegalDisclaimer(e.target.value);
                handleChange();
              }}
              rows={4}
              placeholder="IMPORTANT NOTICE: ..."
              className="font-mono text-sm"
            />
          </div>
        </div>

        <Separator />

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Email Template"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
