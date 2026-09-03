import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  title = 'No data found',
  message = 'There are no records to display.',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
        <PackageOpen size={26} className="text-neutral-400" />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
