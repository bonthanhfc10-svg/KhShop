import { useState, useEffect } from 'react';
import SearchInput from '../../components/common/SearchInput';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import AdminButton from '../../components/common/AdminButton';
import AdminLoading from '../../components/common/Loading';
import { inventoryService } from '../../services/inventoryService';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');

  const load = () => inventoryService.getAll().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const filtered = items.filter((i) => {
    const matchSearch = !search || i.product.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      status === 'all' ||
      (status === 'low' && i.status === 'Low Stock') ||
      (status === 'out' && i.status === 'Out of Stock') ||
      (status === 'in' && i.status === 'In Stock');
    return matchSearch && matchStatus;
  });

  const handleAdjust = async () => {
    await inventoryService.adjust(adjustTarget.id, adjustQty, adjustReason);
    setAdjustQty(0);
    setAdjustReason('');
    setAdjustTarget(null);
    load();
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Inventory</h1>
        <p className="mt-1 text-sm text-neutral-500">Track stock levels across all products.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search products..." />
        <div className="flex gap-1.5">
          {[
            { key: 'all', label: 'All' },
            { key: 'in', label: 'In Stock' },
            { key: 'low', label: 'Low Stock' },
            { key: 'out', label: 'Out of Stock' },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setStatus(s.key)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                status === s.key ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60 text-xs uppercase tracking-wider text-neutral-500">
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">SKU</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Color</th>
                <th className="px-5 py-3 font-semibold">Size</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold">Available</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-b border-neutral-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-neutral-900">{i.product}</td>
                  <td className="px-5 py-3 text-neutral-500">{i.sku}</td>
                  <td className="px-5 py-3 text-neutral-700">{i.category}</td>
                  <td className="px-5 py-3 text-neutral-700">{i.color}</td>
                  <td className="px-5 py-3 text-neutral-700">{i.size}</td>
                  <td className="px-5 py-3 font-semibold text-neutral-900">{i.stock}</td>
                  <td className="px-5 py-3 text-neutral-700">{i.available}</td>
                  <td className="px-5 py-3"><StatusBadge status={i.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <AdminButton variant="secondary" size="sm" onClick={() => setAdjustTarget(i)}>
                        Adjust
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
            <div key={i.id} className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-neutral-900">{i.product}</p>
                <StatusBadge status={i.status} />
              </div>
              <p className="text-xs text-neutral-400">{i.sku} · {i.category} · {i.color} · {i.size}</p>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-neutral-700">{i.stock} in stock</span>
                <AdminButton variant="secondary" size="sm" onClick={() => setAdjustTarget(i)}>
                  Adjust
                </AdminButton>
              </div>
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="font-medium text-neutral-700">No inventory items found</p>
            <p className="text-sm text-neutral-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Adjustment modal */}
      <Modal open={!!adjustTarget} onClose={() => setAdjustTarget(null)} title={`Adjust Stock: ${adjustTarget?.product || ''}`}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Quantity Change</label>
            <input
              type="number"
              value={adjustQty}
              onChange={(e) => setAdjustQty(Number(e.target.value))}
              className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
              placeholder="Use negative to reduce stock"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Reason</label>
            <select
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
            >
              <option value="">Select reason</option>
              <option value="restock">Restock</option>
              <option value="damage">Damage / Loss</option>
              <option value="return">Customer Return</option>
              <option value="manual">Manual Adjustment</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <AdminButton variant="secondary" onClick={() => setAdjustTarget(null)}>Cancel</AdminButton>
            <AdminButton onClick={handleAdjust}>Apply Adjustment</AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
