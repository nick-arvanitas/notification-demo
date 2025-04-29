'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, MoreHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type NotificationFrequency = 'instant' | 'daily' | 'weekly' | 'never';
type DocumentNotificationScope = 'all' | 'myProjects' | 'custom' | 'none';
type DocumentCategoryScope = 'all' | 'custom';
type DocumentCategoryNotificationTime =
  | 'onExpiration'
  | '7days'
  | '14days'
  | '30days'
  | '90days'
  | 'custom';

interface NotificationSetting {
  enabled: boolean;
  frequency: NotificationFrequency;
  watchedUsers?: string[];
  documentScope?: DocumentNotificationScope;
  documentCategoryScope?: DocumentCategoryScope;
  selectedCategories?: string[];
  categoryNotificationTimes?: Record<
    string,
    DocumentCategoryNotificationTime[]
  >;
  categoryCustomDates?: Record<string, Date[]>;
}

interface NotificationGroup {
  [key: string]: NotificationSetting;
}

interface NotificationsState {
  [key: string]: NotificationGroup;
}

// Mock data for contractors
const MOCK_CONTRACTORS = [
  'A & A Contracting',
  'ABC Contracting',
  'XYZ Contracting',
  'Best Builders Inc',
  'Quality Construction Co',
  'Elite Contractors LLC',
  'Premier Builders',
  'Master Builders Group',
  'First Class Construction',
  'Top Tier Contractors',
];

