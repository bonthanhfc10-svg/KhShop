import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { storage } from '../utils/storage';
import { formatPrice } from '../utils/formatPrice';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

function mapBackendCartItem(item) {
  const v = item.variant || {};
  return {
    id: v.product?.id ?? item.id,
    name: v.product?.name ?? 'Product',
    slug: v.product?.slug ?? '',
    image: v.image?.image_path || v.product?.images?.[0]?.image_path || '/images/placeholder.svg',
    price: Number(v.product?.price || 0) + Number(v.price_modifier || 0),
    size: v.size?.name || null,
    color: v.color?.name || null,
    colorImage: v.image?.image_path || null,
    quantity: item.qty,
    variant_id: v.id,
    product_id: v.product?.id,
    color_id: v.color?.id,
    size_id: v.size?.id || null,
    cart_item_id: item.id,
  };
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const isAuth = Boolean(user);
  const prevAuthRef = useRef(isAuth);
  const hasSyncedRef = useRef(false);

  const [guestCart, setGuestCart] = useState(() => storage.get('cart', []));
  const [authCart, setAuthCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const cart = isAuth ? authCart : guestCart;

  // Persist guest cart to localStorage
  useEffect(() => {
    if (!isAuth) {
      storage.set('cart', guestCart);
    }
  }, [guestCart, isAuth]);

  const fetchAuthCart = async () => {
    if (!isAuth) return;
    try {
      const res = await cartService.getCart();
      const items = res?.data?.cart_items || [];
      setAuthCart(items.map(mapBackendCartItem));
      setCartLoaded(true);
    } catch {
      // ignore
    }
  };

  /**
   * Synchronize guest localStorage cart with the authenticated backend cart.
   * Safe to call multiple times — the hasSyncedRef guard prevents duplicate merges.
   * Returns a promise so callers (e.g. Login) can await completion.
   */
  const syncAfterAuth = async () => {
    if (!isAuth) return;

    if (!hasSyncedRef.current) {
      hasSyncedRef.current = true;

      const guestItems = storage.get('cart', []);
      if (guestItems.length > 0) {
        const payload = guestItems
          .filter((i) => i.variant_id)
          .map((i) => ({ variant_id: i.variant_id, qty: i.quantity }));

        if (payload.length > 0) {
          try {
            const res = await cartService.merge(payload);
            const items = res?.data?.cart_items || [];
            setAuthCart(items.map(mapBackendCartItem));
            setCartLoaded(true);
            storage.remove('cart');
            setGuestCart([]);
          } catch {
            // Merge failed — keep guest cart intact in localStorage
          }
        } else {
          storage.remove('cart');
          setGuestCart([]);
        }
      }
    }

    // Always fetch latest auth cart to ensure UI is up to date
    await fetchAuthCart();
  };

  // On login: merge guest cart into backend; On logout: clear auth cart
  useEffect(() => {
    const wasAuth = prevAuthRef.current;
    prevAuthRef.current = isAuth;

    if (isAuth && !wasAuth) {
      syncAfterAuth();
    } else if (!isAuth && wasAuth) {
      hasSyncedRef.current = false;
      setAuthCart([]);
      setCartLoaded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  const loadAuthCart = async () => {
    if (!isAuth) return;
    setLoading(true);
    try {
      const res = await cartService.getCart();
      const items = res?.data?.cart_items || [];
      setAuthCart(items.map(mapBackendCartItem));
      setCartLoaded(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product, { variant_id, size, color, colorImage, quantity = 1 }) => {
    if (isAuth) {
      setAddingToCart(true);
      const payload = {
        product_id: product.id,
        color_id: product.colors?.find((c) => c.name === color)?.id,
        size_id: product.sizes?.find((s) => s.name === size)?.id || null,
        qty: quantity,
      };
      return cartService
        .addItem(payload)
        .then(() => fetchAuthCart())
        .finally(() => setAddingToCart(false));
    } else {
      setGuestCart((prev) => {
        const key = variant_id || `${product.id}-${size}-${color}`;
        const index = prev.findIndex((i) => i.key === key);
        if (index !== -1) {
          const next = [...prev];
          next[index] = { ...next[index], quantity: next[index].quantity + quantity };
          return next;
        }
        return [
          ...prev,
          {
            key,
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.images?.[0] || '/images/placeholder.svg',
            price: product.price,
            size,
            color,
            colorImage,
            quantity,
            variant_id,
          },
        ];
      });
      openCart();
      return Promise.resolve();
    }
  };

  const removeFromCart = (itemId, size, color) => {
    if (isAuth) {
      const item = authCart.find(
        (i) => i.id === itemId && i.size === size && i.color === color
      );
      if (item?.cart_item_id) {
        cartService
          .removeItem(item.cart_item_id)
          .then(() => fetchAuthCart())
          .catch(() => {});
      }
    } else {
      setGuestCart((prev) =>
        prev.filter((i) => !(i.id === itemId && i.size === size && i.color === color))
      );
    }
  };

  const updateQuantity = (itemId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId, size, color);
      return;
    }
    if (isAuth) {
      const item = authCart.find(
        (i) => i.id === itemId && i.size === size && i.color === color
      );
      if (item?.cart_item_id) {
        setAuthCart((prev) =>
          prev.map((i) =>
            i.id === itemId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          )
        );
        cartService
          .updateItem(item.cart_item_id, quantity)
          .then(() => fetchAuthCart())
          .catch(() => {});
      }
    } else {
      setGuestCart((prev) =>
        prev.map((i) =>
          i.id === itemId && i.size === size && i.color === color
            ? { ...i, quantity }
            : i
        )
      );
    }
  };

  const clearCart = () => {
    if (isAuth) {
      cartService.clear().catch(() => {});
      setAuthCart([]);
    } else {
      setGuestCart([]);
    }
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotalFormatted = formatPrice(cartTotal);

  const value = useMemo(
    () => ({
      cart,
      isOpen,
      loading,
      cartLoaded,
      addingToCart,
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartTotalFormatted,
      cartCount,
      fetchAuthCart,
      loadAuthCart,
      syncAfterAuth,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart, isOpen, loading, cartLoaded, addingToCart, cartTotal, cartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
