import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../utils/storage';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => storage.get('wishlist', []));

  useEffect(() => {
    storage.set('wishlist', wishlist);
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev
        : [...prev, { id: product.id, name: product.name, slug: product.slug }]
    );
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, { id: product.id, name: product.name, slug: product.slug }]
    );
  };

  const isInWishlist = (productId) =>
    wishlist.some((p) => p.id === productId);

  const value = useMemo(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      wishlistCount: wishlist.length,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wishlist]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
