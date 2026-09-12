import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductGrid from './ProductGrid';
import ProductSort from './ProductSort';
import ProductFilter from './ProductFilter';
import Pagination from '../../common/Pagination';

export default function ShopLayout({
  title,
  description,
  products,
  loading,
  error,
  filterData = null,
  draftFilters,
  draftSort,
  appliedFilters,
  page,
  totalPages,
  totalCount,
  onFilterChange,
  onSortChange,
  onApplyFilters,
  onResetFilters,
  onPageChange,
  breadcrumbContext,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleApply = () => {
    onApplyFilters();
    setSidebarOpen(false);
  };

  const filterPanel = (
    <ProductFilter
      facets={filterData}
      filters={draftFilters}
      onChange={onFilterChange}
      onReset={onResetFilters}
      onApply={handleApply}
    />
  );

  return (
    <main>
      {title && (
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="container-kh py-12 sm:py-16">
            <p className="eyebrow">KhShop</p>
            <h1 className="heading-display mt-2 text-4xl sm:text-5xl">{title}</h1>
            {description && (
              <p className="mt-3 max-w-2xl text-sm text-neutral-600 sm:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="container-kh py-8 sm:py-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <ProductSort value={draftSort} options={filterData?.sort} onChange={onSortChange} count={totalCount} />
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-neutral-900 transition-all hover:border-black"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        <div>
          {error ? (
            <div className="py-20 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <p className="mt-2 text-xs text-neutral-500">Please try again later.</p>
            </div>
          ) : loading ? (
            <ProductGrid loading products={[]} />
          ) : (
            <>
              <ProductGrid products={products} cols={4} breadcrumbContext={breadcrumbContext} />
              {totalCount > 0 && (
                <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
              )}
            </>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-[95]" role="dialog" aria-modal="true" aria-label="Filters">
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in-overlay"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[320px] max-w-[88vw] flex-col bg-white shadow-2xl animate-slide-in-left">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.15em]">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-neutral-500 hover:text-black"
                aria-label="Close filters"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{filterPanel}</div>
          </div>
        </div>
      )}
    </main>
  );
}
