import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AdminRoute from '../components/route/AdminRoute';
import LoginLoading from '../components/common/Loading';

const AdminLogin = lazy(() => import('../pages/login/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Products = lazy(() => import('../pages/products/Products'));
const AddProduct = lazy(() => import('../pages/products/AddProduct'));
const EditProduct = lazy(() => import('../pages/products/EditProduct'));
const ProductDetail = lazy(() => import('../pages/products/ProductDetail'));
const Categories = lazy(() => import('../pages/categories/Categories'));
const Orders = lazy(() => import('../pages/orders/Orders'));
const OrderDetails = lazy(() => import('../pages/orders/OrderDetails'));
const Customers = lazy(() => import('../pages/customers/Customers'));
const CustomerDetails = lazy(() => import('../pages/customers/CustomerDetails'));
const Inventory = lazy(() => import('../pages/inventory/Inventory'));
const LowStock = lazy(() => import('../pages/inventory/LowStock'));
const SalesReport = lazy(() => import('../pages/reports/SalesReport'));
const ProductReport = lazy(() => import('../pages/reports/ProductReport'));
const CustomerReport = lazy(() => import('../pages/reports/CustomerReport'));
const Banners = lazy(() => import('../pages/store/Banners'));
const Collections = lazy(() => import('../pages/store/Collections'));
const Settings = lazy(() => import('../pages/settings/Settings'));
const AdminUsers = lazy(() => import('../pages/settings/AdminUsers'));

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
        <Route path="store/collections" element={<Load><Collections /></Load>} />
        <Route path="settings" element={<Load><Settings /></Load>} />
        <Route path="settings/admin-users" element={<Load><AdminUsers /></Load>} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
