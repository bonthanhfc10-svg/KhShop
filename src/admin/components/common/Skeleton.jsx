export const SkeletonCard = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-neutral-100 ${className}`} />
);

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonCard key={i} className="h-4 w-24" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center justify-between">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonCard key={c} className="h-6 w-24" />
          ))}
        </div>
      ))}
    </div>
  );
}
