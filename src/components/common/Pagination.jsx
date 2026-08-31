import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onChange }) {
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
    <nav
      className="mt-12 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <button
        onClick={() => page > 1 && onChange(page - 1)}
        disabled={page <= 1}
        className="flex h-10 w-10 items-center justify-center border border-neutral-300 text-neutral-600 transition-colors hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className="px-2 text-neutral-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`flex h-10 w-10 items-center justify-center border text-sm transition-colors ${
              p === page
                ? 'border-black bg-black text-white'
                : 'border-neutral-300 text-neutral-600 hover:border-black hover:text-black'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => page < totalPages && onChange(page + 1)}
        disabled={page >= totalPages}
        className="flex h-10 w-10 items-center justify-center border border-neutral-300 text-neutral-600 transition-colors hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
