import ProductGrid from '../product/ProductGrid';
import Loading from '../../common/Loading';
import SectionHeader from '../../common/SectionHeader';

export default function FeaturedProducts({ products, loading }) {
  const featured = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="bg-neutral-50 section-pad">
      <div className="container-kh">
        <SectionHeader
          eyebrow="Most loved"
          title="Featured Products"
        />
        {loading ? <Loading /> : <ProductGrid products={featured} cols={4} breadcrumbContext={[]} />}
      </div>
    </section>
  );
}
