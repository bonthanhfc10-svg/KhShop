import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  PieChart,
  UserRound,
  UserCircle,
} from 'lucide-react';

export const staffNavGroups = [
  {
    label: 'Main',
    hideLabel: true,
    items: [{ label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Catalog',
    expandable: true,
    items: [
      { label: 'Products', path: '/admin/products', icon: Package },
    ],
  },
  {
    label: 'Sales',
    expandable: true,
    items: [
      { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
      { label: 'Customers', path: '/admin/customers', icon: Users },
    ],
  },
  {
    label: 'Reports',
    expandable: true,
    items: [
      { label: 'Sales Report', path: '/admin/reports/sales', icon: BarChart3, end: true },
      { label: 'Product Report', path: '/admin/reports/products', icon: PieChart, end: true },
      { label: 'Customer Report', path: '/admin/reports/customers', icon: UserRound, end: true },
    ],
  },
  {
    label: 'System',
    expandable: true,
    items: [
      { label: 'Account', path: '/admin/account', icon: UserCircle, end: true },
    ],
  },
];
