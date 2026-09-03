import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../../components/common/SearchInput';
import StatusBadge from '../../components/common/StatusBadge';
import AdminLoading from '../../components/common/Loading';
import { useOrders } from '../../hooks/useOrders';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';

const statuses = ['All', 'Completed', 'Processing', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const { orders, loading } = useOrders();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const navigate = useNavigate();

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const matchSearch =
          !search ||
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          o.customer.toLowerCase().includes(search.toLowerCase());
        const matchStatus = status === 'All' || o.status === status;
        return matchSearch && matchStatus;
      }),
    [orders, search, status]
  );

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Orders</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage and track all customer orders · {filtered.length} orders</p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by order or customer..." />
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                status === s ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60 text-xs uppercase tracking-wider text-neutral-500">
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Items</th>
                <th className="px-5 py-3 font-semibold">Payment</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => navigate(`/admin/orders/${o.id}`)}
                  className="cursor-pointer border-b border-neutral-50 transition-colors last:border-0 hover:bg-neutral-50/60"
                >
                  <td className="px-5 py-3 font-semibold text-neutral-900">{o.id}</td>
                  <td className="px-5 py-3 text-neutral-700">{o.customer}</td>
                  <td className="px-5 py-3 text-neutral-500">{formatDate(o.date)}</td>
                  <td className="px-5 py-3 text-neutral-700">{o.items} items</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={o.payment} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-neutral-900">{formatPrice(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-neutral-100 md:hidden">
          {filtered.map((o) => (
            <div key={o.id} className="cursor-pointer p-4" onClick={() => navigate(`/admin/orders/${o.id}`)}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">{o.id}</span>
                <StatusBadge status={o.status} />
              </div>
              <p className="mt-1 text-sm text-neutral-600">{o.customer}</p>
              <p className="text-xs text-neutral-400">{formatDate(o.date)} · {o.items} items</p>
              <p className="mt-2 font-semibold text-neutral-900">{formatPrice(o.total)}</p>
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="font-medium text-neutral-700">No orders found</p>
            <p className="text-sm text-neutral-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
