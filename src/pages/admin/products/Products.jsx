import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AdminButton from '../../../components/admin/common/AdminButton';
import ProductActions from '../../../components/admin/products/ProductActions';
import ProductFilters from '../../../components/admin/products/ProductFilters';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import ConfirmModal from '../../../components/admin/common/ConfirmModal';
import Toast from '../../../components/admin/common/Toast';
import Pagination from '../../../components/common/Pagination';
import useToast from '../../../hooks/useToast';
import { useProducts } from '../../../hooks/useAdminProducts';
import { formatPrice } from '../../../utils/formatPrice';

export default function Products() {
  const location = useLocation();
  const {
    products,
    loading,
    pagination,
    filters,
    goToPage,
    changePerPage,
    applyFilters,
    removeProduct,
  } = useProducts();

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toasts, show, remove } = useToast();

  useEffect(() => {
    if (location.state?.toast) {
      show(location.state.toast);
      window.history.replaceState({}, '');
    }
  }, []);

  const handleSearch = useCallback((value) => {
    setLocalSearch(value);
  }, []);

  const handleSearchCommit = useCallback(() => {
    applyFilters({ ...filters, search: localSearch });
  }, [localSearch, filters, applyFilters]);

  const handleCategoryChange = useCallback((value) => {
    applyFilters({ ...filters, category_id: value });
  }, [filters, applyFilters]);

  const handleStatusChange = useCallback((value) => {
    applyFilters({ ...filters, is_active: value });
  }, [filters, applyFilters]);

  const handlePerPageChange = useCallback((e) => {
    changePerPage(Number(e.target.value));
  }, [changePerPage]);

  const handleDelete = async () => {
    setDeleting(true);
    await removeProduct(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    show('Deleted successfully');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your product catalog &middot; {pagination.total} products
          </p>
        </div>
        <AdminButton to="/admin/products/create" variant="success">
          <Plus size={16} /> Add Product
        </AdminButton>
      </div>

      {/* Filters */}
      <ProductFilters
        search={localSearch}
        onSearch={handleSearch}
        onSearchCommit={handleSearchCommit}
        category={filters.category_id || 'all'}
        onCategory={handleCategoryChange}
        status={filters.is_active || 'all'}
        onStatus={handleStatusChange}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card shadow-sm">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-admin-border bg-admin-table-header">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Product</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Price</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Stock</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border-subtle">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <p className="text-sm text-slate-400">Loading...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <p className="text-sm font-semibold text-slate-700">No products found</p>
                    <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="transition-colors hover:bg-admin-primary-light/20"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{p.category?.name || '—'}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-semibold ${(p.total_stock || 0) <= 5 ? 'text-red-600' : (p.total_stock || 0) <= 10 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {p.total_stock || 0}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.is_active ? 'Active' : 'Draft'} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end">
                        <ProductActions product={p} onDelete={setDeleteTarget} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-admin-border-subtle md:hidden">
          {loading ? (
            <div className="px-5 py-14 text-center">
              <p className="text-sm text-slate-400">Loading...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-sm font-semibold text-slate-700">No products found</p>
              <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filters.</p>
            </div>
          ) : (
            products.map((p) => (
              <div key={p.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{p.name}</p>
                    <p className="truncate text-xs text-slate-400">{p.category?.name}</p>
                  </div>
                  <ProductActions product={p} onDelete={setDeleteTarget} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900">{formatPrice(p.price)}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{p.total_stock || 0} stock</span>
                    <StatusBadge status={p.is_active ? 'Active' : 'Draft'} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
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
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>per page</span>
          </div>
          <Pagination page={pagination.currentPage} totalPages={pagination.lastPage} onChange={goToPage} />
        </div>
      )}

      {/* Delete modal */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />

      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}
