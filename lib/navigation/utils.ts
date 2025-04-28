import { NavItem } from './types';
import { adminNavigation } from './admin';
import { contractorNavigation } from './contractor';
import { clientNavigation } from './client';

// Navigation configuration for each section
const sections: Record<string, NavItem[]> = {
  admin: adminNavigation,
  contractor: contractorNavigation,
  client: clientNavigation,
};

export function getSubNavigation(currentPath: string, section: 'admin' | 'client' | 'contractor'): NavItem[] {
  const pathParts = currentPath.split('/').filter(Boolean);
  if (pathParts.length <= 1) return [];

  const subSection = pathParts[1];
  const configs = sections[section];

  if (!configs?.length) return [];

  // Find the config that matches the current path
  const config = configs.find(c => c.name.toLowerCase() === subSection);
  if (!config?.subpages) return [];

  return config.subpages.map(subpage => ({
    ...subpage,
    current: currentPath === subpage.href,
    parentTitle: config.name,
  }));
}

// Get navigation items for a specific section
export function getMainNavigation(section: 'admin' | 'client' | 'contractor'): NavItem[] {
  const configs = sections[section];
  if (!configs?.length) return [];

  return configs.map(config => ({
    ...config,
    current: false,
    subpages: config.subpages?.map(subpage => ({
      ...subpage,
      current: false
    }))
  }));
}
