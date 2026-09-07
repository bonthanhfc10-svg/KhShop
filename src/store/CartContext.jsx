import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../utils/storage';
import { formatPrice } from '../utils/formatPrice';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => storage.get('cart', []));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    storage.set('cart', cart);
  }, [cart]);

  const addToCart = (product, { size, color, colorImage, quantity = 1 }) => {
    setCart((prev) => {
      const index = prev.findIndex(
        (i) => i.id === product.id && i.size === size && i.color === color
      );
      if (index !== -1) {
        const next = [...prev];
        next[index] = {
          ...next[index],
          quantity: next[index].quantity + quantity,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          category: product.categoryName,
          image: product.images[0],
          price: product.price,
          size,
          color,
          colorImage,
          quantity,
        },
      ];
    });
    openCart();
  };

  const removeFromCart = (itemId, size, color) => {
    setCart((prev) =>
      prev.filter(
        (i) => !(i.id === itemId && i.size === size && i.color === color)
      )
    );
  };

  const updateQuantity = (itemId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.id === itemId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setCart([]);

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
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartTotalFormatted,
      cartCount,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart, isOpen, cartTotal, cartCount]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
