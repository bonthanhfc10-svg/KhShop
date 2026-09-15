import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AdminRoute from '../components/admin/route/AdminRoute';
import LoginLoading from '../components/common/Loading';

const AdminLogin = lazy(() => import('../pages/admin/login/Login'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const Products = lazy(() => import('../pages/admin/products/Products'));
const AddProduct = lazy(() => import('../pages/admin/products/AddProduct'));
const EditProduct = lazy(() => import('../pages/admin/products/EditProduct'));
const ProductDetail = lazy(() => import('../pages/admin/products/ProductDetail'));
const Categories = lazy(() => import('../pages/admin/categories/Categories'));
const CreateCategory = lazy(() => import('../pages/admin/categories/CreateCategory'));
const Orders = lazy(() => import('../pages/admin/orders/Orders'));
const OrderDetails = lazy(() => import('../pages/admin/orders/OrderDetails'));
const Customers = lazy(() => import('../pages/admin/customers/Customers'));
const CustomerDetails = lazy(() => import('../pages/admin/customers/CustomerDetails'));
const Inventory = lazy(() => import('../pages/admin/inventory/Inventory'));
const LowStock = lazy(() => import('../pages/admin/inventory/LowStock'));
const SalesReport = lazy(() => import('../pages/admin/reports/SalesReport'));
const ProductReport = lazy(() => import('../pages/admin/reports/ProductReport'));
const CustomerReport = lazy(() => import('../pages/admin/reports/CustomerReport'));
const Banners = lazy(() => import('../pages/admin/store/Banners'));
const CreateBanner = lazy(() => import('../pages/admin/store/CreateBanner'));
const Collections = lazy(() => import('../pages/admin/store/Collections'));
const Settings = lazy(() => import('../pages/admin/settings/Settings'));
const AdminUsers = lazy(() => import('../pages/admin/settings/AdminUsers'));
const CreateAdminUser = lazy(() => import('../pages/admin/settings/CreateAdminUser'));

const Load = ({ children }) => (
  <Suspense fallback={<LoginLoading />}>{children}</Suspense>
);

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<Load><AdminLogin /></Load>} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Load><Dashboard /></Load>} />
        <Route path="products" element={<Load><Products /></Load>} />
        <Route path="products/create" element={<Load><AddProduct /></Load>} />
        <Route path="products/:id" element={<Load><ProductDetail /></Load>} />
        <Route path="products/:id/edit" element={<Load><EditProduct /></Load>} />
        <Route path="categories" element={<Load><Categories /></Load>} />
        <Route path="categories/create" element={<Load><CreateCategory /></Load>} />
        <Route path="orders" element={<Load><Orders /></Load>} />
        <Route path="orders/:id" element={<Load><OrderDetails /></Load>} />
        <Route path="customers" element={<Load><Customers /></Load>} />
        <Route path="customers/:id" element={<Load><CustomerDetails /></Load>} />
        <Route path="inventory" element={<Load><Inventory /></Load>} />
        <Route path="inventory/low-stock" element={<Load><LowStock /></Load>} />
        <Route path="reports" element={<Navigate to="/admin/reports/sales" replace />} />
        <Route path="reports/sales" element={<Load><SalesReport /></Load>} />
        <Route path="reports/products" element={<Load><ProductReport /></Load>} />
        <Route path="reports/customers" element={<Load><CustomerReport /></Load>} />
        <Route path="store" element={<Navigate to="/admin/store/banners" replace />} />
        <Route path="store/banners" element={<Load><Banners /></Load>} />
        <Route path="store/banners/create" element={<Load><CreateBanner /></Load>} />
        <Route path="store/collections" element={<Load><Collections /></Load>} />
        <Route path="settings" element={<Load><Settings /></Load>} />
        <Route path="settings/admin-users" element={<Load><AdminUsers /></Load>} />
        <Route path="settings/admin-users/create" element={<Load><CreateAdminUser /></Load>} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
