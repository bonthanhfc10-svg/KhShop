import HeroSection from '../../components/customer/home/HeroSection';
import FeaturedProducts from '../../components/customer/home/FeaturedProducts';
import NewArrivals from '../../components/customer/home/NewArrivals';
import BestSellers from '../../components/customer/home/BestSellers';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <NewArrivals />
      <BestSellers />
    </main>
  );
}
