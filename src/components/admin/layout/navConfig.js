import {
  LayoutDashboard,
  Package,
  Tags,
  Warehouse,
  ShoppingCart,
  Users,
  BarChart3,
  PieChart,
  UserRound,
  Image,
  Bookmark,
  Settings,
  Shield,
  Truck,
} from 'lucide-react';

export const navGroups = [
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
      { label: 'Categories', path: '/admin/categories', icon: Tags },
      { label: 'Suppliers', path: '/admin/suppliers', icon: Truck },
    ],
  },
  {
    label: 'Inventory',
    expandable: true,
    items: [
      { label: 'Inventory', path: '/admin/inventory', icon: Warehouse },
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
    label: 'Store',
    expandable: true,
    items: [
      { label: 'Banners', path: '/admin/store/banners', icon: Image, end: true },
      { label: 'Collections', path: '/admin/store/collections', icon: Bookmark, end: true },
    ],
  },
  {
    label: 'System',
    expandable: true,
    items: [
      { label: 'Settings', path: '/admin/settings', icon: Settings, end: true },
      { label: 'Admin Users', path: '/admin/settings/admin-users', icon: Shield, end: true },
    ],
  },
];
