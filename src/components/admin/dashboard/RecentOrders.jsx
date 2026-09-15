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
          className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-admin-primary transition-colors hover:bg-admin-primary-light"
        >
          View all
        </Link>
      }
      bodyClassName="overflow-x-auto"
    >
      <table className="w-full text-left">
        <thead>
          <tr className="border-b-2 border-admin-border bg-admin-table-header">
            <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Order ID</th>
            <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Customer</th>
            <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
            <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Payment</th>
            <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
            <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-admin-border-subtle">
          {recent.map((order) => (
            <tr key={order.id} className="transition-colors hover:bg-admin-primary-light/20">
              <td className="px-5 py-3.5 text-sm font-semibold text-admin-primary">{order.id}</td>
              <td className="px-5 py-3.5 text-sm text-slate-700">{order.customer}</td>
              <td className="px-5 py-3.5 text-sm text-slate-500">{formatDate(order.date)}</td>
              <td className="px-5 py-3.5">
                <StatusBadge status={order.payment || 'Paid'} />
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-900">
                {formatPrice(order.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
