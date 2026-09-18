import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import SearchInput from '../../../components/admin/common/SearchInput';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import AdminButton from '../../../components/admin/common/AdminButton';
import AdminLoading from '../../../components/common/Loading';
import Toast from '../../../components/admin/common/Toast';
import Pagination from '../../../components/common/Pagination';
import useToast from '../../../hooks/useToast';
import { useInventory } from '../../../hooks/useInventory';

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'in_stock', label: 'In Stock' },
  { key: 'low_stock', label: 'Low Stock' },
  { key: 'out_of_stock', label: 'Out of Stock' },
];

export default function Inventory() {
  const {
    items,
    loading,
    error,
    pagination,
    filters,
    goToPage,
    changePerPage,
    applyFilters,
    updateStock,
  } = useInventory();

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');
  const [adjusting, setAdjusting] = useState(false);
  const { toasts, show, remove } = useToast();

  const handleSearchCommit = useCallback(() => {
    applyFilters({ ...filters, search: localSearch, status: statusFilter === 'all' ? '' : statusFilter });
  }, [localSearch, statusFilter, filters, applyFilters]);

  const handleStatusChange = useCallback((key) => {
    setStatusFilter(key);
    applyFilters({ ...filters, status: key === 'all' ? '' : key, search: localSearch });
  }, [filters, localSearch, applyFilters]);

  const handlePerPageChange = useCallback((e) => {
    changePerPage(Number(e.target.value));
  }, [changePerPage]);

  const handleAdjust = async () => {
    if (!adjustTarget) return;
    setAdjusting(true);
    try {
      const newStock = Math.max(0, adjustTarget.stock + adjustQty);
      await updateStock(adjustTarget.id, newStock);
      setAdjustQty(0);
      setAdjustReason('');
      setAdjustTarget(null);
      show('Stock updated successfully');
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to update stock.';
      show(message);
    } finally {
      setAdjusting(false);
    }
  };

  if (loading) return <AdminLoading />;

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-sans text-2xl font-bold text-neutral-900">Inventory</h1>
          <p className="mt-1 text-sm text-neutral-500">Track stock levels across all products.</p>
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
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold text-neutral-900">Inventory</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Track stock levels across all products &middot; {pagination.total} variants
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-admin-border bg-admin-card p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2">
          <SearchInput
            value={localSearch}
            onChange={setLocalSearch}
            onCommit={handleSearchCommit}
            placeholder="Search by product name or SKU..."
          />
          <AdminButton variant="primary" size="sm" onClick={handleSearchCommit}>
            <Search size={14} /> Search
          </AdminButton>
        </div>
        <div className="flex gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.key}
              onClick={() => handleStatusChange(s.key)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s.key ? 'bg-[#25A9EB] text-white' : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-admin-border bg-admin-table-header">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Product</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">SKU</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Color</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Size</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Stock</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border-subtle">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center">
                    <p className="font-medium text-neutral-700">No inventory items found</p>
                    <p className="text-sm text-neutral-400">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                items.map((i) => (
                  <tr key={i.id} className="transition-colors hover:bg-admin-primary-light/20">
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{i.product}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 font-mono">{i.sku}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{i.category}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{i.color}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{i.size}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{i.stock}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={i.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end">
                        <AdminButton variant="secondary" size="sm" onClick={() => setAdjustTarget(i)}>
                          Adjust
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-admin-border-subtle md:hidden">
          {items.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <p className="font-medium text-neutral-700">No inventory items found</p>
              <p className="text-sm text-neutral-400">Try adjusting your search or filters.</p>
            </div>
          ) : (
            items.map((i) => (
              <div key={i.id} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{i.product}</p>
                  <StatusBadge status={i.status} />
                </div>
                <p className="text-xs text-slate-400">{i.sku} &middot; {i.category} &middot; {i.color} &middot; {i.size}</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{i.stock} in stock</span>
                  <AdminButton variant="secondary" size="sm" onClick={() => setAdjustTarget(i)}>
                    Adjust
                  </AdminButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {pagination.lastPage > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-admin-border bg-admin-card px-5 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Show</span>
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
            <span>per page</span>
          </div>
          <Pagination page={pagination.currentPage} totalPages={pagination.lastPage} onChange={goToPage} />
        </div>
      )}

      <Modal open={!!adjustTarget} onClose={() => setAdjustTarget(null)} title={`Adjust Stock: ${adjustTarget?.product || ''}`}>
        <div className="space-y-4">
          <div className="rounded-lg bg-admin-border/30 px-4 py-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-slate-500">SKU:</span> <span className="font-mono font-medium text-slate-700">{adjustTarget?.sku}</span></div>
              <div><span className="text-slate-500">Current Stock:</span> <span className="font-semibold text-slate-900">{adjustTarget?.stock}</span></div>
              <div><span className="text-slate-500">Color:</span> <span className="text-slate-700">{adjustTarget?.color}</span></div>
              <div><span className="text-slate-500">Size:</span> <span className="text-slate-700">{adjustTarget?.size}</span></div>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">New Stock Value</label>
            <input
              type="number"
              min="0"
              value={adjustQty}
              onChange={(e) => setAdjustQty(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15"
              placeholder="Enter new stock quantity"
            />
            <p className="mt-1 text-xs text-slate-400">
              Will set stock to {Math.max(0, (adjustTarget?.stock || 0) + adjustQty)}
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Reason</label>
            <select
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15"
            >
              <option value="">Select reason</option>
              <option value="restock">Restock</option>
              <option value="damage">Damage / Loss</option>
              <option value="return">Customer Return</option>
              <option value="manual">Manual Adjustment</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <AdminButton variant="cancel" onClick={() => setAdjustTarget(null)}>Cancel</AdminButton>
            <AdminButton onClick={handleAdjust} disabled={adjusting}>
              {adjusting ? 'Updating...' : 'Apply Adjustment'}
            </AdminButton>
          </div>
        </div>
      </Modal>

      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}
