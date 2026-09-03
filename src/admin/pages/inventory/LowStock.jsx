import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchInput from '../../components/common/SearchInput';
import StatusBadge from '../../components/common/StatusBadge';
import AdminButton from '../../components/common/AdminButton';
import AdminLoading from '../../components/common/Loading';
import { inventoryService } from '../../services/inventoryService';

export default function LowStock() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () =>
    inventoryService.getAll().then(setItems).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter((i) => {
    const matchSearch =
      !search ||
      i.product.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (i.status === 'Low Stock' || i.status === 'Out of Stock');
  });

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Low Stock Alert</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Products running low or out of stock
          </p>
        </div>
        <AdminButton to="/admin/products/create" variant="primary">
          + Add Product
        </AdminButton>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search low stock items..." />
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 text-xs text-neutral-500">
            <span className="flex h-2 w-2 rounded-full bg-amber-500" /> Low Stock
            <span className="flex h-2 w-2 rounded-full bg-red-600" /> Out of Stock
          </span>
        </div>
      </div>

      <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60 text-xs uppercase tracking-wider text-neutral-500">
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">SKU</th>
                <th className="px-5 py-3 font-semibold">Color</th>
                <th className="px-5 py-3 font-semibold">Size</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={`${i.id}-${i.sku}-${i.size}`} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60">
                  <td className="px-5 py-3 font-medium text-neutral-900">{i.product}</td>
                  <td className="px-5 py-3 text-neutral-500">{i.sku}</td>
                  <td className="px-5 py-3 text-neutral-700">{i.color}</td>
                  <td className="px-5 py-3 text-neutral-700">{i.size}</td>
                  <td className="px-5 py-3">
                    <span className={`font-semibold ${i.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      {i.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={i.status} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <AdminButton variant="secondary" size="sm" to="/admin/inventory">
                        Manage
                      </AdminButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-neutral-100 md:hidden">
          {filtered.map((i) => (
            <div key={`${i.id}-${i.sku}-${i.size}`} className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-neutral-900">{i.product}</p>
                <StatusBadge status={i.status} />
              </div>
              <p className="text-xs text-neutral-400">{i.sku} · {i.color} · {i.size}</p>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-neutral-700">{i.stock} in stock</span>
                <Link to="/admin/inventory" className="text-sm font-semibold text-neutral-700 hover:text-neutral-900">
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="font-medium text-neutral-700">No low stock items</p>
            <p className="text-sm text-neutral-400">All products are sufficiently stocked.</p>
          </div>
        )}
      </div>
    </div>
  );
}
