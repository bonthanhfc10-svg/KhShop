import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import AccountLayout from './AccountLayout';
import EmptyState from '../../components/common/EmptyState';
import { orders as mockOrders } from '../../data/orders';
import { orderTotal } from '../../utils/orderUtils';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { orderService } from '../../services/orderService';
import { USE_MOCK } from '../../services/config';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 400));
          if (active) setOrders(mockOrders);
        } else {
          const data = await orderService.getOrders();
          if (active) setOrders(data);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const statusColor = (status) => {
    if (status === 'Delivered') return 'bg-green-100 text-green-700';
    if (status === 'Shipped') return 'bg-blue-100 text-blue-700';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <AccountLayout>
      <div className="mt-4">
        {loading ? (
          <p className="py-10 text-center text-sm text-neutral-500">Loading orders…</p>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place an order, it will appear here."
            actionLabel="Start Shopping"
            actionTo="/shop"
          />
        ) : (
        <div className="overflow-x-auto border border-neutral-200 bg-white">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-bold uppercase tracking-widest text-neutral-500">
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-semibold text-neutral-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{formatDate(order.date)}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-neutral-900">
                    {formatPrice(orderTotal(order))}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/account/orders/${order.id}`}
                      className="text-xs font-bold uppercase tracking-widest text-neutral-900 underline-offset-4 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </AccountLayout>
  );
}
