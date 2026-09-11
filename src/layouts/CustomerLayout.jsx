import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../components/customer/layout/ScrollToTop';
import AnnouncementBar from '../components/customer/layout/AnnouncementBar';
import Header from '../components/customer/layout/Header';
import Footer from '../components/customer/layout/Footer';
import MiniCart from '../components/customer/cart/MiniCart';
import { menuService } from '../services/menuService';

export default function CustomerLayout() {
  const [navigation, setNavigation] = useState([]);

  useEffect(() => {
    let active = true;
    menuService
      .getMenu()
      .then((nav) => {
        if (active) setNavigation(nav);
      })
      .catch(() => {
        if (active) setNavigation([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <AnnouncementBar />
      <Header navigation={navigation} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <MiniCart />
    </>
  );
}
