import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';

export default function OrderSummary({ items, subtotal, shipping, discount = 0 }) {
  const total = subtotal - discount + shipping;

  return (
    <div className="border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
      <h2 className="mb-6 font-display text-sm font-bold uppercase tracking-widest text-neutral-900">
        Order Summary
      </h2>

      <div className="max-h-64 space-y-4 overflow-y-auto">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
            <Link
              to={`/product/${item.id}`}
              className="block h-16 w-14 shrink-0 overflow-hidden bg-neutral-200"
            >
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </Link>
            <div className="flex-1">
              <p className="text-sm font-semibold text-neutral-900">{item.name}</p>
              <p className="text-xs text-neutral-500">
                {item.size && `Size: ${item.size}`}
                {item.color && ` · ${item.color}`}
                <span className="ml-1 text-neutral-400">× {item.quantity}</span>
              </p>
              <p className="mt-1 text-sm font-bold text-neutral-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-neutral-200 pt-5 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-600">Subtotal</span>
          <span className="font-medium text-neutral-900">{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-neutral-600">Discount</span>
            <span className="font-medium text-accent">-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-neutral-600">Shipping</span>
          <span className="font-medium text-neutral-900">
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-bold text-neutral-900">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
