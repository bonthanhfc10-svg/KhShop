import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, ChevronRight, AlertCircle } from 'lucide-react';
import AccountLayout from './AccountLayout';
import EmptyState from '../../../components/common/EmptyState';
import Pagination from '../../../components/common/Pagination';
import OrderStatusBadge from '../../../components/customer/account/OrderStatusBadge';
import OrdersSkeleton from '../../../components/customer/account/OrdersSkeleton';
import { orderTotal } from '../../../utils/orderUtils';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';

const ORDERS_PER_PAGE = 5;

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'Pending', label: 'Pending' },
  { key: 'Processing', label: 'Processing' },
  { key: 'Shipped', label: 'Shipped' },
  { key: 'Delivered', label: 'Delivered' },
  { key: 'Cancelled', label: 'Cancelled' },
];

const ITEMS_LABEL = (count) =>
  `${count} ${count === 1 ? 'item' : 'items'}`;

function getStatusCounts(orders) {
  const counts = { all: orders.length };
  orders.forEach((o) => {
    counts[o.status] = (counts[o.status] || 0) + 1;
  });
  return counts;
}

/*
 * ──────────────────────────────────────────────
 * MOCK DATA — replace with real API fetch later.
 *
 * To integrate with the Laravel backend:
 *   1. Remove the MOCK_ORDERS import from data/orders
 *   2. Replace with: const data = await orderService.getOrders();
 *   3. The order shape below matches the mock data structure.
 *
 * Expected future API response shape:
 *   GET /api/v1/orders → { data: [ { id, date, status, items[], shipping, address, payment, timeline } ] }
 * ──────────────────────────────────────────────
 */
import { orders as MOCK_ORDERS } from '../../../data/orders';

export default function Orders() {
  const [orders] = useState(MOCK_ORDERS);
  const [loading] = useState(false);
  const [error] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const statusCounts = useMemo(() => getStatusCounts(orders), [orders]);

  const filtered = useMemo(() => {
    let list = orders;

    if (statusFilter !== 'all') {
      list = list.filter((o) => o.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((o) => o.id.toLowerCase().includes(q));
    }

    return list;
  }, [orders, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ORDERS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ORDERS_PER_PAGE,
    safePage * ORDERS_PER_PAGE
  );

  const handleFilterChange = (key) => {
    setStatusFilter(key);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <AccountLayout>
      <div className="mt-2">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-sans text-2xl font-bold text-neutral-900">
            My Orders
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Track and manage your orders
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by order number..."
              aria-label="Search orders"
              className="input-kh pl-10"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {STATUS_FILTERS.map((f) => {
              const count = statusCounts[f.key] || 0;
              const isActive = statusFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => handleFilterChange(f.key)}
                  className={`flex shrink-0 items-center gap-1.5 border px-3.5 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-black'
                  }`}
                >
                  {f.label}
                  <span
                    className={`ml-0.5 text-[10px] font-bold ${
                      isActive ? 'text-white/70' : 'text-neutral-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 px-5 py-4">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-700">
                Failed to load orders
              </p>
              <p className="mt-0.5 text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <OrdersSkeleton rows={4} />}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={Package}
            title={
              search || statusFilter !== 'all'
                ? 'No orders found'
                : 'No orders yet'
            }
            description={
              search || statusFilter !== 'all'
                ? 'Try adjusting your search or filter to find what you\u2019re looking for.'
                : 'When you place an order, it will appear here.'
            }
            actionLabel={
              search || statusFilter !== 'all' ? undefined : 'Start Shopping'
            }
            actionTo={search || statusFilter !== 'all' ? undefined : '/shop'}
          />
        )}

        {/* Orders list */}
        {!loading && !error && filtered.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto border border-neutral-200 bg-white md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {paginated.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-neutral-50"
                    >
                      <td className="px-6 py-4 font-semibold text-neutral-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {ITEMS_LABEL(order.items.length)}
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-neutral-900">
                        {formatPrice(orderTotal(order))}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/account/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:text-neutral-500"
                        >
                          View
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-neutral-100 border border-neutral-200 bg-white md:hidden">
              {paginated.map((order) => (
                <Link
                  key={order.id}
                  to={`/account/orders/${order.id}`}
                  className="block p-4 transition-colors hover:bg-neutral-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">
                          {order.id}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        {formatDate(order.date)}
                      </p>
                    </div>
                    <span className="shrink-0 text-right font-bold text-neutral-900">
                      {formatPrice(orderTotal(order))}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                    <span className="text-xs text-neutral-500">
                      {ITEMS_LABEL(order.items.length)}
                      {order.items.length > 0 && (
                        <span className="ml-2 text-neutral-400">
                          {order.items
                            .slice(0, 2)
                            .map((i) => i.name)
                            .join(', ')}
                          {order.items.length > 2 && (
                            <span>
                              {' '}
                              +{order.items.length - 2} more
                            </span>
                          )}
                        </span>
                      )}
                    </span>
                    <ChevronRight
                      size={16}
                      className="shrink-0 text-neutral-400"
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                page={safePage}
                totalPages={totalPages}
                onChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </AccountLayout>
  );
}
