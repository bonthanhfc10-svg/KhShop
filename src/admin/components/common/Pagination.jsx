import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  const pages = useMemo(() => {
    const set = new Set([1, totalPages, page - 1, page, page + 1]);
    const arr = [...set]
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);
    const out = [];
    let prev = 0;
    arr.forEach((p) => {
      if (p - prev > 1) out.push('...');
      out.push(p);
      prev = p;
    });
    return out;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-between border-t border-neutral-100 px-5 py-3" aria-label="Pagination">
      <p className="text-sm text-neutral-500">
        Page <span className="font-semibold text-neutral-900">{page}</span> of{' '}
        {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => page > 1 && onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} className="px-1.5 text-neutral-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-colors ${
                p === page
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => page < totalPages && onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
