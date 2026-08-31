import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../product/ProductGrid';
import Loading from '../common/Loading';
import SectionHeader from '../common/SectionHeader';

export default function FeaturedProducts() {
  const { products, loading } = useProducts('featured', { count: 8 });

  return (
    <section className="bg-neutral-50 section-pad">
      <div className="container-kh">
        <SectionHeader
          eyebrow="Most loved"
          title="Featured Products"
          linkTo="/shop"
          linkLabel="View All"
        />
        {loading ? <Loading /> : <ProductGrid products={products} cols={4} />}
      </div>
    </section>
  );
}
