import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AdminButton from '../../../components/admin/common/AdminButton';
import ProductActions from '../../../components/admin/products/ProductActions';
import ProductFilters from '../../../components/admin/products/ProductFilters';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import ConfirmModal from '../../../components/admin/common/ConfirmModal';
import Toast from '../../../components/admin/common/Toast';
import useToast from '../../../hooks/useToast';
import { useProducts } from '../../../hooks/useAdminProducts';
import { formatPrice } from '../../../utils/formatPrice';

export default function Products() {
  const location = useLocation();
  const { products, loading, removeProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toasts, show, remove } = useToast();

  useEffect(() => {
    if (location.state?.toast) {
      show(location.state.toast);
      window.history.replaceState({}, '');
    }
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'all' || p.category === category;
      const matchStatus = status === 'all' || p.status === status;
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, search, category, status]);

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
            Manage your product catalog &middot; {filtered.length} products
          </p>
        </div>
        <AdminButton to="/admin/products/create" variant="success">
          <Plus size={16} /> Add Product
        </AdminButton>
      </div>

      {/* Filters */}
      <ProductFilters
        search={search}
        onSearch={setSearch}
        category={category}
        onCategory={setCategory}
        status={status}
        onStatus={setStatus}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card shadow-sm">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-admin-border bg-admin-table-header">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Product</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">SKU</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Price</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Stock</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border-subtle">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-admin-primary-light/20"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="h-10 w-10 shrink-0 rounded-lg border border-admin-border-subtle bg-admin-surface-subtle object-cover" />
                      <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 font-mono">{p.sku}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{p.categoryName || p.category}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{formatPrice(p.price)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-semibold ${p.stock <= 5 ? 'text-red-600' : p.stock <= 10 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={p.status === 'active' ? 'Active' : 'Draft'} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end">
                      <ProductActions product={p} onDelete={setDeleteTarget} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-admin-border-subtle md:hidden">
          {filtered.map((p) => (
            <div key={p.id} className="p-4">
              <div className="flex items-center gap-3">
                <img src={p.image} alt={p.name} className="h-12 w-12 shrink-0 rounded-lg border border-admin-border-subtle bg-admin-surface-subtle object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{p.name}</p>
                  <p className="truncate text-xs text-slate-400">{p.sku} &middot; {p.categoryName}</p>
                </div>
                <ProductActions product={p} onDelete={setDeleteTarget} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900">{formatPrice(p.price)}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">{p.stock} stock</span>
                  <StatusBadge status={p.status === 'active' ? 'Active' : 'Draft'} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="px-6 py-14 text-center">
            <p className="text-sm font-semibold text-slate-700">No products found</p>
            <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

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
