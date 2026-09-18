import { Link } from 'react-router-dom';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';

export default function LowStockProducts({ products = [] }) {
  const safeProducts = Array.isArray(products) ? products : [];
  const low = safeProducts.slice(0, 6);

  return (
    <Card
      title="Low Stock Alert"
      subtitle="Products running low"
      action={
        <Link
          to="/admin/inventory/low-stock"
          className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-admin-primary transition-colors hover:bg-admin-primary-light"
        >
          View all
        </Link>
      }
      bodyClassName="divide-y divide-admin-border-subtle"
    >
      {low.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-slate-500">
          All products are sufficiently stocked.
        </p>
      )}
      {low.map((p) => (
        <div key={p.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-admin-primary-light/20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-admin-border-subtle bg-admin-surface-subtle text-xs font-bold text-admin-primary">
            {p.stock}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{p.product}</p>
            <p className="text-xs text-slate-500">
              SKU: {p.sku}
              {p.color && ` · ${p.color}`}
              {p.size && ` · ${p.size}`}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-semibold ${p.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
              {p.stock} left
            </p>
            <StatusBadge status={p.status} />
          </div>
        </div>
      ))}
    </Card>
  );
}
