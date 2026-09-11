import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../components/customer/layout/ScrollToTop';
import AnnouncementBar from '../components/customer/layout/AnnouncementBar';
import Header from '../components/customer/layout/Header';
import Footer from '../components/customer/layout/Footer';
import MiniCart from '../components/customer/cart/MiniCart';
import { menuService } from '../services/menuService';
import { MenuProvider } from '../store/MenuContext';

export default function CustomerLayout() {
  const [menuData, setMenuData] = useState({ navigation: [], rawMenus: [], menuLoading: true });

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

  return (
    <MenuProvider value={menuData}>
      <ScrollToTop />
      <AnnouncementBar />
      <Header navigation={menuData.navigation} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <MiniCart />
    </MenuProvider>
  );
}
