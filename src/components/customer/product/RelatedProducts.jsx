import { useProducts } from '../../../hooks/useProducts';
import ProductGrid from './ProductGrid';
import SectionHeader from '../../common/SectionHeader';

export default function RelatedProducts({ product, categorySlug }) {
  const { products, loading } = useProducts('related', { product, categorySlug });

  if (loading) return null;
  if (!products || products.length === 0) return null;

  return (
    <section className="section-pad container-kh">
      <SectionHeader eyebrow="Complete the look" title="You May Also Like" />
      <ProductGrid products={products} cols={4} />
    </section>
  );
}
