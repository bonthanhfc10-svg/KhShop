import { useState, useRef, useEffect } from 'react';
import AdminButton from '../common/AdminButton';
import { Plus, Trash2, AlertTriangle, Upload, X, Image as ImageIcon } from 'lucide-react';
import { productService } from '../../../services/admin/productService';

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const DEFAULT_COLORS = ['Black', 'White', 'Grey', 'Red', 'Blue', 'Navy', 'Green', 'Brown', 'Beige', 'Pink', 'Yellow', 'Orange'];

const DISCOUNT_TYPES = [
  { value: 'none', label: 'No Discount' },
  { value: 'percent', label: 'Percentage (%)' },
  { value: 'fixed', label: 'Fixed Amount ($)' },
];

function buildVariantKey(color, size) {
  return `${color}__${size}`;
}

function calcSalePrice(price, discountType, discountValue) {
  const p = Number(price) || 0;
  const v = Number(discountValue) || 0;
  if (!discountType || discountType === 'none' || v === 0) return null;
  if (discountType === 'percent') return Math.max(0, p - (p * v) / 100);
  if (discountType === 'fixed') return Math.max(0, p - v);
  return null;
}

function VariantImageUpload({ imageUrl, onImageChange, onRemove }) {
  const inputRef = useRef(null);

  return (
    <div className="flex items-center gap-2">
      <div className="group relative h-10 w-10 shrink-0 overflow-hidden rounded border border-neutral-200 bg-neutral-50">
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="Variant" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={onRemove}
              className="absolute right-0 top-0 rounded bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={8} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full items-center justify-center text-neutral-300 transition-colors hover:text-neutral-500"
          >
            <ImageIcon size={14} />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const url = URL.createObjectURL(file);
            onImageChange(url, file);
          }
          e.target.value = '';
        }}
      />
      {imageUrl ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="whitespace-nowrap text-[11px] font-medium text-neutral-400 transition-colors hover:text-[#25A9EB]"
        >
          Change
        </button>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="whitespace-nowrap text-[11px] font-medium text-neutral-400 transition-colors hover:text-[#25A9EB]"
        >
          Upload
        </button>
      )}
    </div>
  );
}

