import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Package } from 'lucide-react';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import AdminButton from '../../../components/admin/common/AdminButton';
import AdminLoading from '../../../components/common/Loading';
import { supplierService } from '../../../services/admin/supplierService';
import { formatPrice } from '../../../utils/formatPrice';

function getDiscountedPrice(product) {
  if (product.sale_price) return Number(product.sale_price);
  const base = Number(product.price) || 0;
  const dtype = product.discount_type;
  const dval = Number(product.discount_value) || 0;
  if (!dtype || dval === 0) return null;
  if (dtype === 'percent') return base - (base * dval) / 100;
  if (dtype === 'fixed') return base - dval;
  return null;
}

export default function SupplierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supplierService.getById(id)
      .then((data) => {
        if (!data) setError('Supplier not found');
        else setSupplier(data);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Failed to load supplier.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <AdminLoading />;

  if (error || !supplier) {
    return (
      <div className="space-y-5">
        <Link to="/admin/suppliers" className="mb-2 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
          <ArrowLeft size={16} /> Back to suppliers
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Supplier Details</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="text-sm font-semibold text-red-700">{error || 'Supplier not found'}</p>
          <AdminButton variant="primary" onClick={() => navigate('/admin/suppliers')} className="mt-3">Go Back</AdminButton>
        </div>
      </div>
    );
  }

  const products = supplier.products || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/suppliers"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft size={16} /> Back to suppliers
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{supplier.name}</h1>
            <StatusBadge status={supplier.is_active ? 'Active' : 'Inactive'} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            ID: {supplier.id} &middot; {products.length} products supplied
          </p>
        </div>
        <AdminButton to={`/admin/suppliers/${id}/edit`}>
          <Pencil size={16} /> Edit Supplier
        </AdminButton>
      </div>

      {/* Contact Information */}
      <div className="rounded-xl border border-admin-border bg-admin-card shadow-sm">
        <div className="border-b-2 border-admin-border px-5 py-4">
          <h2 className="text-[15px] font-semibold text-slate-900">Contact Information</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact Person</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{supplier.contact_name || <span className="text-slate-300">&mdash;</span>}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{supplier.phone || <span className="text-slate-300">&mdash;</span>}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{supplier.email || <span className="text-slate-300">&mdash;</span>}</p>
            </div>
            <div className="col-span-2 md:col-span-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Address</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{supplier.address || <span className="text-slate-300">&mdash;</span>}</p>
            </div>
            {supplier.notes && (
              <div className="col-span-2 md:col-span-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Notes</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{supplier.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Supplied */}
      <div className="rounded-xl border border-admin-border bg-admin-card shadow-sm">
        <div className="border-b-2 border-admin-border px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Package size={18} className="text-slate-400" />
              <h2 className="text-[15px] font-semibold text-slate-900">Products Supplied</h2>
            </div>
            {products.length > 0 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {products.length}
              </span>
            )}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Package size={32} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">No products supplied by this supplier.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-admin-border bg-admin-table-header">
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Product</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Supplier SKU</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Cost Price</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Retail Price</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border-subtle">
                  {products.map((p) => {
                    const salePrice = getDiscountedPrice(p);
                    return (
                      <tr key={p.id} className="transition-colors hover:bg-admin-primary-light/20">
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                          <p className="text-xs font-mono text-slate-400">{p.slug}</p>
                        </td>
                        <td className="px-5 py-3.5 text-sm font-mono text-slate-500">
                          {p.pivot?.supplier_sku || <span className="text-slate-300">&mdash;</span>}
                        </td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">
                          {formatPrice(p.pivot?.cost_price)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-semibold text-slate-900">{formatPrice(p.price)}</span>
                          {salePrice !== null && salePrice < Number(p.price) && (
                            <span className="ml-2 text-xs font-medium text-emerald-600">{formatPrice(salePrice)}</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={p.is_active ? 'Active' : 'Inactive'} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-end">
                            <Link
                              to={`/admin/products/${p.id}`}
                              className="inline-flex items-center gap-1.5 rounded-md bg-[#25A9EB] px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-[#2098D3]"
                            >
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-admin-border-subtle md:hidden">
              {products.map((p) => {
                const salePrice = getDiscountedPrice(p);
                return (
                  <div key={p.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                        <p className="mt-0.5 text-xs font-mono text-slate-400">{p.pivot?.supplier_sku || 'No SKU'}</p>
                        <div className="mt-2 flex items-center gap-3 text-sm">
                          <span className="font-semibold text-slate-900">{formatPrice(p.pivot?.cost_price)}</span>
                          <span className="text-slate-400">&rarr;</span>
                          <span className="font-semibold text-slate-900">{formatPrice(p.price)}</span>
                          {salePrice !== null && salePrice < Number(p.price) && (
                            <span className="text-xs font-medium text-emerald-600">{formatPrice(salePrice)}</span>
                          )}
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <StatusBadge status={p.is_active ? 'Active' : 'Inactive'} />
                          {p.pivot?.is_primary && (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Primary</span>
                          )}
                        </div>
                      </div>
                      <Link
                        to={`/admin/products/${p.id}`}
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-[#25A9EB] px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-[#2098D3]"
                      >
                        View
                      </Link>
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
