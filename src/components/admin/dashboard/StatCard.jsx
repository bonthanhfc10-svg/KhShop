import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  green: {
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-700',
    changeBg: 'bg-emerald-50 text-emerald-700',
    topBorder: 'border-l-emerald-500',
  },
  blue: {
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-700',
    changeBg: 'bg-blue-50 text-blue-700',
    topBorder: 'border-l-blue-500',
  },
  violet: {
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-700',
    changeBg: 'bg-violet-50 text-violet-700',
    topBorder: 'border-l-violet-500',
  },
  amber: {
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-700',
    changeBg: 'bg-amber-50 text-amber-700',
    topBorder: 'border-l-amber-500',
  },
};

export default function StatCard({ label, value, change, icon, color = 'text-slate-900', footnote = 'vs last 7 days', theme = 'green' }) {
  const Icon = icon;
  const positive = change >= 0;
  const t = colorMap[theme] || colorMap.green;

  return (
    <div className={`group rounded-xl border border-admin-border bg-admin-card p-5 border-l-[3px] ${t.topBorder} shadow-sm transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.iconBg} transition-transform duration-200 group-hover:scale-105`}>
          <Icon size={20} className={t.iconText} />
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
            positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {positive ? '+' : ''}{change}%
        </span>
      </div>
      <p className={`mt-4 text-2xl font-bold tracking-tight ${color}`}>{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-0.5 text-xs text-slate-400">{footnote}</p>
    </div>
  );
}
