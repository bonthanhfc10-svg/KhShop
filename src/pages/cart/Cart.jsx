import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartList from '../../components/cart/CartList';
import CartSummary from '../../components/cart/CartSummary';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <main className="container-kh py-4">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Let's fix that."
          actionLabel="Continue Shopping"
          actionTo="/shop"
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
              <Button to="/shop" variant="secondary">
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
