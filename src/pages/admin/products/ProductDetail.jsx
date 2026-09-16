import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Package, Box } from 'lucide-react';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import AdminButton from '../../../components/admin/common/AdminButton';
import AdminLoading from '../../../components/common/Loading';
import { productService } from '../../../services/admin/productService';
import { formatPrice } from '../../../utils/formatPrice';

function getProductName(product) {
  return product.name || '';
}

function getCategoryName(product) {
  if (product.category && typeof product.category === 'object') return product.category.name;
  return product.categoryName || product.category || '—';
}

function getBrandName(product) {
  if (product.brand && typeof product.brand === 'object') return product.brand.name;
  return product.brand || '—';
}

function getStock(product) {
  if (product.total_stock !== undefined) return product.total_stock;
  if (product.stock !== undefined) return product.stock;
  if (product.variants?.length) {
    return product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  }
  return 0;
}

function getColorName(variant) {
  if (variant.color && typeof variant.color === 'object') return variant.color.name;
  return variant.color_name || '—';
}

function getColorCode(variant) {
  if (variant.color && typeof variant.color === 'object') return variant.color.code;
  return null;
}

function getSizeName(variant) {
  if (variant.size && typeof variant.size === 'object') return variant.size.name;
  return variant.size_name || '—';
}

function getVariantPrice(product, variant) {
  const base = Number(product.price) || 0;
  const modifier = Number(variant.price_modifier) || 0;
  return base + modifier;
}

