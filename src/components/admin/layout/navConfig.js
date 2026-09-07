import {
  LayoutDashboard,
  Package,
  Tags,
  Warehouse,
  AlertCircle,
  ShoppingCart,
  Users,
  BarChart3,
  PieChart,
  UserRound,
  Image,
  Bookmark,
  Settings,
  Shield,
} from 'lucide-react';

export const navGroups = [
  {
    label: 'Main',
    items: [{ label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Catalog',
    items: [
      { label: 'Products', path: '/admin/products', icon: Package },
      { label: 'Categories', path: '/admin/categories', icon: Tags },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { label: 'Inventory', path: '/admin/inventory', icon: Warehouse },
      { label: 'Low Stock', path: '/admin/inventory/low-stock', icon: AlertCircle },
    ],
  },
  {
    label: 'Sales',
    items: [
      { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
      { label: 'Customers', path: '/admin/customers', icon: Users },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { label: 'Sales Report', path: '/admin/reports/sales', icon: BarChart3, end: true },
      { label: 'Product Report', path: '/admin/reports/products', icon: PieChart, end: true },
      { label: 'Customer Report', path: '/admin/reports/customers', icon: UserRound, end: true },
    ],
  },
  {
    label: 'Store',
    items: [
      { label: 'Banners', path: '/admin/store/banners', icon: Image, end: true },
      { label: 'Collections', path: '/admin/store/collections', icon: Bookmark, end: true },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', path: '/admin/settings', icon: Settings, end: true },
      { label: 'Admin Users', path: '/admin/settings/admin-users', icon: Shield, end: true },
    ],
  },
];
