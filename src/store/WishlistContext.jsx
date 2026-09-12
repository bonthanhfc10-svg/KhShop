import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { storage } from '../utils/storage';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const isAuth = Boolean(user);
  const prevAuthRef = useRef(isAuth);

  const [guestWishlist, setGuestWishlist] = useState(() => storage.get('wishlist', []));
  const [authWishlist, setAuthWishlist] = useState([]);

  const wishlist = isAuth ? authWishlist : guestWishlist;

  // Persist guest wishlist to localStorage
  useEffect(() => {
    if (!isAuth) {
      storage.set('wishlist', guestWishlist);
    }
  }, [guestWishlist, isAuth]);

  // On login: merge guest wishlist into backend, then load backend wishlist
  useEffect(() => {
    const wasAuth = prevAuthRef.current;
    prevAuthRef.current = isAuth;

    if (isAuth) {
      if (!wasAuth) {
        const guestItems = storage.get('wishlist', []);
        const guestProductIds = guestItems.map((item) => item.product_id || item.id);

        if (guestProductIds.length > 0) {
          wishlistService
            .merge(guestProductIds)
            .then(() => {
              storage.remove('wishlist');
              setGuestWishlist([]);
              return loadAuthWishlist();
            })
            .catch(() => {
              // Merge failed — keep guest wishlist intact in localStorage
            });
        } else {
          loadAuthWishlist();
        }
      } else {
        loadAuthWishlist();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  const loadAuthWishlist = async () => {
    try {
      const res = await wishlistService.getAll();
      const items = res?.data?.wishlists || [];
      setAuthWishlist(items);
    } catch {
      // ignore
    }
  };

  const addToWishlist = (product) => {
    if (isAuth) {
      wishlistService
        .add(product.id)
        .then(() => loadAuthWishlist())
        .catch(() => {});
    } else {
      setGuestWishlist((prev) => {
        if (prev.some((item) => (item.product_id || item.id) === product.id)) {
          return prev;
        }
        return [...prev, { product_id: product.id, id: null, product }];
      });
    }
  };

  const removeFromWishlist = (wishlistId) => {
    if (isAuth) {
      wishlistService
        .remove(wishlistId)
        .then(() => loadAuthWishlist())
        .catch(() => {});
    } else {
      setGuestWishlist((prev) => prev.filter((item) => (item.product_id || item.id) !== wishlistId));
    }
  };

  const toggleWishlist = (product) => {
    if (isAuth) {
      const existing = authWishlist.find((item) => item.product_id === product.id);
      if (existing) {
        removeFromWishlist(existing.id);
      } else {
        addToWishlist(product);
      }
    } else {
      const exists = guestWishlist.some((item) => (item.product_id || item.id) === product.id);
      if (exists) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  const isInWishlist = (productId) => {
    if (isAuth) {
      return authWishlist.some((item) => item.product_id === productId);
    }
    return guestWishlist.some((item) => (item.product_id || item.id) === productId);
  };

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
