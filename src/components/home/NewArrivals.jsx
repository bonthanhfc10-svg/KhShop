import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../product/ProductGrid';
import Loading from '../common/Loading';
import SectionHeader from '../common/SectionHeader';

export default function NewArrivals() {
  const { products, loading } = useProducts('new', { count: 4 });

  return (
    <section className="section-pad container-kh">
      <SectionHeader
        eyebrow="Just dropped"
        title="New Arrivals"
        linkTo="/shop?sort=newest"
        linkLabel="Shop New In"
      />
      {loading ? <Loading /> : <ProductGrid products={products} cols={4} />}
    </section>
  );
}
