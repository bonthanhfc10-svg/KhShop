import { formatPrice } from '../../utils/formatPrice';

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;

export default function CartSummary({ subtotal, discount = 0 }) {
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal - discount + shipping;

  return (
    <div className="border border-neutral-200 bg-white p-6 sm:p-8">
      <h2 className="mb-6 font-display text-sm font-bold uppercase tracking-widest text-neutral-900">
        Order Summary
      </h2>

      <dl className="space-y-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-neutral-600">Subtotal</dt>
          <dd className="font-medium text-neutral-900">{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-neutral-600">Discount</dt>
            <dd className="font-medium text-accent">-{formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-neutral-600">Shipping</dt>
          <dd className="font-medium text-neutral-900">
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </dd>
        </div>
        <div className="my-2 border-t border-neutral-200" />
        <div className="flex justify-between text-base font-bold text-neutral-900">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>

      {shipping > 0 && (
        <p className="mt-4 text-xs text-neutral-500">
          Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
        </p>
      )}
    </div>
  );
}
