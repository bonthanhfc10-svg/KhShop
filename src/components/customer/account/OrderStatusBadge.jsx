const statusStyles = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-sky-50 text-sky-700 border-sky-200',
  Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
  Refunded: 'bg-neutral-100 text-neutral-600 border-neutral-200',
};

export default function OrderStatusBadge({ status, className = '' }) {
  const cls = statusStyles[status] || 'bg-neutral-100 text-neutral-600 border-neutral-200';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls} ${className}`}
    >
      {status}
    </span>
  );
}
