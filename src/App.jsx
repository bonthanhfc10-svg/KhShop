import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import AppRoutes from './routes/AppRoutes';
import AdminRoutes from './admin/routes/AdminRoutes';

const RouterSwitch = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname === '/admin/login';
  return isAdminPath ? <AdminRoutes /> : <AppRoutes />;
};

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AdminAuthProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <RouterSwitch />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
