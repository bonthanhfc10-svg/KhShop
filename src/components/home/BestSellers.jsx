import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../product/ProductGrid';
import Loading from '../common/Loading';
import SectionHeader from '../common/SectionHeader';

export default function BestSellers() {
  const { products, loading } = useProducts('best', { count: 4 });

  return (
    <section className="bg-neutral-50 section-pad">
      <div className="container-kh">
        <SectionHeader
          eyebrow="Top rated"
          title="Best Sellers"
          linkTo="/shop"
          linkLabel="Shop All"
        />
        {loading ? <Loading /> : <ProductGrid products={products} cols={4} />}
      </div>
    </section>
  );
}
