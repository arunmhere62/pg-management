import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

// one data
export const APP_CONFIG = {
  SESSION_EXPIRY_SECONDS: 60 * 60 * 24
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['b', 'b'],
    items: [],
    roles: ['ADMIN']
  },
  {
    title: 'Pg Locations',
    url: '/pg-location',
    icon: 'building',
    isActive: false,
    shortcut: ['p', 'p'],
    items: [],
    roles: ['ADMIN', 'EMPLOYEE']
  },

  {
    title: 'Rooms',
    url: '/room',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['r', 'r'],
    items: [],
    roles: ['ADMIN', 'EMPLOYEE']
  },

  {
    title: 'Beds',
    url: '/bed',
    icon: 'bed',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
    roles: ['ADMIN', 'EMPLOYEE']
  },

  {
    title: 'Tenants',
    url: '/tenant',
    icon: 'tenants',
    isActive: false,
    shortcut: ['tn', 'tn'],
    items: [],
    roles: ['ADMIN', 'EMPLOYEE']
  },

  {
    title: 'Visitors',
    url: '/visitor',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['v', 'v'],
    items: [],
    roles: ['ADMIN', 'EMPLOYEE']
  },

  {
    title: 'Rent ',
    url: '/payment/rent',
    icon: 'money',
    isActive: false,
    shortcut: ['r', 'p'],
    items: [],
    roles: ['ADMIN', 'EMPLOYEE']
  },
  {
    title: 'Advance',
    url: '/payment/advance',
    icon: 'money',
    isActive: false,
    shortcut: ['a', 'p'],
    items: [],
    roles: ['ADMIN', 'EMPLOYEE']
  },
  {
    title: 'Refund',
    url: '/payment/refund',
    icon: 'money',
    isActive: false,
    shortcut: ['rf', 'p'],
    items: [],
    roles: ['ADMIN', 'EMPLOYEE']
  },
  {
    title: 'Expenses',
    url: '/expense',
    icon: 'expense',
    isActive: false,
    shortcut: ['e', 'x'],
    items: [],
    roles: ['ADMIN', 'EMPLOYEE']
  },
  {
    title: 'Employee',
    url: '/employee',
    icon: 'users',
    isActive: false,
    shortcut: ['e', 'm'],
    items: [],
    roles: ['ADMIN']
  },
  {
    title: 'Employee Salary',
    url: '/employee-salary',
    icon: 'users',
    isActive: false,
    shortcut: ['e', 'm'],
    items: [],
    roles: ['ADMIN']
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
