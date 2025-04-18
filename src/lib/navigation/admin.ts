import { SectionConfig } from './types';
import { faChartBar, faUser, faUserTie, faSliders, faClipboardCheck, faCog, faFileExport, faCalendar, faEnvelope, faUsers } from '@fortawesome/free-solid-svg-icons';
export const adminNavigation: SectionConfig[] = [
  {
    name: 'Reports',
    icon: faChartBar,
    subpages: {
      bookings: {
        name: 'Bookings',
        icon: faCalendar,
      },
      exports: {
        name: 'Exports',
        icon: faFileExport,
      },
    },
  },
  {
    name: 'System',
    icon: faCog,
  },
  {
    name: 'Review',
    icon: faClipboardCheck,
  },
  {
    name: 'Configure',
    icon: faSliders,
  },
  {
    name: 'Outreach',
    icon: faEnvelope,
  },
  {
    name: 'View Contractors',
    icon: faUserTie,
  },
  {
    name: 'Users',
    icon: faUsers,
  },
  {
    name: 'Clients',
    icon: faUser,
  },
  {
    name: 'Contractors',
    icon: faUserTie,
  },
];