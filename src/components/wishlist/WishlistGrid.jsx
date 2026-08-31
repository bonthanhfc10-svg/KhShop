import WishlistItem from './WishlistItem';
import { products as allProducts } from '../../data/products';

export default function WishlistGrid({ wishlistIds }) {
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
