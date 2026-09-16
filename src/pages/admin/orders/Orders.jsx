import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../../../components/admin/common/SearchInput';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import AdminLoading from '../../../components/common/Loading';
import { useOrders } from '../../../hooks/useOrders';
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
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">Manage and track all customer orders &middot; {filtered.length} orders</p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-admin-border bg-admin-card p-3 shadow-sm sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by order or customer..." />
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                status === s ? 'bg-[#25A9EB] text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-admin-border bg-admin-table-header">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Order</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Customer</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Items</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Payment</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border-subtle">
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => navigate(`/admin/orders/${o.id}`)}
                  className="cursor-pointer transition-colors hover:bg-admin-primary-light/20"
                >
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{o.id}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{o.customer}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{formatDate(o.date)}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{o.items} items</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={o.payment} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-900">{formatPrice(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-admin-border-subtle md:hidden">
          {filtered.map((o) => (
            <div key={o.id} className="cursor-pointer p-4" onClick={() => navigate(`/admin/orders/${o.id}`)}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{o.id}</span>
                <StatusBadge status={o.status} />
              </div>
              <p className="mt-1 text-sm text-slate-600">{o.customer}</p>
              <p className="text-xs text-slate-400">{formatDate(o.date)} &middot; {o.items} items</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{formatPrice(o.total)}</p>
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-semibold text-slate-700">No orders found</p>
            <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
