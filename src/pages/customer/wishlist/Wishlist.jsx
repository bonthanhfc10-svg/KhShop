import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../../store/WishlistContext';
import { useAuth } from '../../../store/AuthContext';
import WishlistGrid from '../../../components/customer/wishlist/WishlistGrid';
import EmptyState from '../../../components/common/EmptyState';
import Loading from '../../../components/common/Loading';

export default function Wishlist() {
  const { wishlist, wishlistLoaded, loadAuthWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    if (user && !wishlistLoaded) {
      loadAuthWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!wishlistLoaded) {
    return (
      <main className="container-kh py-4">
        <Loading full />
      </main>
    );
  }

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
