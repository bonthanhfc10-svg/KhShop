import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Card from '../common/Card';
import { reportService } from '../../../services/admin/reportService';
import { formatPrice } from '../../../utils/formatPrice';

const periods = ['7D', '30D', '3M', '1Y'];

const currencyTick = (value) => {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
};

export default function SalesChart({ initialData = [] }) {
  const [period, setPeriod] = useState('7D');
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    reportService
      .getSalesChart(period)
      .then((res) => {
        if (!mounted) return;
        setData(Array.isArray(res) ? res : []);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [period]);

  const total = data.reduce((s, d) => s + (d.sales || 0), 0);

  return (
    <Card
      title="Sales Overview"
      subtitle="Revenue and orders over time"
      action={
        <div className="flex gap-1 rounded-lg bg-admin-surface-subtle p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              disabled={loading}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                period === p ? 'bg-admin-card-elevated text-admin-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      }
      bodyClassName="p-5"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            {formatPrice(total)}
          </p>
        </div>
        <div className="flex gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-admin-primary" /> Sales
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Orders
          </span>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#D6DBE5" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={currencyTick}
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              formatter={(value, name) =>
                name === 'sales' ? [formatPrice(value), 'Sales'] : [value, 'Orders']
              }
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #C8CED9',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: 12,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="sales"
              name="Sales"
              stroke="#4338CA"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#4338CA' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={{ r: 2, fill: '#94a3b8' }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
