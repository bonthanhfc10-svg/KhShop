import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import AdminButton from '../../components/common/AdminButton';
import AdminLoading from '../../components/common/Loading';
import { productService } from '../../services/productService';
import { formatPrice } from '../../../utils/formatPrice';

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
        <p className="font-medium text-neutral-700">Product not found</p>
        <Link to="/admin/products" className="mt-2 inline-block text-sm text-neutral-500 hover:text-neutral-900">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/products"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft size={16} /> Back to products
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-neutral-900">{product.name}</h1>
            <StatusBadge status={product.status === 'active' ? 'Active' : 'Draft'} />
          </div>
          <p className="mt-1 text-sm text-neutral-500">{product.sku} · {product.categoryName || product.category}</p>
        </div>
        <AdminButton to={`/admin/products/${id}/edit`}><Pencil size={16} /> Edit Product</AdminButton>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            <img src={product.image} alt={product.name} className="h-64 w-full object-cover" />
            <div className="p-5">
              <p className="text-xs uppercase tracking-wider text-neutral-400">Price</p>
              <p className="font-display text-2xl font-bold text-neutral-900">{formatPrice(product.price)}</p>
              {product.salePrice && (
                <p className="text-sm text-neutral-400 line-through">{formatPrice(product.salePrice)}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card title="Product Information" bodyClassName="space-y-4 p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-400">Stock</p>
                <p className="mt-1 font-semibold text-neutral-900">{product.stock} units</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-400">Brand</p>
                <p className="mt-1 font-semibold text-neutral-900">{product.brand || 'KHShop'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-wider text-neutral-400">Description</p>
                <p className="mt-1 text-sm text-neutral-700">{product.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 border-t border-neutral-100 pt-4">
              {product.featured && <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">Featured</span>}
              {product.newArrival && <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">New Arrival</span>}
              {product.bestSeller && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Best Seller</span>}
            </div>
          </Card>

          <Card title="Available Sizes" bodyClassName="p-5">
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((s) => (
                <span key={s} className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700">
                  {s}
                </span>
              ))}
            </div>
          </Card>

          <Card title="Color Variants" bodyClassName="divide-y divide-neutral-100">
            {(product.colors || []).map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-5 py-4">
                <img src={c.image} alt={c.name} className="h-14 w-14 shrink-0 rounded-lg border border-neutral-100 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-900">{c.name}</p>
                  <p className="text-xs text-neutral-400">{c.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-900">{formatPrice(c.price)}</p>
                  <p className="text-xs text-neutral-400">{c.stock} in stock</p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
