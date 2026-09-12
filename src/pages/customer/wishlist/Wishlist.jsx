import { Heart } from 'lucide-react';
import { useWishlist } from '../../../store/WishlistContext';
import WishlistGrid from '../../../components/customer/wishlist/WishlistGrid';
import EmptyState from '../../../components/common/EmptyState';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <main>
      <div className="container-kh py-4">
        <div className="mt-4">
          {wishlist.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              description="Save the pieces you love and come back to them anytime."
              actionLabel="Continue Shopping"
              actionTo="/products/women"
            />
          ) : (
            <WishlistGrid wishlist={wishlist} />
          )}
        </div>
      </div>
    </main>
  );
}
