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
  const [wishlistLoaded, setWishlistLoaded] = useState(false);
  const [togglingWishlistId, setTogglingWishlistId] = useState(null);

  const wishlist = isAuth ? authWishlist : guestWishlist;

  // Persist guest wishlist to localStorage
  useEffect(() => {
    if (!isAuth) {
      storage.set('wishlist', guestWishlist);
    }
  }, [guestWishlist, isAuth]);

  // On login: merge guest wishlist into backend; On logout: clear auth wishlist
  useEffect(() => {
    const wasAuth = prevAuthRef.current;
    prevAuthRef.current = isAuth;

    if (isAuth && !wasAuth) {
      // Transition: guest → authenticated — merge guest wishlist
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
    } else if (!isAuth && wasAuth) {
      // Transition: authenticated → guest — clear auth wishlist
      setAuthWishlist([]);
      setWishlistLoaded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  const loadAuthWishlist = async () => {
    if (!isAuth) return;
    try {
      const res = await wishlistService.getAll();
      const items = res?.data?.wishlists || [];
      setAuthWishlist(items);
      setWishlistLoaded(true);
    } catch {
      // ignore
    }
  };

  const addToWishlist = (product) => {
    if (isAuth) {
      return wishlistService
        .add(product.id)
        .then(() => loadAuthWishlist());
    } else {
      setGuestWishlist((prev) => {
        if (prev.some((item) => (item.product_id || item.id) === product.id)) {
          return prev;
        }
        return [...prev, { product_id: product.id, id: null, product }];
      });
      return Promise.resolve();
    }
  };

  const removeFromWishlist = (wishlistId) => {
    if (isAuth) {
      return wishlistService
        .remove(wishlistId)
        .then(() => loadAuthWishlist());
    } else {
      setGuestWishlist((prev) => prev.filter((item) => (item.product_id || item.id) !== wishlistId));
      return Promise.resolve();
    }
  };

  const toggleWishlist = (product) => {
    if (isAuth) {
      const existing = authWishlist.find((item) => item.product_id === product.id);
      setTogglingWishlistId(product.id);
      const promise = existing
        ? removeFromWishlist(existing.id)
        : addToWishlist(product);
      return promise.finally(() => setTogglingWishlistId(null));
    } else {
      const exists = guestWishlist.some((item) => (item.product_id || item.id) === product.id);
      if (exists) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
      return Promise.resolve();
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
      wishlistLoaded,
      togglingWishlistId,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      loadAuthWishlist,
      wishlistCount: wishlist.length,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wishlist, wishlistLoaded, togglingWishlistId]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
