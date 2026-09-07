const styles = {
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'In Stock': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Processing: 'bg-sky-50 text-sky-700 border-sky-200',
  Shipped: 'bg-amber-50 text-amber-700 border-amber-200',
  Pending: 'bg-orange-50 text-orange-700 border-orange-200',
  'Low Stock': 'bg-amber-50 text-amber-700 border-amber-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
  Inactive: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  Draft: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  archived: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  'Out of Stock': 'bg-red-50 text-red-700 border-red-200',
  Refunded: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function StatusBadge({ status, className = '' }) {
  const cls = styles[status] || 'bg-neutral-100 text-neutral-600 border-neutral-200';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls} ${className}`}
    >
      {status}
    </span>
  );
}
