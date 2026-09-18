import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Package } from 'lucide-react';
import { orderService } from '../../../services/orderService';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';
import OrderStatusBadge from '../../../components/customer/account/OrderStatusBadge';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await orderService.getOrder(id);
        if (active) setOrder(res?.data);
      } catch (err) {
        if (active) setError(err?.response?.data?.message || 'Failed to load order.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchOrder();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <main className="container-kh py-20">
        <Loading full />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="container-kh py-20 text-center">
        <h1 className="heading-display text-3xl">Order not found</h1>
        <p className="mt-3 text-neutral-500">{error || 'The order could not be loaded.'}</p>
        <div className="mt-8">
          <Button to="/products/women">Continue Shopping</Button>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container-kh flex flex-col items-center px-6 py-20 text-center sm:py-28">
        <CheckCircle2 size={64} className="text-green-500" />
        <h1 className="heading-display mt-6 text-3xl sm:text-5xl">
          Thank You!
        </h1>
        <p className="mt-3 max-w-md text-sm text-neutral-500 sm:text-base">
          Your order has been placed successfully.
        </p>

        <div className="mt-10 border border-neutral-200 bg-neutral-50 px-10 py-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Order Number
          </p>
          <p className="mt-2 font-sans text-3xl font-extrabold text-neutral-900">
            #{order.id}
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="mt-4 space-y-1 text-sm text-neutral-600">
            {order.total_amount != null && (
              <p>Total: <span className="font-bold">{formatPrice(order.total_amount)}</span></p>
            )}
            {order.net_amount != null && order.net_amount !== order.total_amount && (
              <p>Net: {formatPrice(order.net_amount)}</p>
            )}
          </div>
          <p className="mt-3 text-xs text-neutral-400">
            {formatDate(order.created_at)}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button to={`/account/orders/${order.id}`}>View Order</Button>
          <Button to="/products/women" variant="secondary">
            Continue Shopping
          </Button>
        </div>
      </div>
    </main>
  );
}
