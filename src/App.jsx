import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './store/AuthContext';
import { CartProvider } from './store/CartContext';
import { WishlistProvider } from './store/WishlistContext';
import { AdminAuthProvider } from './store/AdminAuthContext';
import AppRoutes from './routes/CustomerRoutes';
import AdminRoutes from './routes/AdminRoutes';

const RouterSwitch = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname === '/admin/login';
  return isAdminPath ? <AdminRoutes /> : <AppRoutes />;
};

function Auth401Handler() {
  const navigate = useNavigate();
  useEffect(() => {
    const handler = () => {
      navigate('/login', { replace: true });
    };
    window.addEventListener('auth:401', handler);
    return () => window.removeEventListener('auth:401', handler);
  }, [navigate]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AdminAuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Auth401Handler />
              <RouterSwitch />
            </CartProvider>
          </WishlistProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
