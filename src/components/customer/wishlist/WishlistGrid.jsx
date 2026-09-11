import WishlistItem from './WishlistItem';
import { useProducts } from '../../../hooks/useProducts';
import Loading from '../../common/Loading';

export default function WishlistGrid({ wishlistIds }) {
  const { products: allProducts, loading } = useProducts('list');

  if (loading) return <Loading />;

  const items = allProducts.filter((p) => wishlistIds.includes(p.id));

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
      {items.map((product) => (
        <WishlistItem key={product.id} product={product} />
      ))}
    </div>
  );
}
