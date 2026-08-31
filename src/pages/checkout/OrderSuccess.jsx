import { CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';

export default function OrderSuccess() {
  let order = null;
  try {
    order = JSON.parse(sessionStorage.getItem('khshop_last_order') || 'null');
  } catch {
    order = null;
  }

  const orderNumber = order?.number || 'KH-000000';

  return (
    <main>
      <div className="container-kh flex flex-col items-center px-6 py-20 text-center sm:py-28">
        <CheckCircle2 size={64} className="text-accent" />
        <h1 className="heading-display mt-6 text-3xl sm:text-5xl">
          Thank You!
        </h1>
        <p className="mt-3 max-w-md text-sm text-neutral-500 sm:text-base">
          Your order has been placed successfully. A confirmation email is on its way.
        </p>

        <div className="mt-10 border border-neutral-200 bg-neutral-50 px-10 py-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Order Number
          </p>
          <p className="mt-2 font-display text-3xl font-extrabold text-neutral-900">
            {orderNumber}
          </p>
          {order?.total && (
            <p className="mt-2 text-sm text-neutral-600">
              Total: ${order.total.toFixed(2)}
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button to="/shop">Continue Shopping</Button>
          <Button to="/account/orders" variant="secondary">
            View My Orders
          </Button>
        </div>
      </div>
    </main>
  );
}
