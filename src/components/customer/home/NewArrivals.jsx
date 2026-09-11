import ProductGrid from '../product/ProductGrid';
import SectionHeader from '../../common/SectionHeader';

export default function NewArrivals({ products }) {
  return (
    <section className="section-pad container-kh">
      <SectionHeader
        eyebrow="Just dropped"
        title="New Arrivals"
      />
      <ProductGrid products={products} cols={4} />
    </section>
  );
}
