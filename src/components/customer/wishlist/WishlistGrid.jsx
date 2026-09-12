import ProductCard from '../product/ProductCard';
import { mapApiProductList } from '../../../services/productService';
import { useWishlist } from '../../../store/WishlistContext';

export default function WishlistGrid({ wishlist }) {
  const { removeFromWishlist } = useWishlist();

  if (!wishlist || wishlist.length === 0) return null;

  const handleRemove = (product) => {
    const item = wishlist.find((w) => w.product_id === product.id);
    if (item) {
      removeFromWishlist(item.id);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
      {wishlist.map((item) => {
        const mapped = mapApiProductList(item.product);
        return (
          <ProductCard
            key={item.product_id || item.id}
            product={mapped}
            onRemove={handleRemove}
          />
        );
      })}
    </div>
  );
}
