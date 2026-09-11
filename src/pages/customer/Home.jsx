import { useEffect, useState } from 'react';
import HeroSection from '../../components/customer/home/HeroSection';
import NewArrivals from '../../components/customer/home/NewArrivals';
import BestSellers from '../../components/customer/home/BestSellers';
import Loading from '../../components/common/Loading';
import { homeService } from '../../services/homeService';
import { mapApiProduct } from '../../utils/mapApiProduct';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [specialProducts, setSpecialProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    homeService
      .getHome()
      .then((res) => {
        if (!active) return;
        setBanners(res.banners || []);
        setNewArrivals(
          (res.new_arrivals?.data || []).map(mapApiProduct).slice(0, 4)
        );
        setSpecialProducts(
          (res.special_products?.data || []).map(mapApiProduct).slice(0, 4)
        );
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Failed to load homepage.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <Loading full />;

  if (error) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-neutral-500">{error}</p>
      </main>
    );
  }

  return (
    <main>
      <HeroSection banner={banners[0] || null} />
      <NewArrivals products={newArrivals} />
      <BestSellers products={specialProducts} />
    </main>
  );
}
