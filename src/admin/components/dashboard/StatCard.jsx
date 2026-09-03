import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, change, icon, color = 'text-neutral-900', footnote = 'vs last 7 days' }) {
  const Icon = icon;
  const positive = change >= 0;
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
          <Icon size={24} className="text-neutral-700" />
        </div>
        <div className="text-right">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}
          >
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {positive ? '+' : ''}
            {change}%
          </span>
        </div>
      </div>
      <p className={`mt-5 font-display text-3xl font-bold ${color}`}>{value}</p>
      <p className="mt-1.5 text-base font-medium text-neutral-700">{label}</p>
      <p className="mt-0.5 text-sm text-neutral-400">{footnote}</p>
    </div>
  );
}
