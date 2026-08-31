import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import NewArrivals from '../components/home/NewArrivals';
import PromoBanner from '../components/home/PromoBanner';
import BestSellers from '../components/home/BestSellers';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <NewArrivals />
      <PromoBanner />
      <BestSellers />
    </main>
  );
}
