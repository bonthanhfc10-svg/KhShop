import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import SearchInput from '../../../components/admin/common/SearchInput';
import AdminButton from '../../../components/admin/common/AdminButton';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import AdminLoading from '../../../components/common/Loading';
import Pagination from '../../../components/common/Pagination';
import { useOrders } from '../../../hooks/useOrders';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';

const ORDER_STATUSES = ['all', 'pending', 'processing', 'shipped', 'completed', 'cancelled'];
const PAYMENT_STATUSES = ['all', 'unpaid', 'paid', 'failed', 'refunded'];
const ORDER_TYPES = ['all', 'delivery', 'pickup'];

export default function Orders() {
  const {
    orders,
    loading,
    error,
    pagination,
    filters,
    goToPage,
    changePerPage,
    applyFilters,
  } = useOrders();

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [paymentFilter, setPaymentFilter] = useState(filters.payment_status || 'all');
  const [typeFilter, setTypeFilter] = useState(filters.order_type || 'all');

  const handleSearchCommit = useCallback(() => {
    applyFilters({
      ...filters,
      search: localSearch,
      status: statusFilter,
      payment_status: paymentFilter,
      order_type: typeFilter,
    });
  }, [localSearch, statusFilter, paymentFilter, typeFilter, filters, applyFilters]);

  const handleStatusChange = useCallback((key) => {
    setStatusFilter(key);
    applyFilters({ ...filters, status: key, search: localSearch, payment_status: paymentFilter, order_type: typeFilter });
  }, [filters, localSearch, paymentFilter, typeFilter, applyFilters]);

  const handlePaymentChange = useCallback((key) => {
    setPaymentFilter(key);
    applyFilters({ ...filters, payment_status: key, search: localSearch, status: statusFilter, order_type: typeFilter });
  }, [filters, localSearch, statusFilter, typeFilter, applyFilters]);

  const handleTypeChange = useCallback((key) => {
    setTypeFilter(key);
    applyFilters({ ...filters, order_type: key, search: localSearch, status: statusFilter, payment_status: paymentFilter });
  }, [filters, localSearch, statusFilter, paymentFilter, applyFilters]);

  const handlePerPageChange = useCallback((e) => {
    changePerPage(Number(e.target.value));
  }, [changePerPage]);

  if (loading) return <AdminLoading />;

  if (error) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Manage and track all customer orders</p>
        </div>
        <div className="flex flex-col items-center py-16">
          <p className="text-sm text-red-600">{error}</p>
          <AdminButton variant="secondary" className="mt-4" onClick={() => applyFilters(filters)}>
            Retry
          </AdminButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage and track all customer orders &middot; {pagination.total} orders
        </p>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3 rounded-lg border border-admin-border bg-admin-card p-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2">
            <SearchInput
              value={localSearch}
              onChange={setLocalSearch}
              onCommit={handleSearchCommit}
              placeholder="Search by order ID, customer name, email, or phone..."
            />
            <AdminButton variant="primary" size="sm" onClick={handleSearchCommit}>
              <Search size={14} /> Search
            </AdminButton>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500">Status:</span>
            <div className="flex gap-1">
              {ORDER_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors ${
                    statusFilter === s ? 'bg-[#25A9EB] text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500">Payment:</span>
            <div className="flex gap-1">
              {PAYMENT_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handlePaymentChange(s)}
                  className={`rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors ${
                    paymentFilter === s ? 'bg-[#25A9EB] text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500">Type:</span>
            <div className="flex gap-1">
              {ORDER_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors ${
                    typeFilter === t ? 'bg-[#25A9EB] text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
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
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Type</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Total</th>
                <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border-subtle">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-14 text-center">
                    <p className="text-sm font-semibold text-slate-700">No orders found</p>
                    <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">#{o.id}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{o.user?.name || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{formatDate(o.created_at)}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{o.items?.length || 0} items</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={o.payment_status || 'unpaid'} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 capitalize">{o.order_type}</td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-900">{formatPrice(o.net_amount)}</td>
                    <td className="px-5 py-3.5 text-center">
                      <AdminButton variant="ghost" size="sm" to={`/admin/orders/${o.id}`}>View</AdminButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-admin-border-subtle md:hidden">
          {orders.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <p className="text-sm font-semibold text-slate-700">No orders found</p>
              <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filters.</p>
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">#{o.id}</span>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-1 text-sm text-slate-600">{o.user?.name || '—'}</p>
                <p className="text-xs text-slate-400">{formatDate(o.created_at)} &middot; {o.items?.length || 0} items &middot; {o.order_type}</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <StatusBadge status={o.payment_status || 'unpaid'} />
                  <span className="font-semibold text-slate-900">{formatPrice(o.net_amount)}</span>
                </div>
                <div className="mt-3 flex justify-end">
                  <AdminButton variant="ghost" size="sm" to={`/admin/orders/${o.id}`}>View</AdminButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Per Page + Pagination below table */}
      <div className="flex flex-col gap-3 rounded-xl border border-admin-border bg-admin-card px-5 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Per Page:</span>
          <select
            value={pagination.perPage}
            onChange={handlePerPageChange}
            className="rounded border border-gray-300 bg-admin-card-elevated px-2 py-1 text-sm text-slate-700 outline-none focus:border-[#25A9EB]"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        {pagination.lastPage > 1 && (
          <Pagination page={pagination.currentPage} totalPages={pagination.lastPage} onChange={goToPage} />
        )}
      </div>
    </div>
  );
}
