import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import SearchInput from '../../../components/admin/common/SearchInput';
import AdminButton from '../../../components/admin/common/AdminButton';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import AdminLoading from '../../../components/common/Loading';
import Pagination from '../../../components/common/Pagination';
import { useCustomers } from '../../../hooks/useCustomers';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';

const STATUS_FILTERS = ['all', 'active', 'inactive'];

export default function Customers() {
  const {
    customers,
    loading,
    error,
    pagination,
    filters,
    goToPage,
    changePerPage,
    applyFilters,
  } = useCustomers();

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [statusFilter, setStatusFilter] = useState(filters.is_active || 'all');

  const handleSearchCommit = useCallback(() => {
    applyFilters({
      ...filters,
      search: localSearch,
      is_active: statusFilter,
    });
  }, [localSearch, statusFilter, filters, applyFilters]);

  const handleStatusChange = useCallback((key) => {
    setStatusFilter(key);
    applyFilters({ ...filters, is_active: key, search: localSearch });
  }, [filters, localSearch, applyFilters]);

  const handlePerPageChange = useCallback((e) => {
    changePerPage(Number(e.target.value));
  }, [changePerPage]);

  if (loading) return <AdminLoading />;

  if (error) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your customer base</p>
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

  const initials = (n) =>
    n.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customers</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your customer base &middot; {pagination.total} customers
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 rounded-lg border border-admin-border bg-admin-card p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2">
          <SearchInput
            value={localSearch}
            onChange={setLocalSearch}
            onCommit={handleSearchCommit}
            placeholder="Search by name, email, or phone..."
          />
          <AdminButton variant="primary" size="sm" onClick={handleSearchCommit}>
            <Search size={14} /> Search
          </AdminButton>
        </div>
        <div className="flex gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                statusFilter === s ? 'bg-[#25A9EB] text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-admin-border bg-admin-table-header">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Customer</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Phone</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Orders</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Total Spent</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Joined</th>
                <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border-subtle">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <p className="text-sm font-semibold text-slate-700">No customers found</p>
                    <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                          {initials(c.name)}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                          <p className="text-xs text-slate-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{c.phone || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{c.orders_count}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{formatPrice(c.total_spent)}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={c.is_active ? 'Active' : 'Inactive'} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{formatDate(c.created_at)}</td>
                    <td className="px-5 py-3.5 text-center">
                      <AdminButton variant="ghost" size="sm" to={`/admin/customers/${c.id}`}>View</AdminButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-admin-border-subtle md:hidden">
          {customers.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <p className="text-sm font-semibold text-slate-700">No customers found</p>
              <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filters.</p>
            </div>
          ) : (
            customers.map((c) => (
              <div key={c.id} className="p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                    {initials(c.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{c.name}</p>
                    <p className="truncate text-xs text-slate-400">{c.email}</p>
                  </div>
                  <StatusBadge status={c.is_active ? 'Active' : 'Inactive'} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900">{formatPrice(c.total_spent)}</span>
                  <span className="text-slate-500">{c.orders_count} orders</span>
                </div>
                <div className="mt-3 flex justify-end">
                  <AdminButton variant="ghost" size="sm" to={`/admin/customers/${c.id}`}>View</AdminButton>
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
