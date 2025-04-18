import { faCalendar, faChartArea, faChartBar, faFileInvoice, faUser, faUserTie, faCog  } from '@fortawesome/free-solid-svg-icons';
import { NavItem } from './types';

export const clientNavigation: NavItem[] = [
  {
    name: 'Home',
    icon: faChartArea,
    href: '/client/home',
    current: false,
  },
  {
    name: 'Profile',
    icon: faUser,
    href: '/client/profile',
    current: false,
  },
  {
    name: 'Contractors',
    icon: faUserTie,
    href: '/client/contractors',
    current: false,
  },
  {
    name: 'Bookings',
    icon: faCalendar,
    href: '/client/bookings',
    current: false,
  },
  {
    name: 'Invoices',
    icon: faFileInvoice,
    href: '/client/invoices',
    current: false,
  },
  {
    name: 'Reports',
    icon: faChartBar,
    href: '/client/reports',
    current: false,
  },
];

export const clientNavigationBottom: NavItem[] = [
  {
    name: 'Settings',
    icon: faCog,
    href: '/client/settings',
    current: false,
  },
];
