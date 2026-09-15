const styles = {
  Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'In Stock': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Processing: 'bg-blue-100 text-blue-800 border-blue-200',
  Shipped: 'bg-amber-100 text-amber-800 border-amber-200',
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  'Low Stock': 'bg-amber-100 text-amber-800 border-amber-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200',
  'Out of Stock': 'bg-red-100 text-red-800 border-red-200',
  Inactive: 'bg-slate-100 text-slate-700 border-slate-200',
  Draft: 'bg-slate-100 text-slate-700 border-slate-200',
  archived: 'bg-slate-100 text-slate-700 border-slate-200',
  Refunded: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function StatusBadge({ status, className = '' }) {
  const cls = styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${cls} ${className}`}
    >
      {status}
    </span>
  );
}
