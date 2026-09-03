import { Link } from 'react-router-dom';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';

export default function RecentOrders({ orders = [] }) {
  const recent = orders.slice(0, 5);
  return (
    <Card
      title="Recent Orders"
      subtitle="Latest customer orders"
      action={
        <Link
          to="/admin/orders"
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          View all →
        </Link>
      }
      bodyClassName="overflow-x-auto"
    >
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-neutral-100 text-xs uppercase tracking-wider text-neutral-500">
            <th className="px-5 py-4 font-semibold">Order ID</th>
            <th className="px-5 py-4 font-semibold">Customer</th>
            <th className="px-5 py-4 font-semibold">Date</th>
            <th className="px-5 py-4 font-semibold">Payment</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((order) => (
            <tr key={order.id} className="border-b border-neutral-50 transition-colors last:border-0 hover:bg-neutral-50/60">
              <td className="px-5 py-4 text-base font-semibold text-neutral-900">{order.id}</td>
              <td className="px-5 py-4 text-base text-neutral-700">{order.customer}</td>
              <td className="px-5 py-4 text-base text-neutral-500">{formatDate(order.date)}</td>
              <td className="px-5 py-4">
                <StatusBadge status={order.payment || 'Paid'} />
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-5 py-4 text-right text-base font-semibold text-neutral-900">
                {formatPrice(order.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
