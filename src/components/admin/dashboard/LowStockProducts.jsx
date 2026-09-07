import { Link } from 'react-router-dom';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';

export default function LowStockProducts({ products = [] }) {
  const low = products
    .filter((p) => p.stock <= 10)
    .slice(0, 6);

  return (
    <Card
      title="Low Stock Alert"
      subtitle="Products running low"
      action={
        <Link
          to="/admin/inventory/low-stock"
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          View all →
        </Link>
      }
      bodyClassName="divide-y divide-neutral-100"
    >
      {low.length === 0 && (
        <p className="px-5 py-10 text-center text-base text-neutral-500">
          All products are sufficiently stocked.
        </p>
      )}
      {low.map((p) => (
        <div key={p.id} className="flex items-center gap-3 px-5 py-4">
          <img src={p.image} alt={p.name} className="h-12 w-12 shrink-0 rounded-lg border border-neutral-100 bg-neutral-100 object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-medium text-neutral-900">{p.name}</p>
            <p className="text-sm text-neutral-400">SKU: {p.sku}</p>
          </div>
          <div className="text-right">
            <p className={`text-base font-semibold ${p.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
              {p.stock} left
            </p>
            <StatusBadge status={p.stock === 0 ? 'Out of Stock' : 'Low Stock'} />
          </div>
        </div>
      ))}
    </Card>
  );
}
