import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import WishlistGrid from '../../components/wishlist/WishlistGrid';
import EmptyState from '../../components/common/EmptyState';

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
              actionTo="/shop"
            />
          ) : (
            <WishlistGrid wishlistIds={wishlist.map((w) => w.id)} />
          )}
        </div>
      </div>
    </main>
  );
}
