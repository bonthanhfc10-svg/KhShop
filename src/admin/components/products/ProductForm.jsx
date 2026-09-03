import { useState } from 'react';
import ImageUpload from '../common/ImageUpload';
import { Plus, Trash2 } from 'lucide-react';

export const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

export default function ProductForm({ initial = {}, onSubmit, submitLabel = 'Save Product', submitting = false }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    sku: initial.sku || '',
    slug: initial.slug || '',
    description: initial.description || '',
    category: initial.category || 'men',
    price: initial.price || '',
    salePrice: initial.salePrice || '',
    stock: initial.stock ?? '',
    lowStockAlert: initial.lowStockAlert ?? 10,
    status: initial.status || 'active',
    featured: initial.featured || false,
    newArrival: initial.newArrival || false,
    bestSeller: initial.bestSeller || false,
    image: initial.image || null,
    gallery: initial.gallery || [],
    colors: initial.colors || [],
    sizes: initial.sizes || [],
  });

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const addColor = () =>
    update('colors', [
      ...form.colors,
      { id: `c-${Date.now()}`, name: '', sku: '', price: form.price || '', stock: '', image: null, gallery: [] },
    ]);

  const updateColor = (index, key, value) => {
    const next = [...form.colors];
    next[index] = { ...next[index], [key]: value };
    update('colors', next);
  };

  const removeColor = (index) => update('colors', form.colors.filter((_, i) => i !== index));

  const toggleSize = (size) => {
    update('sizes', form.sizes.includes(size) ? form.sizes.filter((s) => s !== size) : [...form.sizes, size]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputCls =
    'w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-neutral-400';
  const labelCls = 'mb-1.5 block text-sm font-medium text-neutral-700';
  const sectionCls = 'border-b border-neutral-200 pb-8';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Product info */}
      <section className={sectionCls}>
        <h2 className="mb-4 font-display text-lg font-semibold text-neutral-900">Product Information</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Product Name *</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} className={inputCls} placeholder="e.g. Kh Runner Pro" />
          </div>
          <div>
            <label className={labelCls}>SKU</label>
            <input value={form.sku} onChange={(e) => update('sku', e.target.value)} className={inputCls} placeholder="KHS-SHO-001" />
          </div>
          <div>
            <label className={labelCls}>Slug</label>
            <input value={form.slug} onChange={(e) => update('slug', e.target.value)} className={inputCls} placeholder="kh-runner-pro" />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className={inputCls}>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="sport">Sport</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className={labelCls}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            className={inputCls}
            placeholder="Product description..."
          />
        </div>
      </section>

      {/* Pricing & stock */}
      <section className={sectionCls}>
        <h2 className="mb-4 font-display text-lg font-semibold text-neutral-900">Pricing & Stock</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Price ($) *</label>
            <input required type="number" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Sale Price ($)</label>
            <input type="number" step="0.01" value={form.salePrice} onChange={(e) => update('salePrice', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Stock Quantity</label>
            <input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Low Stock Alert</label>
            <input type="number" value={form.lowStockAlert} onChange={(e) => update('lowStockAlert', e.target.value)} className={inputCls} />
          </div>
        </div>
      </section>

      {/* Status & flags */}
      <section className={sectionCls}>
        <h2 className="mb-4 font-display text-lg font-semibold text-neutral-900">Status & Visibility</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className={labelCls}>Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)} className={inputCls}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2.5 text-sm text-neutral-700">
              <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="h-4 w-4 accent-neutral-900" />
              Featured Product
            </label>
            <label className="flex items-center gap-2.5 text-sm text-neutral-700">
              <input type="checkbox" checked={form.newArrival} onChange={(e) => update('newArrival', e.target.checked)} className="h-4 w-4 accent-neutral-900" />
              New Arrival
            </label>
            <label className="flex items-center gap-2.5 text-sm text-neutral-700">
              <input type="checkbox" checked={form.bestSeller} onChange={(e) => update('bestSeller', e.target.checked)} className="h-4 w-4 accent-neutral-900" />
              Best Seller
            </label>
          </div>
        </div>
      </section>

      {/* Main image */}
      <section className={sectionCls}>
        <h2 className="mb-4 font-display text-lg font-semibold text-neutral-900">Product Images</h2>
        <ImageUpload
          images={[form.image, ...form.gallery].filter(Boolean)}
          onImagesChange={(imgs) => {
            update('image', imgs[0] || null);
            update('gallery', imgs.slice(1));
          }}
          maxImages={6}
        />
      </section>

      {/* Sizes */}
      <section className={sectionCls}>
        <h2 className="mb-2 font-display text-lg font-semibold text-neutral-900">Available Sizes</h2>
        <p className="mb-4 text-sm text-neutral-500">Select the sizes available for this product.</p>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSize(s)}
              className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                form.sizes.includes(s)
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Color variants */}
      <section className={sectionCls}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-neutral-900">Color Variants</h2>
            <p className="text-sm text-neutral-500">KhShop products support image-based color variants.</p>
          </div>
          <button
            type="button"
            onClick={addColor}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400"
          >
            <Plus size={16} /> Add Color
          </button>
        </div>

        {form.colors.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-300 py-6 text-center text-sm text-neutral-500">
            No color variants yet. Add one to support different product colors.
          </p>
        ) : (
          <div className="space-y-4">
            {form.colors.map((color, i) => (
              <div key={color.id} className="rounded-lg border border-neutral-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-700">Variant {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(i)}
                    className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete color"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className={labelCls}>Color Name</label>
                    <input value={color.name} onChange={(e) => updateColor(i, 'name', e.target.value)} className={inputCls} placeholder="e.g. Black/White" />
                  </div>
                  <div>
                    <label className={labelCls}>SKU</label>
                    <input value={color.sku} onChange={(e) => updateColor(i, 'sku', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Price ($)</label>
                    <input type="number" step="0.01" value={color.price} onChange={(e) => updateColor(i, 'price', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Stock</label>
                    <input type="number" value={color.stock} onChange={(e) => updateColor(i, 'stock', e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div className="mt-3">
                  <label className={labelCls}>Color Image</label>
                  <ImageUpload
                    single
                    images={color.image ? [color.image] : []}
                    onImagesChange={(imgs) => updateColor(i, 'image', imgs[0] || null)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