export default function ProductForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Save Product', submitting = false, buttonVariant = 'primary', editMode = false }) {
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Promise.all([
      productService.getColors({ per_page: 100 }).catch(() => ({ items: [] })),
      productService.getSizes({ per_page: 100 }).catch(() => ({ items: [] })),
      productService.getBrands({ per_page: 100 }).catch(() => ({ items: [] })),
      productService.getCategories({ per_page: 100 }).catch(() => ({ items: [] })),
    ]).then(([c, s, b, cat]) => {
      setColors(c.items || c || []);
      setSizes(s.items || s || []);
      setBrands(b.items || b || []);
      setCategories(cat.items || cat || []);
    });
  }, []);

  const [form, setForm] = useState({
    name: initial.name || '',
    slug: initial.slug || '',
    description: initial.description || '',
    category_id: initial.category_id || '',
    brand_id: initial.brand_id || '',
    price: initial.price || '',
    discountType: initial.discount_type || 'none',
    discountValue: initial.discount_value || '',
    is_active: initial.is_active ?? true,
  });

  const [availableSizes, setAvailableSizes] = useState(() => {
    const initialSizes = initial.selectedSizes || [];
    const fromVariants = (initial.variants || []).map((v) => v.size?.name || v.size).filter(Boolean);
    const merged = [...new Set([...initialSizes, ...fromVariants])];
    return merged.length > 0 ? merged : [...DEFAULT_SIZES];
  });

  const [availableColors, setAvailableColors] = useState(() => {
    const initialColors = initial.selectedColors || [];
    const fromVariants = (initial.variants || []).map((v) => v.color?.name || v.color).filter(Boolean);
    const merged = [...new Set([...initialColors, ...fromVariants])];
    return merged.length > 0 ? merged : [...DEFAULT_COLORS];
  });

  const [variants, setVariants] = useState(() => {
    return (initial.variants || []).map((v, i) => ({
      id: v.id || `v-${Date.now()}-${i}`,
      color: v.color?.name || v.color || '',
      size: v.size?.name || v.size || '',
      sku: v.sku || '',
      stock: v.stock ?? '',
      price_modifier: v.price_modifier ?? '',
      is_active: v.is_active ?? true,
      image: v.image?.image_path || v.image || null,
      imageFile: null,
    }));
  });

  const [customColor, setCustomColor] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [showAddColor, setShowAddColor] = useState(false);
  const [trackInventory, setTrackInventory] = useState(true);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const addColor = (name) => {
    if (!name || availableColors.includes(name)) return;
    setAvailableColors((prev) => [...prev, name]);
  };

  const removeColor = (name) => {
    setAvailableColors((prev) => prev.filter((c) => c !== name));
    setVariants((prev) => prev.filter((v) => v.color !== name));
  };

  const addCustomColor = () => {
    const trimmed = customColor.trim();
    if (trimmed && !availableColors.includes(trimmed)) {
      addColor(trimmed);
      setCustomColor('');
    }
  };

  const handleAddColorSubmit = () => {
    const trimmed = newColorName.trim();
    if (!trimmed || availableColors.includes(trimmed)) return;
    addColor(trimmed);
    setNewColorName('');
    setShowAddColor(false);
  };

  const addSize = (name) => {
    if (!name || availableSizes.includes(name)) return;
    setAvailableSizes((prev) => [...prev, name]);
  };

  const removeSize = (name) => {
    setAvailableSizes((prev) => prev.filter((s) => s !== name));
    setVariants((prev) => prev.filter((v) => v.size !== name));
  };

  const addCustomSize = () => {
    const trimmed = customSize.trim();
    if (trimmed && !availableSizes.includes(trimmed)) {
      addSize(trimmed);
      setCustomSize('');
    }
  };

  const addVariant = () => {
    const newVariant = {
      id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      color: availableColors[0] || '',
      size: availableSizes[0] || '',
      sku: '',
      stock: '',
      price_modifier: '',
      is_active: true,
      image: null,
      imageFile: null,
    };
    setVariants((prev) => [...prev, newVariant]);
    setDuplicateWarning('');
  };

  const updateVariant = (index, key, value) => {
    const next = [...variants];
    next[index] = { ...next[index], [key]: value };

    if (key === 'color' || key === 'size') {
      const checkColor = key === 'color' ? value : next[index].color;
      const checkSize = key === 'size' ? value : next[index].size;
      const keyStr = buildVariantKey(checkColor, checkSize);
      const duplicateIndex = next.findIndex((v, i) => i !== index && buildVariantKey(v.color, v.size) === keyStr);
      if (duplicateIndex !== -1) {
        setDuplicateWarning(`"${checkColor} + ${checkSize}" combination already exists.`);
      } else {
        setDuplicateWarning('');
      }
    }

    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = next[index];
      return updated;
    });
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const invalid = variants.filter((v) => !v.sku.trim() || v.stock === '' || v.stock === null);
    if (variants.length > 0 && invalid.length > 0) {
      alert(`Please fill SKU and Stock for all variants. ${invalid.length} variant(s) are incomplete.`);
      return;
    }
    const salePrice = calcSalePrice(form.price, form.discountType, form.discountValue);

    const mappedVariants = variants.map((v) => {
      const colorObj = colors.find((c) => c.name === v.color);
      const sizeObj = sizes.find((s) => s.name === v.size);
      return {
        id: typeof v.id === 'number' ? v.id : undefined,
        color_id: colorObj ? colorObj.id : undefined,
        size_id: sizeObj ? sizeObj.id : undefined,
        sku: v.sku,
        stock: Number(v.stock) || 0,
        price_modifier: Number(v.price_modifier) || 0,
        is_active: v.is_active,
        image: v.image || null,
        imageFile: v.imageFile || null,
      };
    });

    onSubmit({
      ...form,
      category_id: form.category_id ? Number(form.category_id) : null,
      brand_id: form.brand_id ? Number(form.brand_id) : null,
      price: Number(form.price) || 0,
      discount_type: form.discountType === 'none' ? null : form.discountType,
      discount_value: form.discountType === 'none' ? null : Number(form.discountValue) || 0,
      is_active: form.is_active,
      salePrice,
      variants: mappedVariants,
    });
  };

  const inputCls =
    'w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15';
  const labelCls = 'mb-1.5 block text-sm font-medium text-neutral-700';
  const sectionCls = 'border-b border-admin-border pb-8';

  const salePrice = calcSalePrice(form.price, form.discountType, form.discountValue);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className={sectionCls}>
        <h2 className="mb-4 font-sans text-lg font-semibold text-neutral-900">Product Information</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Product Name *</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} className={inputCls} placeholder="e.g. Kh Runner Pro" />
          </div>
          <div>
            <label className={labelCls}>Slug</label>
            <input value={form.slug} onChange={(e) => update('slug', e.target.value)} className={inputCls} placeholder="kh-runner-pro" />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category_id} onChange={(e) => update('category_id', e.target.value)} className={inputCls}>
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Brand</label>
            <select value={form.brand_id} onChange={(e) => update('brand_id', e.target.value)} className={inputCls}>
              <option value="">Select brand...</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
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

      <section className={sectionCls}>
        <h2 className="mb-4 font-sans text-lg font-semibold text-neutral-900">Pricing & Discount</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className={labelCls}>Base Price ($) *</label>
            <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => update('price', e.target.value)} className={inputCls} placeholder="0.00" />
          </div>
          <div>
            <label className={labelCls}>Discount Type</label>
            <select value={form.discountType} onChange={(e) => update('discountType', e.target.value)} className={inputCls}>
              {DISCOUNT_TYPES.map((dt) => (
                <option key={dt.value} value={dt.value}>{dt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>
              {form.discountType === 'percent' ? 'Discount (%)' : form.discountType === 'fixed' ? 'Discount ($)' : 'Discount'}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.discountValue}
              onChange={(e) => update('discountValue', e.target.value)}
              className={inputCls}
              disabled={form.discountType === 'none'}
              placeholder={form.discountType === 'percent' ? 'e.g. 10' : form.discountType === 'fixed' ? 'e.g. 5.00' : ''}
            />
          </div>
        </div>
        {salePrice !== null && (
          <div className="mt-3 rounded-lg bg-[#25A9EB]/10 px-4 py-2.5 text-sm text-[#25A9EB]">
            Calculated Sale Price: <span className="font-semibold">${salePrice.toFixed(2)}</span>
          </div>
        )}
      </section>

      <section className={sectionCls}>
        <h2 className="mb-4 font-sans text-lg font-semibold text-neutral-900">Status & Visibility</h2>
        <div>
          <label className={labelCls}>Status</label>
          <select value={form.is_active ? 'active' : 'draft'} onChange={(e) => update('is_active', e.target.value === 'active')} className={inputCls}>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </section>

      <section className={sectionCls}>
        <h2 className="mb-4 font-sans text-lg font-semibold text-neutral-900">Inventory</h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="trackInventory"
            checked={trackInventory}
            onChange={(e) => setTrackInventory(e.target.checked)}
            className="h-4 w-4 accent-[#25A9EB]"
          />
          <label htmlFor="trackInventory" className="text-sm font-medium text-neutral-700">
            Track inventory
          </label>
        </div>
        {trackInventory && (
          <div className="mt-4">
            <p className="mb-3 text-sm text-neutral-500">
              Stock is managed per variant. Each color + size combination has its own inventory count.
            </p>
            {variants.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-admin-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-admin-border bg-neutral-50 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      <th className="px-4 py-2.5">Size</th>
                      <th className="px-4 py-2.5">Color</th>
                      <th className="px-4 py-2.5">SKU</th>
                      <th className="px-4 py-2.5 text-right">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-admin-border-subtle">
                    {variants.map((v, i) => (
                      <tr key={v.id} className="transition-colors hover:bg-admin-primary-light/20">
                        <td className="px-4 py-2.5 text-xs text-neutral-700">{v.size || '—'}</td>
                        <td className="px-4 py-2.5 text-xs text-neutral-700">{v.color || '—'}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-neutral-500">{v.sku || '—'}</td>
                        <td className="px-4 py-2.5 text-right">
                          {editMode ? (
                            <span className="text-xs text-slate-700">{v.stock ?? 0}</span>
                          ) : (
                            <input
                              required
                              type="number"
                              min="0"
                              value={v.stock}
                              onChange={(e) => updateVariant(i, 'stock', e.target.value === '' ? '' : Number(e.target.value))}
                              className="w-20 rounded border border-gray-300 bg-admin-card-elevated px-2.5 py-1.5 text-xs text-right outline-none transition-colors focus:border-[#25A9EB] focus:ring-1 focus:ring-[#25A9EB]/15"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-admin-border-subtle py-6 text-center">
                <p className="text-sm text-neutral-500">No variants yet. Add variants below to manage inventory.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {!editMode && (
      <section className={sectionCls}>
        <h2 className="mb-2 font-sans text-lg font-semibold text-neutral-900">Colors</h2>
        <p className="mb-4 text-sm text-neutral-500">Manage available color options for this product.</p>

        <div className="mb-3 flex flex-wrap gap-2">
          {availableColors.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#25A9EB]/30 bg-[#25A9EB]/10 px-3 py-1.5 text-sm font-medium text-[#25A9EB]"
            >
              {c}
              <button type="button" onClick={() => removeColor(c)} className="rounded-full p-0.5 transition-colors hover:bg-[#25A9EB]/20" aria-label={`Remove ${c}`}>
                <Trash2 size={12} />
              </button>
            </span>
          ))}
        </div>

        {showAddColor ? (
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className={labelCls}>Color Name</label>
              <input
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className={inputCls}
                placeholder="e.g. Blue"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColorSubmit())}
              />
            </div>
            <AdminButton variant="success" onClick={handleAddColorSubmit}>Add</AdminButton>
            <AdminButton variant="cancel" onClick={() => { setShowAddColor(false); setNewColorName(''); }}>Cancel</AdminButton>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
              className={inputCls}
              placeholder="Add new color..."
            />
            <button
              type="button"
              onClick={addCustomColor}
              className="shrink-0 rounded-lg border border-admin-border px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-[#25A9EB] hover:text-[#25A9EB]"
            >
              Add
            </button>
          </div>
        )}
      </section>
      )}

      {!editMode && (
      <section className={sectionCls}>
        <h2 className="mb-2 font-sans text-lg font-semibold text-neutral-900">Sizes</h2>
        <p className="mb-4 text-sm text-neutral-500">Add available sizes for your product variants.</p>

        <div className="mb-3 flex flex-wrap gap-2">
          {availableSizes.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#25A9EB]/30 bg-[#25A9EB]/10 px-3 py-1.5 text-sm font-medium text-[#25A9EB]"
            >
              {s}
              <button type="button" onClick={() => removeSize(s)} className="rounded-full p-0.5 transition-colors hover:bg-[#25A9EB]/20" aria-label={`Remove ${s}`}>
                <Trash2 size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
            className={inputCls}
            placeholder="Add new size..."
          />
          <button
            type="button"
            onClick={addCustomSize}
            className="shrink-0 rounded-lg border border-admin-border px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400"
          >
            Add
          </button>
        </div>
      </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-sans text-lg font-semibold text-neutral-900">Product Variants</h2>
            <p className="text-sm text-neutral-500">
              {editMode
                ? `${variants.length} existing variant${variants.length !== 1 ? 's' : ''}.`
                : `${variants.length} variant${variants.length !== 1 ? 's' : ''} — each combines a Color + Size with its own image, SKU, and stock.`
              }
            </p>
          </div>
          {!editMode && (
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-1.5 rounded-lg border border-admin-border px-3.5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-[#25A9EB] hover:text-[#25A9EB]"
            >
              <Plus size={16} /> Add Variant
            </button>
          )}
        </div>

        {duplicateWarning && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
            <AlertTriangle size={16} className="shrink-0" />
            {duplicateWarning}
          </div>
        )}

        {variants.length === 0 ? (
          <div className="rounded-lg border border-dashed border-admin-border-subtle py-8 text-center">
            <p className="text-sm text-neutral-500">No variants yet. Click "Add Variant" to create one.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-admin-border text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {!editMode && <th className="px-4 py-3">Image</th>}
                    <th className="px-4 py-3">Color</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">SKU *</th>
                    <th className="px-4 py-3">Stock *</th>
                    <th className="px-4 py-3">Price Modifier ($)</th>
                    <th className="px-4 py-3">Active</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border-subtle">
                  {variants.map((v, i) => (
                    <tr key={v.id} className="transition-colors hover:bg-admin-primary-light/20">
                      {!editMode && (
                      <td className="px-4 py-2.5">
                        <VariantImageUpload
                          imageUrl={v.image}
                          onImageChange={(url, file) => {
                            const next = [...variants];
                            next[i] = { ...next[i], image: url, imageFile: file };
                            setVariants(next);
                          }}
                          onRemove={() => {
                            const next = [...variants];
                            next[i] = { ...next[i], image: null, imageFile: null };
                            setVariants(next);
                          }}
                        />
                      </td>
                      )}
                      <td className="px-4 py-2.5">
                        <select
                          value={v.color}
                          onChange={(e) => updateVariant(i, 'color', e.target.value)}
                          disabled={editMode}
                          className="w-full rounded border border-gray-300 bg-admin-card-elevated px-2.5 py-1.5 text-xs outline-none transition-colors focus:border-[#25A9EB] focus:ring-1 focus:ring-[#25A9EB]/15 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="">Select color...</option>
                          {availableColors.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2.5">
                        <select
                          value={v.size}
                          onChange={(e) => updateVariant(i, 'size', e.target.value)}
                          disabled={editMode}
                          className="w-full rounded border border-gray-300 bg-admin-card-elevated px-2.5 py-1.5 text-xs outline-none transition-colors focus:border-[#25A9EB] focus:ring-1 focus:ring-[#25A9EB]/15 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="">Select size...</option>
                          {availableSizes.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          required
                          value={v.sku}
                          onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                          className="w-36 rounded border border-gray-300 bg-admin-card-elevated px-2.5 py-1.5 text-xs outline-none transition-colors focus:border-[#25A9EB] focus:ring-1 focus:ring-[#25A9EB]/15"
                          placeholder="KHS-SHO-001-BLK-S"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        {editMode ? (
                          <span className="block w-20 rounded border border-transparent px-2.5 py-1.5 text-xs text-slate-700">{v.stock ?? 0}</span>
                        ) : (
                        <input
                          required
                          type="number"
                          min="0"
                          value={v.stock}
                          onChange={(e) => updateVariant(i, 'stock', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-20 rounded border border-gray-300 bg-admin-card-elevated px-2.5 py-1.5 text-xs outline-none transition-colors focus:border-[#25A9EB] focus:ring-1 focus:ring-[#25A9EB]/15"
                        />
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          type="number"
                          step="0.01"
                          value={v.price_modifier}
                          onChange={(e) => updateVariant(i, 'price_modifier', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-24 rounded border border-gray-300 bg-admin-card-elevated px-2.5 py-1.5 text-xs outline-none transition-colors focus:border-[#25A9EB] focus:ring-1 focus:ring-[#25A9EB]/15"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={v.is_active}
                          onChange={(e) => updateVariant(i, 'is_active', e.target.checked)}
                          className="h-4 w-4 accent-[#25A9EB]"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <button
                          type="button"
                          onClick={() => removeVariant(i)}
                          className="rounded p-1 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label="Remove variant"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {variants.map((v, i) => (
                <div key={v.id} className="rounded-lg border border-admin-border p-3.5">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-700">
                      {v.color && v.size ? `${v.color} / ${v.size}` : v.color || v.size || 'New Variant'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => removeVariant(i)} className="rounded p-1 text-neutral-400 hover:text-red-600" aria-label="Remove variant">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {!editMode && (
                  <div className="mb-3">
                    <VariantImageUpload
                      imageUrl={v.image}
                      onImageChange={(url, file) => {
                        const next = [...variants];
                        next[i] = { ...next[i], image: url, imageFile: file };
                        setVariants(next);
                      }}
                      onRemove={() => {
                        const next = [...variants];
                        next[i] = { ...next[i], image: null, imageFile: null };
                        setVariants(next);
                      }}
                    />
                  </div>
                  )}

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-500">Color</label>
                      <select
                        value={v.color}
                        onChange={(e) => updateVariant(i, 'color', e.target.value)}
                        disabled={editMode}
                        className="w-full rounded border border-gray-300 bg-admin-card-elevated px-2.5 py-1.5 text-xs outline-none focus:border-[#25A9EB] focus:ring-1 focus:ring-[#25A9EB]/15 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="">Select...</option>
                        {availableColors.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-500">Size</label>
                      <select
                        value={v.size}
                        onChange={(e) => updateVariant(i, 'size', e.target.value)}
                        disabled={editMode}
                        className="w-full rounded border border-gray-300 bg-admin-card-elevated px-2.5 py-1.5 text-xs outline-none focus:border-[#25A9EB] focus:ring-1 focus:ring-[#25A9EB]/15 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="">Select...</option>
                        {availableSizes.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-500">SKU *</label>
                      <input
                        required
                        value={v.sku}
                        onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                        className="w-full rounded border border-gray-300 bg-admin-card-elevated px-2.5 py-1.5 text-xs outline-none focus:border-[#25A9EB] focus:ring-1 focus:ring-[#25A9EB]/15"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-500">Stock *</label>
                      {editMode ? (
                        <span className="block w-full rounded border border-transparent px-2.5 py-1.5 text-xs text-slate-700">{v.stock ?? 0}</span>
                      ) : (
                      <input
                        required
                        type="number"
                        min="0"
                        value={v.stock}
                        onChange={(e) => updateVariant(i, 'stock', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full rounded border border-gray-300 bg-admin-card-elevated px-2.5 py-1.5 text-xs outline-none focus:border-[#25A9EB] focus:ring-1 focus:ring-[#25A9EB]/15"
                      />
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-500">Price Modifier ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={v.price_modifier}
                        onChange={(e) => updateVariant(i, 'price_modifier', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full rounded border border-gray-300 bg-admin-card-elevated px-2.5 py-1.5 text-xs outline-none focus:border-[#25A9EB] focus:ring-1 focus:ring-[#25A9EB]/15"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-xs text-neutral-500">
                        <input type="checkbox" checked={v.is_active} onChange={(e) => updateVariant(i, 'is_active', e.target.checked)} className="accent-[#25A9EB]" />
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <div className="flex justify-end gap-2">
        {onCancel && <AdminButton variant="cancel" onClick={onCancel}>Cancel</AdminButton>}
        <button
          type="submit"
          disabled={submitting}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97] ${
            buttonVariant === 'success'
              ? 'bg-[#25A9EB] text-white hover:bg-[#2098D3] shadow-sm shadow-[#25A9EB]/20 focus-visible:ring-[#25A9EB]'
              : 'bg-neutral-900 text-white hover:bg-neutral-700 shadow-sm focus-visible:ring-neutral-900'
          }`}
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
