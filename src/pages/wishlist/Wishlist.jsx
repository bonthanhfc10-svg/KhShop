import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import WishlistGrid from '../../components/wishlist/WishlistGrid';
import EmptyState from '../../components/common/EmptyState';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <main>
      <div className="container-kh py-12 sm:py-16">
        <h1 className="heading-display text-4xl sm:text-5xl">Wishlist</h1>
        <p className="mt-2 text-sm text-neutral-500">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
        </p>

        <div className="mt-10">
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
