import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import AdminLoading from './Loading';
import SearchInput from './SearchInput';

export default function DataTable({
  columns,
  data,
  loading = false,
  error = null,
  onRetry,
  searchValue,
  pageSize = 10,
  emptyTitle = 'No records found',
  emptyMessage = 'No records to display.',
  emptyAction,
  selectable = false,
  selected = [],
  onSelectionChange,
  renderMobileCard,
  rowKey = 'id',
}) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const filtered = useMemo(() => {
    let rows = data;
    if (searchValue) {
      rows = rows.filter((row) =>
        columns
          .filter((c) => c.accessor)
          .some((c) =>
            String(row[c.accessor] ?? '')
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          )
      );
    }
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortDir === 'asc' ? av - bv : bv - av;
        }
        return sortDir === 'asc'
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }
    return rows;
  }, [data, searchValue, columns, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      onSelectionChange?.(selected.filter((x) => x !== id));
    } else {
      onSelectionChange?.([...selected, id]);
    }
  };

  if (loading) return <AdminLoading />;
  if (error) {
    return (
      <div className="flex flex-col items-center py-16">
        <p className="text-sm text-red-600">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Retry
          </button>
        )}
      </div>
    );
  }
  if (filtered.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} action={emptyAction} />;
  }

  return (
    <div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/60 text-xs uppercase tracking-wider text-neutral-500">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    className="h-4 w-4 accent-neutral-900"
                    checked={pageRows.every((r) => selected.includes(r[rowKey]))}
                    onChange={() => {
                      const ids = pageRows.map((r) => r[rowKey]);
                      const allSel = ids.every((id) => selected.includes(id));
                      onSelectionChange?.(allSel ? selected.filter((x) => !ids.includes(x)) : [...new Set([...selected, ...ids])]);
                    }}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold">
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.accessor)}
                      className="inline-flex items-center gap-1 hover:text-neutral-900"
                    >
                      {col.header}
                      {sortKey === col.accessor ? (
                        sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                      ) : (
                        <ArrowUpDown size={12} className="opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr
                key={row[rowKey]}
                className="border-b border-neutral-50 transition-colors last:border-0 hover:bg-neutral-50/60"
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label="Select row"
                      className="h-4 w-4 accent-neutral-900"
                      checked={selected.includes(row[rowKey])}
                      onChange={() => toggleSelect(row[rowKey])}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-neutral-100 md:hidden">
        {pageRows.map((row) => (
          <div key={row[rowKey]} className="p-4">
            {renderMobileCard
              ? renderMobileCard(row, { toggleSelect, selected })
              : columns.filter((c) => c.accessor).map((col) => (
                  <div key={col.key} className="flex justify-between py-1.5">
                    <span className="text-sm text-neutral-500">{col.header}</span>
                    <span className="text-sm font-medium text-neutral-900">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </span>
                  </div>
                ))}
          </div>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
