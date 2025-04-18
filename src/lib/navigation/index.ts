import { NavItem, SectionConfig } from './types';
import { adminNavigation } from './admin';
import { contractorNavigation } from './contractor';
import { clientNavigation } from './client';

// Navigation configuration for each section
const sections: Record<string, SectionConfig[]> = {
  admin: adminNavigation,
  contractor: contractorNavigation,
  client: clientNavigation,
};

export function getNavigationItems(currentPath: string, section: 'admin' | 'client' | 'contractor'): NavItem[] {
  const pathParts = currentPath.split('/').filter(Boolean);
  if (pathParts.length <= 1) return [];

  const subSection = pathParts[1];
  const configs = sections[section];

  if (!configs?.length) return [];

  // Find the config that matches the current path
  const config = configs.find(c => c.name.toLowerCase() === subSection);
  if (!config?.subpages) return [];

  return Object.entries(config.subpages).map(([key, subConfig]) => ({
    name: subConfig.name,
    href: `/${section}/${subSection}/${key}`,
    icon: subConfig.icon,
    current: currentPath === `/${section}/${subSection}/${key}`,
  }));
}

// Get navigation items for a specific section
export function getMainNavigation(section: 'admin' | 'client' | 'contractor'): NavItem[] {
  const configs = sections[section];
  if (!configs?.length) return [];

  return configs.map(config => ({
    name: config.name,
    href: `/${section}/${config.name.toLowerCase()}`,
    icon: config.icon,
    current: false,
  }));
}