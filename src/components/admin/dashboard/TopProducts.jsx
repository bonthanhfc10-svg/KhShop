import { Link } from 'react-router-dom';
import Card from '../common/Card';
import { formatPrice } from '../../../utils/formatPrice';

export default function TopProducts({ products = [] }) {
  const top = products.slice(0, 5);

  return (
    <Card
      title="Top Selling Products"
      subtitle="Best sellers by units"
      action={
        <Link
          to="/admin/reports/products"
          className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-admin-primary transition-colors hover:bg-admin-primary-light"
        >
          View all
        </Link>
      }
      bodyClassName="overflow-x-auto"
    >
      <table className="w-full text-left">
        <thead>
          <tr className="border-b-2 border-admin-border bg-admin-table-header">
            <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Product</th>
            <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Sold</th>
            <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Revenue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-admin-border-subtle">
          {top.map((p, i) => (
            <tr key={p.id} className="transition-colors hover:bg-admin-primary-light/20">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-admin-primary/10 text-xs font-bold text-admin-primary">
                    {i + 1}
                  </span>
                  <img src={p.image} alt={p.name} className="h-10 w-10 shrink-0 rounded-lg border border-admin-border-subtle bg-admin-surface-subtle object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.categoryName || 'Product'}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-900">
                {p.sold ?? 0}
              </td>
              <td className="px-5 py-3.5 text-right text-sm text-slate-700">
                {formatPrice(p.revenue ?? 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