function getDiscountedPrice(product) {
  if (product.sale_price) return Number(product.sale_price);
  if (product.salePrice) return Number(product.salePrice);
  const base = Number(product.price) || 0;
  const dtype = product.discount_type;
  const dval = Number(product.discount_value) || 0;
  if (!dtype || dval === 0) return null;
  if (dtype === 'percent' || dtype === 'percentage') return base - (base * dval) / 100;
  if (dtype === 'fixed') return base - dval;
  return null;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <AdminLoading />;

  if (!product) {
    return (
      <div className="py-16 text-center">
        <p className="font-medium text-slate-700">Product not found</p>
        <Link to="/admin/products" className="mt-2 inline-block text-sm text-slate-500 hover:text-slate-900">
          Back to products
        </Link>
      </div>
    );
  }

  const variants = product.variants || [];
  const stock = getStock(product);
  const salePrice = getDiscountedPrice(product);
  const status = product.status || (product.is_active ? 'Active' : 'Draft');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/products"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft size={16} /> Back to products
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{getProductName(product)}</h1>
            <StatusBadge status={status === 'active' || status === 'Active' ? 'Active' : 'Draft'} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            ID: {product.id} &middot; {product.slug || '—'} &middot; {getCategoryName(product)}
          </p>
        </div>
        <AdminButton to={`/admin/products/${id}/edit`}>
          <Pencil size={16} /> Edit Product
        </AdminButton>
      </div>

      {/* Product Information */}
      <div className="rounded-xl border border-admin-border bg-admin-card shadow-sm">
        <div className="border-b-2 border-admin-border px-5 py-4">
          <h2 className="text-[15px] font-semibold text-slate-900">Product Information</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Name</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{getProductName(product)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">ID</p>
              <p className="mt-1 text-sm font-mono text-slate-600">{product.id}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Slug</p>
              <p className="mt-1 text-sm font-mono text-slate-600">{product.slug || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{getCategoryName(product)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Brand</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{getBrandName(product)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</p>
              <div className="mt-1">
                <StatusBadge status={status === 'active' || status === 'Active' ? 'Active' : 'Draft'} />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Base Price</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{formatPrice(product.price)}</p>
            </div>
            {salePrice !== null && salePrice < Number(product.price) && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Sale Price</p>
                <p className="mt-1 text-lg font-bold text-emerald-600">{formatPrice(salePrice)}</p>
                <p className="text-xs text-slate-400 line-through">{formatPrice(product.price)}</p>
              </div>
            )}
            {product.discount_type && product.discount_type !== 'none' && product.discount_value > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Discount</p>
                <p className="mt-1 rounded-md inline-block bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                  {product.discount_type === 'percent' || product.discount_type === 'percentage'
                    ? `${product.discount_value}% off`
                    : `${formatPrice(product.discount_value)} off`}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Stock</p>
              <p className={`mt-1 text-lg font-bold ${stock <= 0 ? 'text-red-600' : stock <= 10 ? 'text-amber-600' : 'text-slate-900'}`}>
                {stock}
                <span className="ml-1 text-xs font-normal text-slate-500">units</span>
              </p>
            </div>
            {product.description && (
              <div className="col-span-2 md:col-span-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{product.description}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {(product.featured || product.newArrival || product.bestSeller) && (
            <div className="mt-5 flex flex-wrap gap-1.5 border-t border-admin-border-subtle pt-4">
              {product.featured && (
                <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
                  Featured
                </span>
              )}
              {product.newArrival && (
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                  New Arrival
                </span>
              )}
              {product.bestSeller && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Best Seller
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Variants Section */}
          <div className="rounded-xl border border-admin-border bg-admin-card shadow-sm">
            <div className="border-b-2 border-admin-border px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Box size={18} className="text-slate-400" />
                  <h2 className="text-[15px] font-semibold text-slate-900">All Variants</h2>
                </div>
                {variants.length > 0 && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {variants.length}
                  </span>
                )}
              </div>
            </div>

            {variants.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Package size={32} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">No variants available</p>
                <p className="mt-1 text-xs text-slate-400">Variants will appear here when added via the API.</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-2 border-admin-border bg-admin-table-header">
                        <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">SKU</th>
                        <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Color</th>
                        <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Size</th>
                        <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Price</th>
                        <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Stock</th>
                        <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border-subtle">
                      {variants.map((v) => {
                        const vPrice = getVariantPrice(product, v);
                        const vStock = Number(v.stock) || 0;
                        const vActive = v.is_active !== false && v.is_active !== 0;
                        const colorName = getColorName(v);
                        const colorCode = getColorCode(v);
                        const sizeName = getSizeName(v);

                        return (
                          <tr key={v.id} className="transition-colors hover:bg-admin-primary-light/20">
                            <td className="px-5 py-3.5 text-sm font-mono text-slate-500">{v.sku || '—'}</td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                {colorCode && (
                                  <span
                                    className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-slate-200"
                                    style={{ backgroundColor: colorCode }}
                                  />
                                )}
                                <span className="text-sm text-slate-700">{colorName}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-sm font-medium text-slate-700">{sizeName}</td>
                            <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">
                              {formatPrice(vPrice)}
                              {Number(v.price_modifier) !== 0 && (
                                <span className="ml-1 text-xs text-slate-400">
                                  ({Number(v.price_modifier) > 0 ? '+' : ''}{formatPrice(v.price_modifier)})
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <span className={`text-sm font-semibold ${vStock <= 0 ? 'text-red-600' : vStock <= 5 ? 'text-red-600' : vStock <= 10 ? 'text-amber-600' : 'text-slate-700'}`}>
                                {vStock}
                                {vStock === 0 && <span className="ml-1 text-xs font-normal text-slate-400">Out of stock</span>}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <StatusBadge status={vActive ? 'Active' : 'Inactive'} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile variant cards */}
                <div className="divide-y divide-admin-border-subtle md:hidden">
                  {variants.map((v) => {
                    const vPrice = getVariantPrice(product, v);
                    const vStock = Number(v.stock) || 0;
                    const vActive = v.is_active !== false && v.is_active !== 0;
                    const colorName = getColorName(v);
                    const colorCode = getColorCode(v);
                    const sizeName = getSizeName(v);

                    return (
                      <div key={v.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900">{colorName} / {sizeName}</p>
                            </div>
                            <p className="mt-0.5 text-xs font-mono text-slate-400">{v.sku || 'No SKU'}</p>
                            <div className="mt-2 flex items-center gap-3 text-sm">
                              <span className="font-semibold text-slate-900">{formatPrice(vPrice)}</span>
                              <StatusBadge status={vActive ? 'Active' : 'Inactive'} />
                            </div>
                            <div className="mt-1.5 flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1.5">
                                {colorCode && (
                                  <span
                                    className="inline-block h-3 w-3 rounded-full border border-slate-200"
                                    style={{ backgroundColor: colorCode }}
                                  />
                                )}
                                <span className="text-slate-500">{colorName}</span>
                              </div>
                              <span className={`font-semibold ${vStock <= 0 ? 'text-red-600' : vStock <= 5 ? 'text-red-600' : vStock <= 10 ? 'text-amber-600' : 'text-slate-600'}`}>
                                {vStock} in stock
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
    </div>
  );
}
