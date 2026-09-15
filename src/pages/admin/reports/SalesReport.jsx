import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { DollarSign, ShoppingCart, Receipt, Users } from 'lucide-react';
import Card from '../../../components/admin/common/Card';
import AdminLoading from '../../../components/common/Loading';
import { reportService } from '../../../services/admin/reportService';
import { formatPrice } from '../../../utils/formatPrice';

const periods = ['Today', '7 Days', '30 Days', '3 Months', '1 Year', 'Custom'];

export default function SalesReport() {
  const [sales, setSales] = useState(null);
  const [trend, setTrend] = useState([]);
  const [period, setPeriod] = useState('30 Days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const periodKey = { 'Today': 'today', '7 Days': '7days', '30 Days': '30days', '3 Months': '30days', '1 Year': 'year', 'Custom': '30days' };
    const chartKey = { 'Today': '7D', '7 Days': '7D', '30 Days': '30D', '3 Months': '3M', '1 Year': '1Y', 'Custom': '30D' };
    Promise.all([
      reportService.getSalesData(periodKey[period] || '30days'),
      reportService.getSalesChart(chartKey[period] || '30D'),
    ]).then(([data, chart]) => {
      if (mounted) {
        setSales(data);
        setTrend(chart);
      }
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [period]);

  if (loading) return <AdminLoading />;

  const kpis = [
    { label: 'Revenue', value: formatPrice(sales.revenue), icon: DollarSign },
    { label: 'Orders', value: sales.orders.toLocaleString(), icon: ShoppingCart },
    { label: 'Avg. Order Value', value: formatPrice(sales.avgOrder), icon: Receipt },
    { label: 'Customers', value: sales.customers.toLocaleString(), icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold text-neutral-900">Sales Report</h1>
        <p className="mt-1 text-sm text-neutral-500">Revenue, orders and customer metrics.</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              period === p ? 'bg-[#25A9EB] text-white' : 'bg-admin-card text-neutral-500 hover:bg-neutral-100'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg border border-admin-border bg-admin-card p-5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
              <k.icon size={18} className="text-neutral-700" />
            </div>
            <p className="mt-3 font-sans text-2xl font-bold text-neutral-900">{k.value}</p>
            <p className="mt-1 text-sm text-neutral-500">{k.label}</p>
          </div>
        ))}
      </div>

      <Card title="Revenue vs Orders" subtitle={`For ${period.toLowerCase()}`} bodyClassName="p-5">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`)}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                formatter={(value, name) => (name === 'sales' ? [`$${Number(value).toLocaleString()}`, 'Revenue'] : [value, name === 'orders' ? 'Orders' : name])}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 13 }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
              <Bar dataKey="sales" fill="#171717" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="orders" fill="#d4d4d8" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
