import { useState } from 'react';
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

const periods = ['7D', '30D', '3M', '1Y'];

const mockSeries = {
  '7D': [
    { d: 'Mon', sales: 4200, orders: 210 },
    { d: 'Tue', sales: 3800, orders: 195 },
    { d: 'Wed', sales: 5100, orders: 245 },
    { d: 'Thu', sales: 4600, orders: 230 },
    { d: 'Fri', sales: 5700, orders: 270 },
    { d: 'Sat', sales: 4900, orders: 255 },
    { d: 'Sun', sales: 5300, orders: 262 },
  ],
  '30D': [
    { d: 'W1', sales: 24000, orders: 1150 },
    { d: 'W2', sales: 27500, orders: 1320 },
    { d: 'W3', sales: 25900, orders: 1240 },
    { d: 'W4', sales: 30200, orders: 1460 },
  ],
  '3M': [
    { d: 'Jun', sales: 72000, orders: 3480 },
    { d: 'Jul', sales: 69800, orders: 3320 },
    { d: 'Aug', sales: 75400, orders: 3650 },
  ],
  '1Y': [
    { d: 'Jan', sales: 56000, orders: 2650 },
    { d: 'Feb', sales: 58000, orders: 2780 },
    { d: 'Mar', sales: 61000, orders: 2900 },
    { d: 'Apr', sales: 59500, orders: 2820 },
    { d: 'May', sales: 64000, orders: 3050 },
    { d: 'Jun', sales: 67000, orders: 3180 },
    { d: 'Jul', sales: 65500, orders: 3110 },
    { d: 'Aug', sales: 70000, orders: 3340 },
  ],
};

const currencyTick = (value) => {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
};

export default function SalesChart() {
  const [period, setPeriod] = useState('7D');
  const data = mockSeries[period];
  const total = data.reduce((s, d) => s + d.sales, 0);

  return (
    <Card
      title="Sales Overview"
      subtitle="Revenue and orders over time"
      action={
        <div className="flex gap-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                period === p ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      }
      bodyClassName="p-6"
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-3xl font-bold text-neutral-900">
            ${total.toLocaleString()}
          </p>
          <p className="mt-1 text-base text-emerald-600">+12.5% vs previous period</p>
        </div>
        <div className="flex gap-5 text-sm text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" /> Sales
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-400" /> Orders
          </span>
        </div>
      </div>

      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="d"
              tick={{ fontSize: 13, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={currencyTick}
              tick={{ fontSize: 13, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              formatter={(value, name) =>
                name === 'Sales' ? [`$${Number(value).toLocaleString()}`, name] : [value, name]
              }
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e5e5e5',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                fontSize: 13,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#171717"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#171717' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#a1a1aa"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={{ r: 2, fill: '#a1a1aa' }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