const documentCategories = [
  'Insurance Certificates',
  'Safety Training',
  'Licenses',
  'Certifications',
  'Compliance Documents',
  'Contracts',
  'Other',
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationsState>({
    company: {
      newAnnouncements: { enabled: true, frequency: 'instant' },
      policyUpdates: { enabled: true, frequency: 'daily' },
      teamUpdates: { enabled: false, frequency: 'weekly' },
    },
    safety: {
      incidentReports: { enabled: true, frequency: 'instant' },
      safetyTraining: { enabled: true, frequency: 'daily' },
      emergencyAlerts: { enabled: true, frequency: 'instant' },
    },
    finance: {
      payrollUpdates: { enabled: true, frequency: 'daily' },
      expenseApprovals: { enabled: false, frequency: 'instant' },
      budgetChanges: { enabled: true, frequency: 'weekly' },
    },
    documents: {
      newDocuments: { enabled: true, frequency: 'instant' },
      documentExpired: { enabled: true, frequency: 'instant' },
      documentExpirations: {
        enabled: true,
        frequency: 'daily',
        watchedUsers: [],
        documentScope: 'all',
        documentCategoryScope: 'all',
        selectedCategories: documentCategories,
      },
      signatureRequests: { enabled: false, frequency: 'instant' },
    },
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCategoriesDrawerOpen, setIsCategoriesDrawerOpen] = useState(false);
  const [newUser, setNewUser] = useState<string>('');

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(documentCategories);
  const [categoryNotificationTimes, setCategoryNotificationTimes] = useState<
    Record<string, DocumentCategoryNotificationTime[]>
  >(
    documentCategories.reduce(
      (acc, category) => ({
        ...acc,
        [category]: ['onExpiration'],
      }),
      {},
    ),
  );

  const [categoryCustomDates, setCategoryCustomDates] = useState<
    Record<string, Date[]>
  >(
    documentCategories.reduce(
      (acc, category) => ({
        ...acc,
        [category]: [],
      }),
      {},
    ),
  );

  // Add state for each instance of document scope selector
  const [companyDrawerOpen, setCompanyDrawerOpen] = useState(false);
  const [safetyDrawerOpen, setSafetyDrawerOpen] = useState(false);
  const [financeDrawerOpen, setFinanceDrawerOpen] = useState(false);
  const [documentsDrawerOpen, setDocumentsDrawerOpen] = useState(false);

  const [companySelectedContractors, setCompanySelectedContractors] = useState<
    string[]
  >([]);
  const [safetySelectedContractors, setSafetySelectedContractors] = useState<
    string[]
  >([]);
  const [financeSelectedContractors, setFinanceSelectedContractors] = useState<
    string[]
  >([]);
  const [documentsSelectedContractors, setDocumentsSelectedContractors] =
    useState<string[]>([]);

  const [companySelectedContractor, setCompanySelectedContractor] =
    useState<string>('');
  const [safetySelectedContractor, setSafetySelectedContractor] =
    useState<string>('');
  const [financeSelectedContractor, setFinanceSelectedContractor] =
    useState<string>('');
  const [documentsSelectedContractor, setDocumentsSelectedContractor] =
    useState<string>('');

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

  const handleFrequencyChange = (
    category: string,
    setting: string,
    frequency: NotificationFrequency,
  ) => {
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

  const handleScopeChange = (
    category: string,
    setting: string,
    scope: DocumentNotificationScope,
  ) => {
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

  const handleCategoryScopeChange = (
    category: string,
    setting: string,
    scope: DocumentCategoryScope,
  ) => {
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

  const handleCategoryTimeChange = (
    category: string,
    time: DocumentCategoryNotificationTime,
    checked: boolean,
  ) => {
    setCategoryNotificationTimes((prev) => {
      const currentTimes = prev[category] || [];
      if (checked) {
        return {
          ...prev,
          [category]: [...currentTimes, time],
        };
      } else {
        return {
          ...prev,
          [category]: currentTimes.filter((t) => t !== time),
        };
      }
    });
  };

  const handleCustomDateChange = (
    category: string,
    dates: Date[] | undefined,
  ) => {
    setCategoryCustomDates((prev) => ({
      ...prev,
      [category]: dates || [],
    }));
  };

  const handleAddCategories = (category: string, setting: string) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: {
          ...prev[category][setting],
          selectedCategories: selectedCategories,
          categoryNotificationTimes: categoryNotificationTimes,
        },
      },
    }));
    toast.success(
      `${selectedCategories.length} categor${selectedCategories.length === 1 ? 'y' : 'ies'} added to your notification list.`,
      {
        position: 'top-right',
      },
    );
  };

  const toggleCategory = (category: string) => {
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const addWatchedUsers = (
    category: string,
    setting: string,
    users: string[],
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: {
          ...prev[category][setting],
          watchedUsers: [
            ...new Set([
              ...(prev[category][setting].watchedUsers || []),
              ...users,
            ]),
          ],
        },
      },
    }));
    setSelectedContractors([]);
    setSearchQuery('');
  };

  const removeWatchedUser = (
    category: string,
    setting: string,
    userToRemove: string,
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: {
          ...prev[category][setting],
          watchedUsers: (prev[category][setting].watchedUsers || []).filter(
            (user) => user !== userToRemove,
          ),
        },
      },
    }));
  };

  const filteredContractors = MOCK_CONTRACTORS.filter((contractor) =>
    contractor.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleContractorSelect = (contractor: string) => {
    if (contractor && !selectedContractors.includes(contractor)) {
      setSelectedContractors([...selectedContractors, contractor]);
      setSelectedContractor('');
    }
  };

  const handleAddContractors = (category: string, setting: string) => {
    addWatchedUsers(category, setting, selectedContractors);
    toast.success(
      `${selectedContractors.length} contractor${selectedContractors.length === 1 ? '' : 's'} added to your notification list.`,
      {
        position: 'top-right',
      },
    );
  };

  const handleDrawerOpen = (category: string, setting: string) => {
    const notification = notifications[category][setting];
    setSelectedContractors(notification.watchedUsers || []);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedContractors([]);
    setSelectedContractor('');
  };

  const renderDocumentScopeSelector = (category: string, setting: string) => {
    const notification = notifications[category][setting];
    if (!notification.enabled) return null;

    return (
      <div
        className={`flex flex-col gap-y-2 px-1 py-2 ${notification.documentScope !== 'none' ? 'border-b' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Label className="text-base font-medium text-zinc-600">
              Receive notifications for...
            </Label>
          </div>
          <div className="flex items-center gap-4">
            {notification.documentScope === 'custom' && (
              <Drawer
                direction="right"
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
              >
                <DrawerTrigger asChild>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-8 text-blue-600 hover:text-blue-800 hover:no-underline px-0"
                    onClick={() => handleDrawerOpen(category, setting)}
                  >
                    {(notification.watchedUsers || []).length > 0
                      ? `${(notification.watchedUsers || []).length} contractor${(notification.watchedUsers || []).length === 1 ? '' : 's'} selected`
                      : 'Add Contractors'}
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
                            .filter(
                              (contractor) =>
                                !selectedContractors.includes(contractor) &&
                                !notification.watchedUsers?.includes(
                                  contractor,
                                ),
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
                            <div
                              key={contractor}
                              className="flex items-center justify-between py-2 border-b last:border-b-0"
                            >
                              <span className="text-sm">{contractor}</span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedContractors(
                                        selectedContractors.filter(
                                          (c) => c !== contractor,
                                        ),
                                      );
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
                        <Button variant="outline" onClick={handleDrawerClose}>
                          Cancel
                        </Button>
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
            )}
            <Select
              value={notification.documentScope || 'all'}
              onValueChange={(value: DocumentNotificationScope) =>
                handleScopeChange(category, setting, value)
              }
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contractors</SelectItem>
                <SelectItem value="myProjects">
                  Contractors on my projects
                </SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="none">No Contractors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  const renderNotificationItem = (
    category: string,
    setting: string,
    label: string,
  ) => {
    const notification = notifications[category][setting];

    return (
      <div className="flex flex-col gap-y-2 px-1 py-2 border-b last:border-b-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Label className="text-base font-medium text-zinc-600">
              {label}
            </Label>
          </div>
          <div className="flex items-center gap-4">
            {category === 'documents' && setting === 'documentExpirations' ? (
              <div className="flex items-center gap-4">
                <Drawer
                  direction="right"
                  open={isCategoriesDrawerOpen}
                  onOpenChange={setIsCategoriesDrawerOpen}
                >
                  <DrawerTrigger asChild>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-8 text-blue-600 hover:text-blue-800 hover:no-underline px-0"
                      onClick={() =>
                        handleCategoriesDrawerOpen(category, setting)
                      }
                    >
                      {notifications[category][setting].selectedCategories
                        ?.length || 0}{' '}
                      categories selected
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="w-[620px] !max-w-[620px]">
                    <DrawerHeader className="border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <DrawerTitle>Edit Categories</DrawerTitle>
                          <DrawerDescription>
                            Select document categories to receive notifications
                            for
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
                          <div className="py-2 border-b">
                            <div className="px-2 flex items-center gap-2 justify-between">
                              <span className="text-sm font-medium text-zinc-600">
                                Name
                              </span>
                              <span className="text-sm font-medium text-zinc-600">
                                Notification Time
                              </span>
                            </div>
                          </div>
                          <div className="space-y-0">
                            {documentCategories.map((category) => (
                              <div
                                key={category}
                                className="flex items-center justify-between py-2 border-b last:border-b-0"
                              >
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={category}
                                    checked={selectedCategories.includes(
                                      category,
                                    )}
                                    onCheckedChange={() =>
                                      toggleCategory(category)
                                    }
                                  />
                                  <Label htmlFor={category} className="text-sm">
                                    {category}
                                  </Label>
                                </div>
                                <div className="flex items-center justify-between">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-[180px] justify-between"
                                        disabled={
                                          !selectedCategories.includes(category)
                                        }
                                      >
                                        {categoryNotificationTimes[category]
                                          ?.length
                                          ? categoryNotificationTimes[category]
                                              .length > 1
                                            ? `${categoryNotificationTimes[category].length} options selected`
                                            : (() => {
                                                const time =
                                                  categoryNotificationTimes[
                                                    category
                                                  ][0];
                                                switch (time) {
                                                  case 'onExpiration':
                                                    return 'When expired';
                                                  case '7days':
                                                    return '7 days before';
                                                  case '14days':
                                                    return '14 days before';
                                                  case '30days':
                                                    return '30 days before';
                                                  case '90days':
                                                    return '90 days before';
                                                  case 'custom':
                                                    return 'Custom date';
                                                  default:
                                                    return time;
                                                }
                                              })()
                                          : 'Select times'}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-[180px]"
                                      onCloseAutoFocus={(e) =>
                                        e.preventDefault()
                                      }
                                    >
                                      <DropdownMenuCheckboxItem
                                        checked={categoryNotificationTimes[
                                          category
                                        ]?.includes('onExpiration')}
                                        onSelect={(e) => e.preventDefault()}
                                        onCheckedChange={(checked) =>
                                          handleCategoryTimeChange(
                                            category,
                                            'onExpiration',
                                            checked,
                                          )
                                        }
                                      >
                                        When expired
                                      </DropdownMenuCheckboxItem>
                                      <DropdownMenuCheckboxItem
                                        checked={categoryNotificationTimes[
                                          category
                                        ]?.includes('7days')}
                                        onSelect={(e) => e.preventDefault()}
                                        onCheckedChange={(checked) =>
                                          handleCategoryTimeChange(
                                            category,
                                            '7days',
                                            checked,
                                          )
                                        }
                                      >
                                        7 days before
                                      </DropdownMenuCheckboxItem>
                                      <DropdownMenuCheckboxItem
                                        checked={categoryNotificationTimes[
                                          category
                                        ]?.includes('14days')}
                                        onSelect={(e) => e.preventDefault()}
                                        onCheckedChange={(checked) =>
                                          handleCategoryTimeChange(
                                            category,
                                            '14days',
                                            checked,
                                          )
                                        }
                                      >
                                        14 days before
                                      </DropdownMenuCheckboxItem>
                                      <DropdownMenuCheckboxItem
                                        checked={categoryNotificationTimes[
                                          category
                                        ]?.includes('30days')}
                                        onSelect={(e) => e.preventDefault()}
                                        onCheckedChange={(checked) =>
                                          handleCategoryTimeChange(
                                            category,
                                            '30days',
                                            checked,
                                          )
                                        }
                                      >
                                        30 days before
                                      </DropdownMenuCheckboxItem>
                                      <DropdownMenuCheckboxItem
                                        checked={categoryNotificationTimes[
                                          category
                                        ]?.includes('90days')}
                                        onSelect={(e) => e.preventDefault()}
                                        onCheckedChange={(checked) =>
                                          handleCategoryTimeChange(
                                            category,
                                            '90days',
                                            checked,
                                          )
                                        }
                                      >
                                        90 days before
                                      </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
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
                          <Button
                            variant="outline"
                            onClick={handleCategoriesDrawerClose}
                          >
                            Cancel
                          </Button>
                        </DrawerClose>
                        <DrawerClose asChild>
                          <Button
                            onClick={() => {
                              handleAddCategories(category, setting);
                              handleCategoriesDrawerClose();
                            }}
                          >
                            Update
                          </Button>
                        </DrawerClose>
                      </div>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-zinc-600">
                    Notification Center
                  </Label>
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
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-screen-xl mb-10">
      <div className="flex flex-col gap-6">
        <div className="transition-shadow">
          <div className="pt-3 px-1">
            <span className="text-lg font-semibold">Company</span>
          </div>
          <div>
            {renderDocumentScopeSelector('company', 'newAnnouncements')}
            <AnimatePresence>
              {notifications.company.newAnnouncements.documentScope !==
                'none' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div>
                    {renderNotificationItem(
                      'company',
                      'newAnnouncements',
                      'New Announcements',
                    )}
                    {renderNotificationItem(
                      'company',
                      'policyUpdates',
                      'Policy Updates',
                    )}
                    {renderNotificationItem(
                      'company',
                      'teamUpdates',
                      'Team Updates',
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="transition-shadow">
          <div className="pt-3 px-1">
            <span className="text-lg font-semibold">Safety</span>
          </div>
          <div>
            {renderDocumentScopeSelector('safety', 'incidentReports')}
            <AnimatePresence>
              {notifications.safety.incidentReports.documentScope !==
                'none' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div>
                    {renderNotificationItem(
                      'safety',
                      'incidentReports',
                      'Incident Reports',
                    )}
                    {renderNotificationItem(
                      'safety',
                      'safetyTraining',
                      'Safety Training',
                    )}
                    {renderNotificationItem(
                      'safety',
                      'emergencyAlerts',
                      'Emergency Alerts',
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="transition-shadow">
          <div className="pt-3 px-1">
            <span className="text-lg font-semibold">Finance</span>
          </div>
          <div>
            {renderDocumentScopeSelector('finance', 'payrollUpdates')}
            <AnimatePresence>
              {notifications.finance.payrollUpdates.documentScope !==
                'none' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div>
                    {renderNotificationItem(
                      'finance',
                      'payrollUpdates',
                      'Payroll Updates',
                    )}
                    {renderNotificationItem(
                      'finance',
                      'expenseApprovals',
                      'Expense Approvals',
                    )}
                    {renderNotificationItem(
                      'finance',
                      'budgetChanges',
                      'Budget Changes',
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="transition-shadow">
          <div className="pt-3 px-1">
            <span className="text-lg font-semibold">Documents</span>
          </div>
          <div>
            {renderDocumentScopeSelector('documents', 'newDocuments')}
            <AnimatePresence>
              {notifications.documents.newDocuments.documentScope !==
                'none' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div>
                    {renderNotificationItem(
                      'documents',
                      'documentExpirations',
                      'Notifications by document category',
                    )}
                    {renderNotificationItem(
                      'documents',
                      'documentExpired',
                      'Contractor document expired',
                    )}
                    {renderNotificationItem(
                      'documents',
                      'newDocuments',
                      'New document added',
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
