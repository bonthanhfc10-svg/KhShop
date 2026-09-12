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

  const [guestCart, setGuestCart] = useState(() => storage.get('cart', []));
  const [authCart, setAuthCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const cart = isAuth ? authCart : guestCart;

  // Persist guest cart to localStorage
  useEffect(() => {
    if (!isAuth) {
      storage.set('cart', guestCart);
    }
  }, [guestCart, isAuth]);

  // On login: merge guest cart into backend
  useEffect(() => {
    const wasAuth = prevAuthRef.current;
    prevAuthRef.current = isAuth;

    if (isAuth) {
      if (!wasAuth) {
        // Transition: guest → authenticated — merge guest cart
        const guestItems = storage.get('cart', []);
        if (guestItems.length > 0) {
          const payload = guestItems
            .filter((i) => i.variant_id)
            .map((i) => ({ variant_id: i.variant_id, qty: i.quantity }));

          if (payload.length > 0) {
            cartService
              .merge(payload)
              .then((res) => {
                const items = res?.data?.cart_items || [];
                setAuthCart(items.map(mapBackendCartItem));
                storage.remove('cart');
                setGuestCart([]);
              })
              .catch(() => {
                // Merge failed — keep guest cart intact in localStorage
              });
          } else {
            storage.remove('cart');
            setGuestCart([]);
          }
        } else {
          loadAuthCart();
        }
      } else {
        // Already authenticated on mount — load cart
        loadAuthCart();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  // On logout: clear auth cart
  useEffect(() => {
    const wasAuth = prevAuthRef.current;
    if (!isAuth && wasAuth) {
      setAuthCart([]);
    }
  }, [isAuth]);

  const loadAuthCart = async () => {
    setLoading(true);
    try {
      const res = await cartService.getCart();
      const items = res?.data?.cart_items || [];
      setAuthCart(items.map(mapBackendCartItem));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthCart = async () => {
    if (!isAuth) return;
    try {
      const res = await cartService.getCart();
      const items = res?.data?.cart_items || [];
      setAuthCart(items.map(mapBackendCartItem));
    } catch {
      // ignore
    }
  };

  const addToCart = (product, { variant_id, size, color, colorImage, quantity = 1 }) => {
    if (isAuth) {
      const payload = {
        product_id: product.id,
        color_id: product.colors?.find((c) => c.name === color)?.id,
        size_id: product.sizes?.find((s) => s.name === size)?.id || null,
        qty: quantity,
      };
      cartService
        .addItem(payload)
        .then(() => fetchAuthCart())
        .catch(() => {});
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
    }
    openCart();
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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart, isOpen, loading, cartTotal, cartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
