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
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          View all →
        </Link>
      }
      bodyClassName="overflow-x-auto"
    >
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-neutral-100 text-xs uppercase tracking-wider text-neutral-500">
            <th className="px-5 py-4 font-semibold">Product</th>
            <th className="px-5 py-4 text-right font-semibold">Sold</th>
            <th className="px-5 py-4 text-right font-semibold">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {top.map((p, i) => (
            <tr key={p.id} className="border-b border-neutral-50 transition-colors last:border-0 hover:bg-neutral-50/60">
              <td className="px-5 py-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-base font-bold text-neutral-600">
                    {i + 1}
                  </span>
                  <img src={p.image} alt={p.name} className="h-12 w-12 shrink-0 rounded-lg border border-neutral-100 bg-neutral-100 object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-base font-medium text-neutral-900">{p.name}</p>
                    <p className="text-sm text-neutral-400">{p.categoryName || 'Product'}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-right text-base font-semibold text-neutral-900">
                {p.sold ?? 0}
              </td>
              <td className="px-5 py-4 text-right text-base text-neutral-700">
                {formatPrice(p.revenue ?? 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
