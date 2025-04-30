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
import { ChevronDown, MoreHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const NotificationHeader = ({
  isDocuments = false,
}: {
  isDocuments?: boolean;
}) => (
  <div
    className={`grid ${isDocuments ? 'grid-cols-[1fr_220px_100px_100px_150px]' : 'grid-cols-[1fr_220px_100px_150px]'} items-center gap-4 px-1 pb-1 pt-3`}
  >
    <div className="text-sm font-bold text-zinc-900">
      {isDocuments ? 'Category' : 'Name'}
    </div>
    <div className="text-sm font-bold text-zinc-900">Scope</div>
    {isDocuments && (
      <div className="text-sm text-center font-bold text-zinc-900">Email</div>
    )}
    <div className="text-sm text-center font-bold text-zinc-900">
      Notification
    </div>
    <div className="text-sm font-bold text-zinc-900">
      {isDocuments ? 'Delivery' : 'Email'}
    </div>
  </div>
);

type NotificationFrequency = 'instant' | 'daily' | 'weekly' | 'never';
type DocumentNotificationScope =
  | 'all'
  | 'myProjects'
  | 'custom'
  | 'none'
  | 'expired'
  | 'added';
type DocumentCategoryScope = 'all' | 'custom';
const documentCategoryNotificationTimes = [
  'When expired',
  '7 days before',
  '14 days before',
  '30 days before',
  '90 days before',
] as const;

type DocumentCategoryNotificationTime =
  (typeof documentCategoryNotificationTimes)[number];

interface NotificationSetting {
  enabled: boolean;
  emailEnabled: boolean;
  frequency: NotificationFrequency;
  documentScope?: DocumentNotificationScope;
  selectedContractors?: string[];
  documentCategoryScope?: DocumentCategoryScope;
  selectedCategories?: string[];
  categoryEnabled?: Record<string, boolean>;
  categoryEmailEnabled?: Record<string, boolean>;
  categoryNotificationTimes?: Record<
    string,
    DocumentCategoryNotificationTime[]
  >;
  categoryScopes?: Record<string, ('expired' | 'added')[]>;
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

const DocumentNotificationItem = ({
  category,
  notification,
  onToggle,
  onEmailToggle,
  onScopeChange,
  onFrequencyChange,
}: {
  category: string;
  notification: NotificationSetting;
  onToggle: () => void;
  onEmailToggle: () => void;
  onScopeChange: (scope: 'expired' | 'added', checked: boolean) => void;
  onFrequencyChange: (
    frequency: DocumentCategoryNotificationTime,
    checked: boolean,
  ) => void;
}) => {
  const getScopeLabel = () => {
    const scopes = notification.categoryScopes?.[category] || [];
    if (scopes.length === 0) return 'Select scope';
    if (scopes.length === 2) return 'Documents Added or Expired';
    return scopes[0] === 'expired' ? 'Document Expired' : 'Document Added';
  };

  const getFrequencyLabel = () => {
    const frequencies =
      notification.categoryNotificationTimes?.[category] || [];
    if (frequencies.length === 0) return 'Select time';
    if (frequencies.length === 1) return frequencies[0];
    return `${frequencies.length} times selected`;
  };

  return (
    <div className="grid grid-cols-[1fr_220px_100px_100px_150px] gap-4 items-center py-2">
      <div className="font-medium">{category}</div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[220px] justify-start">
            <div className="truncate w-full text-left">{getScopeLabel()}</div>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[200px]"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuCheckboxItem
            checked={notification.categoryScopes?.[category]?.includes(
              'expired',
            )}
            onSelect={(e) => e.preventDefault()}
            onCheckedChange={(checked) => onScopeChange('expired', checked)}
          >
            Document Expired
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={notification.categoryScopes?.[category]?.includes('added')}
            onSelect={(e) => e.preventDefault()}
            onCheckedChange={(checked) => onScopeChange('added', checked)}
          >
            Document Added
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex justify-center">
        <Switch
          checked={notification.categoryEnabled?.[category]}
          onCheckedChange={onToggle}
        />
      </div>
      <div className="flex justify-center">
        <Switch
          checked={notification.categoryEmailEnabled?.[category]}
          onCheckedChange={onEmailToggle}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {getFrequencyLabel()}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[150px]"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {documentCategoryNotificationTimes.map(
            (time: DocumentCategoryNotificationTime) => (
              <DropdownMenuCheckboxItem
                key={time}
                checked={notification.categoryNotificationTimes?.[
                  category
                ]?.includes(time)}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={(checked) => onFrequencyChange(time, checked)}
              >
                {time}
              </DropdownMenuCheckboxItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const DocumentNotifications = ({
  notifications,
  onToggle,
  onEmailToggle,
  onScopeChange,
  onFrequencyChange,
}: {
  notifications: NotificationGroup;
  onToggle: (category: string) => void;
  onEmailToggle: (category: string) => void;
  onScopeChange: (
    category: string,
    scope: 'expired' | 'added',
    checked: boolean,
  ) => void;
  onFrequencyChange: (
    category: string,
    frequency: DocumentCategoryNotificationTime,
    checked: boolean,
  ) => void;
}) => {
  return (
    <div>
      {documentCategories.map((category) => (
        <DocumentNotificationItem
          key={category}
          category={category}
          notification={notifications.documentExpirations}
          onToggle={() => onToggle(category)}
          onEmailToggle={() => onEmailToggle(category)}
          onScopeChange={(scope, checked) =>
            onScopeChange(category, scope, checked)
          }
          onFrequencyChange={(frequency, checked) =>
            onFrequencyChange(category, frequency, checked)
          }
        />
      ))}
    </div>
  );
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationsState>({
    company: {
      assessmentsComplete: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
      assessmentsIncomplete: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
      primaryTradeChanges: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
      subscriptionExpiring: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
      subscriptionExpired: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
    },
    safety: {
      assessmentsComplete: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
      assessmentsIncomplete: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
      scoreChanges: { enabled: true, frequency: 'instant', emailEnabled: true },
      becomesApproved: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
      needsApproval: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
    },
    finance: {
      payrollUpdates: { enabled: true, frequency: 'daily', emailEnabled: true },
      assessmentsComplete: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
      assessmentsIncomplete: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
      scoreChanges: { enabled: true, frequency: 'instant', emailEnabled: true },
      becomesApproved: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
      needsApproval: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
      newDocument: { enabled: true, frequency: 'instant', emailEnabled: true },
    },
    documents: {
      newDocuments: { enabled: true, frequency: 'instant', emailEnabled: true },
      documentExpired: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
      documentExpirations: {
        enabled: true,
        frequency: 'daily',
        emailEnabled: true,
        documentScope: 'all',
        documentCategoryScope: 'all',
        selectedCategories: documentCategories,
        categoryNotificationTimes: documentCategories.reduce(
          (acc, category) => ({
            ...acc,
            [category]: [],
          }),
          {},
        ),
        categoryEnabled: documentCategories.reduce(
          (acc, category) => ({
            ...acc,
            [category]: true,
          }),
          {},
        ),
        categoryEmailEnabled: documentCategories.reduce(
          (acc, category) => ({
            ...acc,
            [category]: true,
          }),
          {},
        ),
        categoryScopes: documentCategories.reduce(
          (acc, category) => ({
            ...acc,
            [category]: ['expired'],
          }),
          {},
        ),
      },
      signatureRequests: {
        enabled: false,
        frequency: 'instant',
        emailEnabled: true,
      },
    },
    insurance: {
      coverageRequirements: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
      policyExpiring: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
      policyExpired: {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      },
    },
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newUser, setNewUser] = useState<string>('');

  const handleToggle = (category: string, setting: string) => {
    setNotifications((prev) => {
      if (category === 'documents' && setting === 'documentExpirations') {
        return {
          ...prev,
          documents: {
            ...prev.documents,
            documentExpirations: {
              ...prev.documents.documentExpirations,
              enabled: !prev.documents.documentExpirations.enabled,
            },
          },
        };
      }

      return {
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: {
            ...prev[category][setting],
            enabled: !prev[category][setting].enabled,
          },
        },
      };
    });
  };

  const handleEmailToggle = (category: string, setting: string) => {
    setNotifications((prev) => {
      if (category === 'documents' && setting === 'documentExpirations') {
        return {
          ...prev,
          documents: {
            ...prev.documents,
            documentExpirations: {
              ...prev.documents.documentExpirations,
              emailEnabled: !prev.documents.documentExpirations.emailEnabled,
            },
          },
        };
      }

      return {
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: {
            ...prev[category][setting],
            emailEnabled: !prev[category][setting].emailEnabled,
          },
        },
      };
    });
  };

  const handleFrequencyChange = (
    category: string,
    setting: string,
    frequency: NotificationFrequency,
  ) => {
    setNotifications((prev) => {
      if (category === 'documents' && setting === 'documentExpirations') {
        return {
          ...prev,
          documents: {
            ...prev.documents,
            documentExpirations: {
              ...prev.documents.documentExpirations,
              frequency,
            },
          },
        };
      }

      return {
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: {
            ...prev[category][setting],
            frequency,
          },
        },
      };
    });
  };

  const handleScopeChange = (
    category: string,
    setting: string,
    scope: DocumentNotificationScope,
  ) => {
    setNotifications((prev) => {
      // For document categories, we need to handle the scope differently
      if (category === 'documents' && setting === 'documentExpirations') {
        const currentState = prev.documents?.documentExpirations || {
          enabled: true,
          frequency: 'daily',
          emailEnabled: true,
          watchedUsers: [],
          documentScope: 'all',
          documentCategoryScope: 'all',
          selectedCategories: documentCategories,
          categoryNotificationTimes: {},
        };

        return {
          ...prev,
          documents: {
            ...prev.documents,
            documentExpirations: {
              ...currentState,
              documentScope: scope,
              categoryNotificationTimes: Object.fromEntries(
                (currentState.selectedCategories || []).map((cat) => [
                  cat,
                  [scope === 'expired' ? 'onExpiration' : 'instant'],
                ]),
              ),
            },
          },
        };
      }

      // For all other cases
      const currentSetting = prev[category]?.[setting] || {
        enabled: true,
        frequency: 'instant',
        emailEnabled: true,
      };

      return {
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: {
            ...currentSetting,
            documentScope: scope,
          },
        },
      };
    });
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

  const handleCategoryTimeChange = (
    category: string,
    time: DocumentCategoryNotificationTime,
    checked: boolean,
  ) => {
    setNotifications((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        documentExpirations: {
          ...prev.documents.documentExpirations,
          categoryNotificationTimes: {
            ...prev.documents.documentExpirations.categoryNotificationTimes,
            [category]: checked
              ? [
                  ...(prev.documents.documentExpirations
                    .categoryNotificationTimes?.[category] || []),
                  time,
                ]
              : (
                  prev.documents.documentExpirations
                    .categoryNotificationTimes?.[category] || []
                ).filter((t) => t !== time),
          },
        },
      },
    }));
  };

  const toggleCategory = (category: string) => {
    setNotifications((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        documentExpirations: {
          ...prev.documents.documentExpirations,
          selectedCategories:
            prev.documents.documentExpirations.selectedCategories?.includes(
              category,
            )
              ? prev.documents.documentExpirations.selectedCategories.filter(
                  (c) => c !== category,
                )
              : [
                  ...(prev.documents.documentExpirations.selectedCategories ||
                    []),
                  category,
                ],
        },
      },
    }));
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
      <div className="flex gap-x-3">
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
                            !notification.watchedUsers?.includes(contractor),
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
    );
  };

  const handleDocumentToggle = (category: string) => {
    setNotifications((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        documentExpirations: {
          ...prev.documents.documentExpirations,
          categoryEnabled: {
            ...prev.documents.documentExpirations.categoryEnabled,
            [category]:
              !prev.documents.documentExpirations.categoryEnabled?.[category],
          },
        },
      },
    }));
  };

  const handleDocumentEmailToggle = (category: string) => {
    setNotifications((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        documentExpirations: {
          ...prev.documents.documentExpirations,
          categoryEmailEnabled: {
            ...prev.documents.documentExpirations.categoryEmailEnabled,
            [category]:
              !prev.documents.documentExpirations.categoryEmailEnabled?.[
                category
              ],
          },
        },
      },
    }));
  };

  const handleDocumentScopeChange = (
    category: string,
    scope: 'expired' | 'added',
    checked: boolean,
  ) => {
    setNotifications((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        documentExpirations: {
          ...prev.documents.documentExpirations,
          categoryScopes: {
            ...prev.documents.documentExpirations.categoryScopes,
            [category]: checked
              ? [
                  ...(prev.documents.documentExpirations.categoryScopes?.[
                    category
                  ] || []),
                  scope,
                ]
              : (
                  prev.documents.documentExpirations.categoryScopes?.[
                    category
                  ] || []
                ).filter((s) => s !== scope),
          },
        },
      },
    }));
  };

  const handleDocumentFrequencyChange = (
    category: string,
    frequency: DocumentCategoryNotificationTime,
    checked: boolean,
  ) => {
    setNotifications((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        documentExpirations: {
          ...prev.documents.documentExpirations,
          categoryNotificationTimes: {
            ...prev.documents.documentExpirations.categoryNotificationTimes,
            [category]: checked
              ? [
                  ...(prev.documents.documentExpirations
                    .categoryNotificationTimes?.[category] || []),
                  frequency,
                ]
              : (
                  prev.documents.documentExpirations
                    .categoryNotificationTimes?.[category] || []
                ).filter((f) => f !== frequency),
          },
        },
      },
    }));
  };

  const handleToggleUser = (category: string, user: string) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [user]: {
          ...prev[category][user],
          enabled: !prev[category][user].enabled,
        },
      },
    }));
  };

  const handleToggleUserEmail = (category: string, user: string) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [user]: {
          ...prev[category][user],
          emailEnabled: !prev[category][user].emailEnabled,
        },
      },
    }));
  };

  const renderUserNotificationItem = (category: string, user: string) => {
    const setting = notifications[category][user];
    return (
      <div
        key={user}
        className="grid grid-cols-[1fr_auto_100px_150px] gap-4 items-center"
      >
        <div className="text-sm font-medium">{user}</div>
        <div className="flex items-center gap-2">
          <Switch
            checked={setting.enabled}
            onChange={() => handleToggleUser(category, user)}
          />
          <span className="text-sm text-gray-500">Email</span>
          <Switch
            checked={setting.emailEnabled}
            onChange={() => handleToggleUserEmail(category, user)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Frequency</span>
          <select
            value={setting.frequency}
            onChange={(e) =>
              handleFrequencyChange(
                category,
                user,
                e.target.value as NotificationFrequency,
              )
            }
            className="text-sm border rounded px-2 py-1"
          >
            <option value="instant">Instant</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
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
      <div className="flex flex-col gap-y-2 px-1 py-2">
        {category === 'documents' && setting === 'documentExpirations' ? (
          <DocumentNotifications
            notifications={notifications.documents}
            onToggle={handleDocumentToggle}
            onEmailToggle={handleDocumentEmailToggle}
            onScopeChange={handleDocumentScopeChange}
            onFrequencyChange={handleDocumentFrequencyChange}
          />
        ) : (
          <div className="grid grid-cols-[1fr_auto_100px_150px] items-center gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium text-zinc-600">
                {label}
              </Label>
            </div>
            <div>{renderDocumentScopeSelector(category, setting)}</div>
            <div className="flex items-center justify-center">
              <Switch
                checked={notification.enabled}
                onCheckedChange={() => handleToggle(category, setting)}
              />
            </div>
            <div>
              <Select
                value={notification.frequency}
                onValueChange={(value: NotificationFrequency) =>
                  handleFrequencyChange(category, setting, value)
                }
              >
                <SelectTrigger className="w-full text-right">
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
        )}
      </div>
    );
  };

  return (
    <div className="max-w-screen-xl mb-10">
      <div className="flex flex-col">
        <Accordion type="multiple" className="w-full flex flex-col gap-y-4">
          <AccordionItem
            value="company"
            className="border border-zinc-200 rounded-lg transition-shadow"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="text-lg font-semibold">Company</span>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <NotificationHeader />
                {renderNotificationItem(
                  'company',
                  'assessmentsComplete',
                  'Company assessments become complete',
                )}
                {renderNotificationItem(
                  'company',
                  'assessmentsIncomplete',
                  'Company assessments become incomplete',
                )}
                {renderNotificationItem(
                  'company',
                  'primaryTradeChanges',
                  'Primary trade changes',
                )}
                {renderNotificationItem(
                  'company',
                  'subscriptionExpiring',
                  'Highwire subscription is 30 days from expiration',
                )}
                {renderNotificationItem(
                  'company',
                  'subscriptionExpired',
                  'Highwire subscription is expired',
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="safety"
            className="border border-zinc-200 rounded-lg transition-shadow"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="text-lg font-semibold">Safety</span>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <NotificationHeader />
                {renderNotificationItem(
                  'safety',
                  'assessmentsComplete',
                  'Safety assessments become complete',
                )}
                {renderNotificationItem(
                  'safety',
                  'assessmentsIncomplete',
                  'Safety assessments become incomplete',
                )}
                {renderNotificationItem(
                  'safety',
                  'scoreChanges',
                  'Safety score changes',
                )}
                {renderNotificationItem(
                  'safety',
                  'becomesApproved',
                  'Safety becomes approved',
                )}
                {renderNotificationItem(
                  'safety',
                  'needsApproval',
                  'Safety needs approval',
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="finance"
            className="border border-zinc-200 rounded-lg transition-shadow"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="text-lg font-semibold">Finance</span>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <NotificationHeader />
                {renderNotificationItem(
                  'finance',
                  'assessmentsComplete',
                  'Finance assessments become complete',
                )}
                {renderNotificationItem(
                  'finance',
                  'assessmentsIncomplete',
                  'Finance assessments become incomplete',
                )}
                {renderNotificationItem(
                  'finance',
                  'scoreChanges',
                  'Finance score changes',
                )}
                {renderNotificationItem(
                  'finance',
                  'becomesApproved',
                  'Finance becomes approved',
                )}
                {renderNotificationItem(
                  'finance',
                  'needsApproval',
                  'Finance needs approval',
                )}
                {renderNotificationItem(
                  'finance',
                  'newDocument',
                  'New financial document is uploaded',
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="insurance"
            className="border border-zinc-200 rounded-lg transition-shadow"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="text-lg font-semibold">Insurance</span>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <NotificationHeader />
                {renderNotificationItem(
                  'insurance',
                  'coverageRequirements',
                  'Insurance coverage does not meet requirements',
                )}
                {renderNotificationItem(
                  'insurance',
                  'policyExpiring',
                  'Insurance policy is 30 days from expiration',
                )}
                {renderNotificationItem(
                  'insurance',
                  'policyExpired',
                  'Insurance policy is expired',
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="documents"
            className="border border-zinc-200 rounded-lg transition-shadow"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="text-lg font-semibold">Documents</span>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <NotificationHeader isDocuments={true} />
                {renderNotificationItem(
                  'documents',
                  'documentExpirations',
                  'Notify me about documents in...',
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
