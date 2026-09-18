import { useEffect, useState, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ScrollToTop from '../components/customer/layout/ScrollToTop';
import AnnouncementBar from '../components/customer/layout/AnnouncementBar';
import Header from '../components/customer/layout/Header';
import Footer from '../components/customer/layout/Footer';
import MiniCart from '../components/customer/cart/MiniCart';
import ConfirmModal from '../components/common/ConfirmModal';
import { menuService } from '../services/menuService';
import { MenuProvider } from '../store/MenuContext';
import { useAuth } from '../store/AuthContext';

export default function CustomerLayout() {
  const [menuData, setMenuData] = useState({ navigation: [], rawMenus: [], menuLoading: true });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    menuService
      .getMenu()
      .then((data) => {
        if (active) setMenuData({ ...data, menuLoading: false });
      })
      .catch(() => {
        if (active) setMenuData({ navigation: [], rawMenus: [], menuLoading: false });
      });
    return () => {
      active = false;
    };
  }, []);

  const handleLogoutRequest = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const handleConfirmLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await logout();
      setConfirmOpen(false);
      navigate('/');
    } catch {
      setLoggingOut(false);
    }
  }, [logout, navigate]);

  return (
    <MenuProvider value={menuData}>
      <ScrollToTop />
      <AnnouncementBar />
      <Header navigation={menuData.navigation} onLogout={handleLogoutRequest} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <MiniCart />

      <ConfirmModal
        open={confirmOpen}
        onClose={() => { if (!loggingOut) setConfirmOpen(false); }}
        onConfirm={handleConfirmLogout}
        title="Logout"
        message="Are you sure you want to logout? Your current account session will be ended."
        confirmLabel="Logout"
        loading={loggingOut}
      />
    </MenuProvider>
  );
}
