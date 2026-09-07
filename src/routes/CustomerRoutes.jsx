import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/CustomerLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Loading from '../components/common/Loading';

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

const Page = ({ children }) => (
  <Suspense fallback={<Loading full />}>{children}</Suspense>
);

const AuthPage = ({ children }) => <ProtectedRoute><Page>{children}</Page></ProtectedRoute>;

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/shop" element={<Page><Shop /></Page>} />
        <Route path="/shop/shoes" element={<Page><Category /></Page>} />
        <Route path="/shop/clothing" element={<Page><Category /></Page>} />
        <Route path="/shop/accessories" element={<Page><Category /></Page>} />

        <Route path="/shop/:group" element={<Page><MenuCategory /></Page>} />
        <Route path="/shop/:group/:category" element={<Page><MenuCategory /></Page>} />

        <Route path="/shop/sale" element={<Page><Sale /></Page>} />
        <Route path="/search" element={<Page><Search /></Page>} />
        <Route path="/product/:id" element={<Page><ProductDetail /></Page>} />
        <Route path="/cart" element={<Page><Cart /></Page>} />
        <Route path="/wishlist" element={<Page><Wishlist /></Page>} />
        <Route path="/checkout" element={<Page><Checkout /></Page>} />
        <Route path="/order-success" element={<Page><OrderSuccess /></Page>} />
        <Route path="/login" element={<Page><Login /></Page>} />
        <Route path="/register" element={<Page><Register /></Page>} />
        <Route path="/forgot-password" element={<Page><ForgotPassword /></Page>} />
        <Route path="/verify-email" element={<Page><VerifyEmail /></Page>} />
        <Route path="/verify-reset-otp" element={<Page><VerifyResetOtp /></Page>} />
        <Route path="/reset-password" element={<Page><ResetPassword /></Page>} />

        <Route path="/account" element={<AuthPage><Account /></AuthPage>} />
        <Route path="/account/profile" element={<AuthPage><Profile /></AuthPage>} />
        <Route path="/account/orders" element={<AuthPage><Orders /></AuthPage>} />
        <Route path="/account/orders/:id" element={<AuthPage><OrderDetail /></AuthPage>} />
        <Route path="/account/addresses" element={<AuthPage><Addresses /></AuthPage>} />

        <Route path="/500" element={<Page><ServerError /></Page>} />

        <Route path="/about" element={<Page><About /></Page>} />
        <Route path="/shipping" element={<Page><Shipping /></Page>} />
        <Route path="/returns" element={<Page><Returns /></Page>} />
        <Route path="/faq" element={<Page><Faq /></Page>} />
        <Route path="/careers" element={<Page><Careers /></Page>} />
        <Route path="/contact" element={<Page><Contact /></Page>} />
        <Route path="/size-guide" element={<Page><SizeGuide /></Page>} />

        <Route path="*" element={<Page><NotFound /></Page>} />
      </Route>
    </Routes>
  );
}
