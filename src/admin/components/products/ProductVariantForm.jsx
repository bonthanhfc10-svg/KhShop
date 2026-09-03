import { Trash2 } from 'lucide-react';
import ImageUpload from '../common/ImageUpload';

export default function ProductVariantForm({ index, variant, onChange, onRemove }) {
  const inputCls =
    'w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-neutral-400';
  const labelCls = 'mb-1.5 block text-sm font-medium text-neutral-700';

  const update = (key, value) => onChange(index, { ...variant, [key]: value });

  return (
    <div className="rounded-lg border border-neutral-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-700">Variant {index + 1}</span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label="Delete variant"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className={labelCls}>Color Name</label>
          <input value={variant.name} onChange={(e) => update('name', e.target.value)} className={inputCls} placeholder="e.g. Black/White" />
        </div>
        <div>
          <label className={labelCls}>SKU</label>
          <input value={variant.sku} onChange={(e) => update('sku', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Price ($)</label>
          <input type="number" step="0.01" value={variant.price} onChange={(e) => update('price', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Stock</label>
          <input type="number" value={variant.stock} onChange={(e) => update('stock', e.target.value)} className={inputCls} />
        </div>
      </div>
      <div className="mt-3">
        <p className={labelCls}>Color Image</p>
        <ImageUpload single images={variant.image ? [variant.image] : []} onImagesChange={(imgs) => update('image', imgs[0] || null)} />
      </div>
    </div>
  );
}
