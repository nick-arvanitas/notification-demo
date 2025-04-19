import { faChartLine, faCog, faFolder, faTasks, faUser } from '@fortawesome/free-solid-svg-icons';
import { NavItem } from './types';

export const contractorNavigation: NavItem[] = [
  {
    name: 'Home',
    icon: faChartLine,
    href: '/contractor',
    current: false,
  },
  {
    name: 'Clients',
    icon: faUser,
    href: '/contractor/clients',
    current: false,
  },
  {
    name: 'Team',
    icon: faUser,
    href: '/contractor/team',
    current: false,
  },
  {
    name: 'Company',
    icon: faFolder,
    href: '/contractor/company',
    current: false,
  },
  {
    name: 'Safety',
    icon: faTasks,
    href: '/contractor/safety',
    current: false,
  },
  {
    name: 'Finance',
    icon: faFolder,
    href: '/contractor/finance',
    current: false,
  },
  {
    name: 'Insurance',
    icon: faFolder,
    href: '/contractor/insurance',
    current: false,
  },
  {
    name: 'Subcontractors',
    icon: faUser,
    href: '/contractor/subcontractors',
    current: false,
  },
];

export const contractorNavigationBottom: NavItem[] = [
  {
    name: 'Settings',
    icon: faCog,
    href: '/contractor/settings',
    current: false,
  },
];
