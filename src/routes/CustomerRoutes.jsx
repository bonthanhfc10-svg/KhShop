import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/CustomerLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Loading from '../components/common/Loading';

// Dynamic Imports
const Home = lazy(() => import('../pages/customer/Home'));
const Shop = lazy(() => import('../pages/customer/shop/Shop'));
const Category = lazy(() => import('../pages/customer/shop/Category'));
const MenuCategory = lazy(() => import('../pages/customer/shop/MenuCategory'));
const Search = lazy(() => import('../pages/customer/shop/Search'));
const Sale = lazy(() => import('../pages/customer/shop/Sale'));
const ProductDetail = lazy(() => import('../pages/customer/product/ProductDetail'));
const Cart = lazy(() => import('../pages/customer/cart/Cart'));
const Wishlist = lazy(() => import('../pages/customer/wishlist/Wishlist'));
const Checkout = lazy(() => import('../pages/customer/checkout/Checkout'));
const OrderSuccess = lazy(() => import('../pages/customer/checkout/OrderSuccess'));
const Login = lazy(() => import('../pages/customer/auth/Login'));
const Register = lazy(() => import('../pages/customer/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/customer/auth/ForgotPassword'));
const VerifyEmail = lazy(() => import('../pages/customer/auth/VerifyEmail'));
const VerifyResetOtp = lazy(() => import('../pages/customer/auth/VerifyResetOtp'));
const ResetPassword = lazy(() => import('../pages/customer/auth/ResetPassword'));
const Account = lazy(() => import('../pages/customer/account/Account'));
const Profile = lazy(() => import('../pages/customer/account/Profile'));
const Orders = lazy(() => import('../pages/customer/account/Orders'));
const OrderDetail = lazy(() => import('../pages/customer/account/OrderDetail'));
const Addresses = lazy(() => import('../pages/customer/account/Addresses'));
const NotFound = lazy(() => import('../pages/customer/error/NotFound'));
const ServerError = lazy(() => import('../pages/customer/error/ServerError'));
const About = lazy(() => import('../pages/customer/info/About'));
const Shipping = lazy(() => import('../pages/customer/info/Shipping'));
const Returns = lazy(() => import('../pages/customer/info/Returns'));
const Faq = lazy(() => import('../pages/customer/info/Faq'));
const Careers = lazy(() => import('../pages/customer/info/Careers'));
const Contact = lazy(() => import('../pages/customer/info/Contact'));
const SizeGuide = lazy(() => import('../pages/customer/info/SizeGuide'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading full />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          
          {/* Shop Routes */}
          <Route path="/products" element={<Shop />} />
          <Route path="/products/sale" element={<Sale />} />
          <Route path="/products/shoes" element={<Category />} />
          <Route path="/products/clothing" element={<Category />} />
          <Route path="/products/accessories" element={<Category />} />
          <Route path="/products/:menuSlug" element={<MenuCategory />} />
          <Route path="/products/:menuSlug/:categorySlug" element={<MenuCategory />} />

          {/* Product & Cart */}
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Account Routes */}
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/account/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/account/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/account/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          <Route path="/account/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />

          {/* Info & Error Routes */}
          <Route path="/500" element={<ServerError />} />
          <Route path="/about" element={<About />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/size-guide" element={<SizeGuide />} />

          {/* 404 Catch All */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}