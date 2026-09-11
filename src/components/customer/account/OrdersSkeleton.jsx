function SkeletonBar({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded bg-neutral-200 ${className}`}
      aria-hidden="true"
    />
  );
}

export function OrdersTableSkeleton({ rows = 4 }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
            <th className="px-6 py-4 font-semibold">Order</th>
            <th className="px-6 py-4 font-semibold">Date</th>
            <th className="px-6 py-4 font-semibold">Items</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-neutral-50 last:border-0">
              <td className="px-6 py-4">
                <SkeletonBar className="h-4 w-24" />
              </td>
              <td className="px-6 py-4">
                <SkeletonBar className="h-4 w-28" />
              </td>
              <td className="px-6 py-4">
                <SkeletonBar className="h-4 w-16" />
              </td>
              <td className="px-6 py-4">
                <SkeletonBar className="h-6 w-20 rounded-full" />
              </td>
              <td className="px-6 py-4 text-right">
                <SkeletonBar className="ml-auto h-4 w-20" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function OrdersCardSkeleton({ rows = 3 }) {
  return (
    <div className="divide-y divide-neutral-100 md:hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4">
          <div className="flex items-center justify-between">
            <SkeletonBar className="h-4 w-28" />
            <SkeletonBar className="h-5 w-16 rounded-full" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <SkeletonBar className="h-3 w-36" />
            <SkeletonBar className="h-4 w-16" />
          </div>
          <div className="mt-2">
            <SkeletonBar className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrdersSkeleton({ rows = 4 }) {
  return (
    <div className="border border-neutral-200 bg-white">
      <OrdersTableSkeleton rows={rows} />
      <OrdersCardSkeleton rows={rows} />
    </div>
  );
}
