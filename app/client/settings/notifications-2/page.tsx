"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type NotificationFrequency = "instant" | "daily" | "weekly" | "never";
type DocumentNotificationScope = "all" | "myProjects" | "custom";

interface NotificationSetting {
  enabled: boolean;
  frequency: NotificationFrequency;
  watchedUsers?: string[];
  documentScope?: DocumentNotificationScope;
}

interface NotificationGroup {
  [key: string]: NotificationSetting;
}

interface NotificationsState {
  [key: string]: NotificationGroup;
}

export default function NotificationsPage() {
  const [newUser, setNewUser] = useState<string>("");
  const [notifications, setNotifications] = useState<NotificationsState>({
    company: {
      newAnnouncements: { enabled: true, frequency: "instant" },
      policyUpdates: { enabled: true, frequency: "daily" },
      teamUpdates: { enabled: false, frequency: "weekly" },
    },
    safety: {
      incidentReports: { enabled: true, frequency: "instant" },
      safetyTraining: { enabled: true, frequency: "daily" },
      emergencyAlerts: { enabled: true, frequency: "instant" },
    },
    finance: {
      payrollUpdates: { enabled: true, frequency: "daily" },
      expenseApprovals: { enabled: false, frequency: "instant" },
      budgetChanges: { enabled: true, frequency: "weekly" },
    },
    documents: {
      newDocuments: { enabled: true, frequency: "instant" },
      documentExpirations: { 
        enabled: true, 
        frequency: "daily", 
        watchedUsers: ["A & A Contracting", "ABC Contracting", "XYZ Contracting"],
        documentScope: "all"
      },
      signatureRequests: { enabled: false, frequency: "instant" },
    },
  });

  const handleToggle = (category: string, setting: string) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: {
          ...prev[category][setting],
          enabled: !prev[category][setting].enabled,
        },
      },
    }));
  };

  const handleFrequencyChange = (category: string, setting: string, frequency: NotificationFrequency) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: {
          ...prev[category][setting],
          frequency,
        },
      },
    }));
  };

  const handleScopeChange = (category: string, setting: string, scope: DocumentNotificationScope) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: {
          ...prev[category][setting],
          documentScope: scope,
        },
      },
    }));
  };

  const addWatchedUser = (category: string, setting: string, user: string) => {
    if (!user.trim()) return;
    
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: {
          ...prev[category][setting],
          watchedUsers: [...(prev[category][setting].watchedUsers || []), user.trim()],
        },
      },
    }));
    setNewUser("");
  };

  const removeWatchedUser = (category: string, setting: string, userToRemove: string) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: {
          ...prev[category][setting],
          watchedUsers: (prev[category][setting].watchedUsers || []).filter(
            (user) => user !== userToRemove
          ),
        },
      },
    }));
  };

  const renderWatchedUsersSection = (category: string, setting: string) => {
    const notification = notifications[category][setting];
    if (!notification.enabled || notification.documentScope !== "custom") return null;

    return (
      <div className="mt-4">
        <Label className="block mb-2 text-base text-zinc-700 font-medium">Notify me about these contractors</Label>
        <div className="mb-2 flex flex-wrap gap-2">
          {(notification.watchedUsers || []).map((user) => (
            <div key={user} className="flex items-center bg-zinc-100 text-zinc-800 px-2 py-1 rounded-md">
              <span className="text-sm">{user}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 ml-1"
                onClick={() => removeWatchedUser(category, setting, user)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            className="h-8"
            placeholder="Add contractor"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addWatchedUser(category, setting, newUser);
              }
            }}
          />
          <Button
            size="sm"
            onClick={() => addWatchedUser(category, setting, newUser)}
          >
            Add
          </Button>
        </div>
      </div>
    );
  };

  const renderDocumentScopeSelector = (category: string, setting: string) => {
    const notification = notifications[category][setting];
    if (!notification.enabled || category !== "documents" || setting !== "documentExpirations") return null;

    return (
      <div className="mt-4 ">
        <Label className="block mb-2 text-base text-zinc-700 font-medium">Recieve notifications for...</Label>
        <RadioGroup
          value={notification.documentScope || "all"}
          onValueChange={(value: DocumentNotificationScope) => 
            handleScopeChange(category, setting, value)
          }
          className="flex flex-col gap-2 text-zinc-600"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="text-sm">All Contractors</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="myProjects" id="myProjects" />
            <Label htmlFor="myProjects" className="text-sm">Contractors on my projects</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="text-sm">Custom list</Label>
          </div>
        </RadioGroup>
      </div>
    );
  };

  const renderNotificationItem = (category: string, setting: string, label: string) => {
    const notification = notifications[category][setting];
    
    return (
      <div className="flex flex-col px-6 py-3 border-b last:border-b-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Label className="text-base font-medium">{label}</Label>
          </div>
          <div className="flex items-center gap-4">

          <div className="flex items-center gap-2">
              <Label className="text-sm text-zinc-600">Notification Center</Label>
              <Switch
                checked={notification.enabled}
                onCheckedChange={() => handleToggle(category, setting)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-zinc-600">Email</Label>
              <Select
                value={notification.frequency}
                onValueChange={(value: NotificationFrequency) => 
                  handleFrequencyChange(category, setting, value)
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {renderDocumentScopeSelector(category, setting)}
        {renderWatchedUsersSection(category, setting)}
      </div>
    );
  };

  return (
    <div className="py-8 max-w-screen-xl">
      <Accordion type="single" collapsible className="w-full flex flex-col gap-6">
        <AccordionItem 
          className="border border-zinc-200 rounded-lg transition-shadow"
          value="company"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-lg font-semibold">Company Notifications</span>
          </AccordionTrigger>
          <AccordionContent>
            {renderNotificationItem("company", "newAnnouncements", "New Announcements")}
            {renderNotificationItem("company", "policyUpdates", "Policy Updates")}
            {renderNotificationItem("company", "teamUpdates", "Team Updates")}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          className="border border-zinc-200 rounded-lg transition-shadow"
          value="safety"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-lg font-semibold">Safety Notifications</span>
          </AccordionTrigger>
          <AccordionContent>
            {renderNotificationItem("safety", "incidentReports", "Incident Reports")}
            {renderNotificationItem("safety", "safetyTraining", "Safety Training")}
            {renderNotificationItem("safety", "emergencyAlerts", "Emergency Alerts")}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          className="border border-zinc-200 rounded-lg transition-shadow"
          value="finance"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-lg font-semibold">Finance Notifications</span>
          </AccordionTrigger>
          <AccordionContent>
            {renderNotificationItem("finance", "payrollUpdates", "Payroll Updates")}
            {renderNotificationItem("finance", "expenseApprovals", "Expense Approvals")}
            {renderNotificationItem("finance", "budgetChanges", "Budget Changes")}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem 
          className="border border-zinc-200 rounded-lg transition-shadow border-b!"
          value="documents"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-lg font-semibold">Document Notifications</span>
          </AccordionTrigger>
          <AccordionContent>
            {renderNotificationItem("documents", "newDocuments", "New Documents")}
            {renderNotificationItem("documents", "documentExpirations", "Contractor document expires")}
            {renderNotificationItem("documents", "signatureRequests", "Signature Requests")}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
