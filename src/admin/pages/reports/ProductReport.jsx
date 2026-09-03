import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '../../components/common/Card';
import AdminLoading from '../../components/common/Loading';
import { reportService } from '../../services/reportService';
import { formatPrice } from '../../../utils/formatPrice';

const COLORS = ['#171717', '#52525b', '#a1a1aa', '#d4d4d8', '#e4e4e7', '#f4f4f5'];

export default function ProductReport() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    reportService.getTopProducts().then((data) => {
      if (mounted) setProducts(data);
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <AdminLoading />;

  const byCategory = products.reduce((acc, p) => {
    const cat = p.categoryName || 'Other';
    acc[cat] = (acc[cat] || 0) + (p.revenue || 0);
    return acc;
  }, {});
  const categoryData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Product Report</h1>
        <p className="mt-1 text-sm text-neutral-500">Best sellers and revenue by product.</p>
      </div>

      <Card title="Best Sellers" subtitle="By units sold" bodyClassName="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-xs uppercase tracking-wider text-neutral-500">
              <th className="px-5 py-3 font-semibold">Product</th>
              <th className="px-5 py-3 text-right font-semibold">Sold</th>
              <th className="px-5 py-3 text-right font-semibold">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="h-10 w-10 shrink-0 rounded-lg border border-neutral-100 object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-neutral-900">{p.name}</p>
                      <p className="text-xs text-neutral-400">{p.categoryName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-right font-semibold text-neutral-900">{p.sold} sold</td>
                <td className="px-5 py-3 text-right text-neutral-700">{formatPrice(p.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Revenue by Category" subtitle="Share of product revenue" bodyClassName="p-5">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={2}
                  label
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatPrice(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Revenue by Product" subtitle="Total revenue per product" bodyClassName="divide-y divide-neutral-100">
          {products.map((p) => {
            const max = Math.max(...products.map((x) => x.revenue || 0));
            return (
              <div key={p.id} className="px-5 py-3">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="truncate font-medium text-neutral-900">{p.name}</span>
                  <span className="font-semibold text-neutral-700">{formatPrice(p.revenue)}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-neutral-900"
                    style={{ width: `${((p.revenue || 0) / max) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
