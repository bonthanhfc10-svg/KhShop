import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Loading from '../components/common/Loading';

const Home = lazy(() => import('../pages/Home'));
const Shop = lazy(() => import('../pages/shop/Shop'));
const Category = lazy(() => import('../pages/shop/Category'));
const MenuCategory = lazy(() => import('../pages/shop/MenuCategory'));
const Search = lazy(() => import('../pages/shop/Search'));
const Sale = lazy(() => import('../pages/shop/Sale'));
const ProductDetail = lazy(() => import('../pages/product/ProductDetail'));
const Cart = lazy(() => import('../pages/cart/Cart'));
const Wishlist = lazy(() => import('../pages/wishlist/Wishlist'));
const Checkout = lazy(() => import('../pages/checkout/Checkout'));
const OrderSuccess = lazy(() => import('../pages/checkout/OrderSuccess'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const Account = lazy(() => import('../pages/account/Account'));
const Profile = lazy(() => import('../pages/account/Profile'));
const Orders = lazy(() => import('../pages/account/Orders'));
const OrderDetail = lazy(() => import('../pages/account/OrderDetail'));
const Addresses = lazy(() => import('../pages/account/Addresses'));
const NotFound = lazy(() => import('../pages/error/NotFound'));
const ServerError = lazy(() => import('../pages/error/ServerError'));
const About = lazy(() => import('../pages/info/About'));
const Shipping = lazy(() => import('../pages/info/Shipping'));
const Returns = lazy(() => import('../pages/info/Returns'));
const Faq = lazy(() => import('../pages/info/Faq'));
const Careers = lazy(() => import('../pages/info/Careers'));
const Contact = lazy(() => import('../pages/info/Contact'));
const SizeGuide = lazy(() => import('../pages/info/SizeGuide'));

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
