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
import { X, Search, Plus, MoreVertical, MoreHorizontal } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type NotificationFrequency = "instant" | "daily" | "weekly" | "never";
type DocumentNotificationScope = "all" | "myProjects" | "custom";
type DocumentCategoryScope = "all" | "custom";

interface NotificationSetting {
  enabled: boolean;
  frequency: NotificationFrequency;
  watchedUsers?: string[];
  documentScope?: DocumentNotificationScope;
  documentCategoryScope?: DocumentCategoryScope;
  selectedCategories?: string[];
}

interface NotificationGroup {
  [key: string]: NotificationSetting;
}

interface NotificationsState {
  [key: string]: NotificationGroup;
}

// Mock data for contractors
const MOCK_CONTRACTORS = [
  "A & A Contracting",
  "ABC Contracting",
  "XYZ Contracting",
  "Best Builders Inc",
  "Quality Construction Co",
  "Elite Contractors LLC",
  "Premier Builders",
  "Master Builders Group",
  "First Class Construction",
  "Top Tier Contractors"
];

export default function NotificationsPage() {
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
        watchedUsers: [],
        documentScope: "all",
        documentCategoryScope: "all",
        selectedCategories: []
      },
      signatureRequests: { enabled: false, frequency: "instant" },
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCategoriesDrawerOpen, setIsCategoriesDrawerOpen] = useState(false);
  const [newUser, setNewUser] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const documentCategories = [
    "Insurance Certificates",
    "Safety Training",
    "Licenses",
    "Certifications",
    "Compliance Documents",
    "Contracts",
    "Other"
  ];

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

  const handleCategoryScopeChange = (category: string, setting: string, scope: DocumentCategoryScope) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: {
          ...prev[category][setting],
          documentCategoryScope: scope,
        },
      },
    }));
  };

  const handleCategoriesDrawerOpen = (category: string, setting: string) => {
    const notification = notifications[category][setting];
    setSelectedCategories(notification.selectedCategories || []);
    setIsCategoriesDrawerOpen(true);
  };

  const handleCategoriesDrawerClose = () => {
    setIsCategoriesDrawerOpen(false);
    setSelectedCategories([]);
  };

  const handleAddCategories = (category: string, setting: string) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: {
          ...prev[category][setting],
          selectedCategories: selectedCategories,
        },
      },
    }));
    toast.success(`${selectedCategories.length} categor${selectedCategories.length === 1 ? 'y' : 'ies'} added to your notification list.`, {
      position: "top-right",
    });
  };

  const toggleCategory = (category: string) => {
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const addWatchedUsers = (category: string, setting: string, users: string[]) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: {
          ...prev[category][setting],
          watchedUsers: [...new Set([...(prev[category][setting].watchedUsers || []), ...users])],
        },
      },
    }));
    setSelectedContractors([]);
    setSearchQuery("");
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

  const filteredContractors = MOCK_CONTRACTORS.filter(contractor =>
    contractor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContractorSelect = (contractor: string) => {
    if (contractor && !selectedContractors.includes(contractor)) {
      setSelectedContractors([...selectedContractors, contractor]);
      setSelectedContractor("");
    }
  };

  const handleAddContractors = (category: string, setting: string) => {
    addWatchedUsers(category, setting, selectedContractors);
    toast.success(`${selectedContractors.length} contractor${selectedContractors.length === 1 ? '' : 's'} added to your notification list.`, {
      position: "top-right",
    });
  };

  const handleDrawerOpen = (category: string, setting: string) => {
    const notification = notifications[category][setting];
    setSelectedContractors(notification.watchedUsers || []);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedContractors([]);
    setSelectedContractor("");
  };

  const renderDocumentScopeSelector = (category: string, setting: string) => {
    const notification = notifications[category][setting];
    if (!notification.enabled || category !== "documents" || setting !== "documentExpirations") return null;

    return (
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="block mb-2 text-base text-zinc-700 font-medium">Receive notifications for...</Label>
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
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="text-sm">Custom</Label>
              </div>
              {notification.documentScope === "custom" && (
                <div className="ml-6">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-sm font-medium">Notify me about these contractors</Label>
                  </div>
                  <Drawer direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger asChild>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-8 text-blue-600 hover:text-blue-800 hover:no-underline px-0"
                        onClick={() => handleDrawerOpen(category, setting)}
                      >
                        {(notification.watchedUsers || []).length > 0 
                          ? `${(notification.watchedUsers || []).length} contractor${(notification.watchedUsers || []).length === 1 ? '' : 's'} selected`
                          : 'Add Contractors'
                        }
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="w-[620px] !max-w-[620px]">
                      <DrawerHeader className="border-b">
                        <div className="flex items-center justify-between">
                          <div>
                            <DrawerTitle>Add Contractors</DrawerTitle>
                            <DrawerDescription>
                              Select contractors to receive notifications for
                            </DrawerDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={handleDrawerClose}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </DrawerHeader>
                      <div className="p-4 flex-1">
                        <div className="flex flex-col gap-4">
                          <Select
                            value={selectedContractor}
                            onValueChange={handleContractorSelect}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a contractor" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredContractors
                                .filter(contractor => 
                                  !selectedContractors.includes(contractor) && 
                                  !notification.watchedUsers?.includes(contractor)
                                )
                                .map((contractor) => (
                                  <SelectItem key={contractor} value={contractor}>
                                    {contractor}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <div className="space-y-2">
                            <div className="space-y-0">
                              {selectedContractors.map((contractor) => (
                                <div key={contractor} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                  <span className="text-sm">{contractor}</span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedContractors(selectedContractors.filter(c => c !== contractor));
                                        }}
                                      >
                                        Remove
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <DrawerFooter className="border-t">
                        <div className="flex justify-end gap-2">
                          <DrawerClose asChild>
                            <Button variant="outline" onClick={handleDrawerClose}>Cancel</Button>
                          </DrawerClose>
                          <DrawerClose asChild>
                            <Button
                              onClick={() => {
                                handleAddContractors(category, setting);
                                handleDrawerClose();
                              }}
                            >
                              Add Selected
                            </Button>
                          </DrawerClose>
                        </div>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </div>
              )}
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label className="block mb-2 text-base text-zinc-700 font-medium">Be notified about...</Label>
          <RadioGroup
            value={notification.documentCategoryScope || "all"}
            onValueChange={(value: DocumentCategoryScope) => 
              handleCategoryScopeChange(category, setting, value)
            }
            className="flex flex-col gap-2 text-zinc-600"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-categories" />
              <Label htmlFor="all-categories" className="text-sm">All Categories</Label>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom-categories" />
                <Label htmlFor="custom-categories" className="text-sm">Custom</Label>
              </div>
              {notification.documentCategoryScope === "custom" && (
                <div className="ml-6">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-sm font-medium">Notify me about these categories</Label>
                  </div>
                  <Drawer direction="right" open={isCategoriesDrawerOpen} onOpenChange={setIsCategoriesDrawerOpen}>
                    <DrawerTrigger asChild>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-8 text-blue-600 hover:text-blue-800 hover:no-underline px-0"
                        onClick={() => handleCategoriesDrawerOpen(category, setting)}
                      >
                        {(notification.selectedCategories || []).length > 0 
                          ? `${(notification.selectedCategories || []).length} categor${(notification.selectedCategories || []).length === 1 ? 'y' : 'ies'} selected`
                          : 'Add Categories'
                        }
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="w-[620px] !max-w-[620px]">
                      <DrawerHeader className="border-b">
                        <div className="flex items-center justify-between">
                          <div>
                            <DrawerTitle>Add Categories</DrawerTitle>
                            <DrawerDescription>
                              Select document categories to receive notifications for
                            </DrawerDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={handleCategoriesDrawerClose}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </DrawerHeader>
                      <div className="p-4 flex-1">
                        <div className="flex flex-col gap-4">
                          <div className="space-y-2">
                            <div className="space-y-0">
                              {documentCategories.map((category) => (
                                <div key={category} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={category}
                                      checked={selectedCategories.includes(category)}
                                      onCheckedChange={() => toggleCategory(category)}
                                    />
                                    <Label htmlFor={category} className="text-sm">{category}</Label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <DrawerFooter className="border-t">
                        <div className="flex justify-end gap-2">
                          <DrawerClose asChild>
                            <Button variant="outline" onClick={handleCategoriesDrawerClose}>Cancel</Button>
                          </DrawerClose>
                          <DrawerClose asChild>
                            <Button
                              onClick={() => {
                                handleAddCategories(category, setting);
                                handleCategoriesDrawerClose();
                              }}
                            >
                              Add Selected
                            </Button>
                          </DrawerClose>
                        </div>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </div>
              )}
            </div>
          </RadioGroup>
        </div>
      </div>
    );
  };

  const renderNotificationItem = (category: string, setting: string, label: string) => {
    const notification = notifications[category][setting];
    
    return (
      <div className="flex flex-col gap-y-2 px-6 py-3 border-b last:border-b-0">
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
