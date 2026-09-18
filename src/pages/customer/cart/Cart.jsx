import { useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../../store/CartContext';
import CartList from '../../../components/customer/cart/CartList';
import CartSummary from '../../../components/customer/cart/CartSummary';
import EmptyState from '../../../components/common/EmptyState';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, fetchAuthCart, cartLoaded, loading, cartError } = useCart();

  useEffect(() => {
    if (!cartLoaded) {
      fetchAuthCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <main className="container-kh py-4">
        <Loading full />
      </main>
    );
  }

  if (cartError) {
    return (
      <main className="container-kh py-4">
        <EmptyState
          icon={ShoppingBag}
          title="Something went wrong"
          description={cartError}
          actionLabel="Try Again"
          actionTo="/cart"
        />
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="container-kh py-4">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Let's fix that."
          actionLabel="Continue Shopping"
          actionTo="/women"
        />
      </main>
    );
  }

  return (
    <main>
      <div className="container-kh py-4">
        <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div>
            <CartList
              items={cart}
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
            <div className="mt-6">
              <Button to="/products/women" variant="secondary">
                Continue Shopping
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="lg:sticky lg:top-28">
              <CartSummary subtotal={cartTotal} />
              <div className="mt-4">
                  <Button to="/checkout" className="w-full" size="lg">
                    Checkout
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
