import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, Receipt } from 'lucide-react';
import Card from '../../components/common/Card';
import AdminLoading from '../../components/common/Loading';
import { reportService } from '../../services/reportService';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';

const periods = ['Today', '7 Days', '30 Days', 'This Year'];

export default function Reports() {
  const [sales, setSales] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [period, setPeriod] = useState('30 Days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([reportService.getSales(), reportService.getTopProducts(), reportService.getTopCustomers()])
      .then(([s, tp, tc]) => {
        if (!mounted) return;
        setSales(s.data);
        setTopProducts(tp);
        setTopCustomers(tc);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <AdminLoading />;

  const maxRevenue = Math.max(...sales.trend.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Reports</h1>
        <p className="mt-1 text-sm text-neutral-500">Analytics and insights for your store.</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              period === p ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-500 hover:bg-neutral-100'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Sales KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Revenue', value: formatPrice(sales.revenue * 100), icon: DollarSign },
          { label: 'Orders', value: (sales.orders * 10).toLocaleString(), icon: ShoppingCart },
          { label: 'Avg. Order Value', value: formatPrice(sales.avgOrderValue * 100), icon: Receipt },
          { label: 'Customers', value: (sales.customers * 2).toLocaleString(), icon: Users },
        ].map((s) => (
          <div key={s.label} className="border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
              <s.icon size={18} className="text-neutral-700" />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-neutral-900">{s.value}</p>
            <p className="mt-1 text-sm text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sales trend chart */}
      <Card title="Sales Trend" subtitle={`Revenue for ${period.toLowerCase()}`} bodyClassName="p-5">
        <div className="mt-2 flex h-48 items-end gap-3">
          {sales.trend.map((d) => (
            <div key={d.label} className="group flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t bg-neutral-900 transition-all group-hover:bg-neutral-700"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                />
              </div>
              <span className="text-xs text-neutral-500">{d.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top products */}
        <Card title="Top Selling Products" subtitle="By units sold" bodyClassName="divide-y divide-neutral-100">
          {topProducts.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 px-5 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-sm font-bold text-neutral-600">
                {i + 1}
              </span>
              <img src={p.image} alt={p.name} className="h-10 w-10 shrink-0 rounded-lg border border-neutral-100 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">{p.name}</p>
                <p className="text-xs text-neutral-400">{p.categoryName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-neutral-900">{p.sold} sold</p>
                <p className="text-xs text-neutral-400">{formatPrice(p.revenue)}</p>
              </div>
            </div>
          ))}
        </Card>

        {/* Top customers */}
        <Card title="Top Customers" subtitle="By total spending" bodyClassName="divide-y divide-neutral-100">
          {topCustomers.map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-5 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                {c.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">{c.name}</p>
                <p className="text-xs text-neutral-400">Joined {formatDate(c.joined)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-neutral-900">{formatPrice(c.totalSpent)}</p>
                <p className="text-xs text-neutral-400">{c.orders} orders</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
