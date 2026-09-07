import { Outlet } from 'react-router-dom';
import AnnouncementBar from '../components/customer/layout/AnnouncementBar';
import Header from '../components/customer/layout/Header';
import Footer from '../components/customer/layout/Footer';
import MiniCart from '../components/customer/cart/MiniCart';
import ScrollToTop from '../components/customer/layout/ScrollToTop';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MiniCart />
    </div>
  );
}
