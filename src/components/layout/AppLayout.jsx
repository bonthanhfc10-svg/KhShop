import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import MiniCart from '../cart/MiniCart';
import ScrollToTop from './ScrollToTop';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <MiniCart />
    </div>
  );
}
