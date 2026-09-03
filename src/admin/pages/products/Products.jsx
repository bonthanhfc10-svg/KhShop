import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import AdminButton from '../../components/common/AdminButton';
import ProductActions from '../../components/products/ProductActions';
import ProductFilters from '../../components/products/ProductFilters';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useProducts } from '../../hooks/useProducts';
import { formatPrice } from '../../../utils/formatPrice';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const { products, loading, removeProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

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
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Products</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage your product catalog · {filtered.length} products
          </p>
        </div>
        <AdminButton to="/admin/products/create">
          <Plus size={16} /> Add Product
        </AdminButton>
      </div>

      <ProductFilters
        search={search}
        onSearch={setSearch}
        category={category}
        onCategory={setCategory}
        status={status}
        onStatus={setStatus}
      />

      <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60 text-xs uppercase tracking-wider text-neutral-500">
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">SKU</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                  className="cursor-pointer border-b border-neutral-50 transition-colors last:border-0 hover:bg-neutral-50/60"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="h-11 w-11 shrink-0 rounded-lg border border-neutral-100 bg-neutral-100 object-cover" />
                      <span className="font-medium text-neutral-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">{p.sku}</td>
                  <td className="px-5 py-3 text-neutral-700">{p.categoryName || p.category}</td>
                  <td className="px-5 py-3 font-semibold text-neutral-900">{formatPrice(p.price)}</td>
                  <td className="px-5 py-3">{p.stock}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={p.status === 'active' ? 'Active' : 'Draft'} />
                  </td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
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
        <div className="divide-y divide-neutral-100 md:hidden">
          {filtered.map((p) => (
            <div key={p.id} className="p-4">
              <div className="flex items-center gap-3">
                <img src={p.image} alt={p.name} className="h-12 w-12 shrink-0 rounded-lg border border-neutral-100 bg-neutral-100 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-neutral-900">{p.name}</p>
                  <p className="truncate text-xs text-neutral-400">{p.sku} · {p.categoryName}</p>
                </div>
                <ProductActions product={p} onDelete={setDeleteTarget} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-neutral-900">{formatPrice(p.price)}</span>
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500">{p.stock} stock</span>
                  <StatusBadge status={p.status === 'active' ? 'Active' : 'Draft'} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="font-medium text-neutral-700">No products found</p>
            <p className="text-sm text-neutral-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}
