import ProductCard from './ProductCard';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';
import { PackageSearch } from 'lucide-react';

export default function ProductGrid({ products, loading = false, cols = 4 }) {
  if (loading) return <Loading />;

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No products found"
        description="Try adjusting your filters or search terms."
        actionLabel="Shop All"
        actionTo="/shop"
      />
    );
  }

  const colsMap = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  };

  return (
    <div className={`grid gap-x-4 gap-y-10 sm:gap-x-6 ${colsMap[cols] || colsMap[4]}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
