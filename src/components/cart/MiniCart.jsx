import { Link } from 'react-router-dom';
import { X, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;

export default function MiniCart() {
  const {
    cart,
    isOpen,
    closeCart,
    cartTotal,
  } = useCart();

  const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = cartTotal + shipping;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  return (
    <>
      <div
        className={`fixed inset-0 z-[80] bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-[85] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-neutral-900">
            <ShoppingBag size={18} />
            Your Bag
            {cart.length > 0 && (
              <span className="text-neutral-400">({cart.length})</span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-1 text-neutral-500 transition-colors hover:text-black"
            aria-label="Close bag"
          >
            <X size={22} />
          </button>
        </div>

        {remaining > 0 && cart.length > 0 && (
          <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-3">
            <p className="text-xs text-neutral-600">
              You're {formatPrice(remaining)} away from{' '}
              <span className="font-semibold">free shipping</span>.
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6">
          {cart.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your bag is empty"
              description="Add some pieces to get started."
            />
          ) : (
            <div>
              {cart.map((item) => (
                <MiniCartItem
                  key={`${item.id}-${item.size}-${item.color}`}
                  item={item}
                  onClose={closeCart}
                />
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-neutral-200 px-6 py-5">
            <div className="mb-1 flex justify-between text-sm text-neutral-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            <div className="mb-5 flex justify-between text-base font-bold text-neutral-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="space-y-3">
              <Button
                to="/checkout"
                onClick={onNavigateClose(closeCart)}
                className="w-full"
                size="lg"
              >
                Checkout
              </Button>
              <Button
                to="/cart"
                variant="secondary"
                onClick={onNavigateClose(closeCart)}
                className="w-full"
              >
                View Bag
              </Button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

const onNavigateClose = (fn) => () => fn();

function MiniCartItem({ item, onClose }) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex gap-4 border-b border-neutral-200 py-5">
      <Link
        to={`/product/${item.id}`}
        onClick={onClose}
        className="block h-24 w-20 shrink-0 overflow-hidden bg-neutral-100"
      >
        <img
          src={item.colorImage || item.image}
          alt={item.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-display text-sm font-bold text-neutral-900">
              {item.name}
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">
              {item.size && `Size: ${item.size} · `}
              {item.color}
            </p>
          </div>
          <button
            onClick={() => removeFromCart(item.id, item.size, item.color)}
            className="p-1 text-neutral-400 hover:text-accent"
            aria-label={`Remove ${item.name}`}
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-sm font-bold text-neutral-900">
            {formatPrice(item.price * item.quantity)}
          </p>
          <div className="flex items-center border border-neutral-300">
            <button
              onClick={() =>
                updateQuantity(item.id, item.size, item.color, item.quantity - 1)
              }
              className="flex h-7 w-7 items-center justify-center text-neutral-600 hover:text-black"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="w-7 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() =>
                updateQuantity(item.id, item.size, item.color, item.quantity + 1)
              }
              className="flex h-7 w-7 items-center justify-center text-neutral-600 hover:text-black"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
