import ProductGrid from '../product/ProductGrid';
import SectionHeader from '../../common/SectionHeader';

export default function BestSellers({ products }) {
  return (
    <section className="bg-neutral-50 section-pad">
      <div className="container-kh">
        <SectionHeader
          eyebrow="Top rated"
          title="Best Sellers"
        />
        <ProductGrid products={products} cols={4} />
      </div>
    </section>
  );
}
