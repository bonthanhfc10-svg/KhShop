import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductGrid from './ProductGrid';
import ProductSort from './ProductSort';
import ProductFilter from './ProductFilter';
import Pagination from '../common/Pagination';
import {
  categories,
} from '../../data/categories';
import {
  uniqueSizes,
  uniqueBrands,
  productColors,
  priceRange,
} from '../../data/products';

const DEFAULT_FILTERS = {
  category: null,
  sizes: [],
  colors: [],
  price: null,
  brands: [],
  rating: null,
  availability: [],
};

function buildFacets(fixedCategory = null, categoryOptions = null) {
  const facade = fixedCategory
    ? categories.filter((c) => c.slug === fixedCategory)
    : categories;
  return {
    categories: categoryOptions || facade.map((c) => c.name),
    sizes: uniqueSizes(),
    colors: productColors(),
    brands: uniqueBrands(),
    price: priceRange(),
  };
}

export default function ShopLayout({
  title,
  description,
  products,
  loading,
  fixedCategory = null,
  itemsPerPage = 12,
  hideHeader = false,
  categoryOptions = null,
  categoryFilter = null,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const facets = useMemo(
    () => buildFacets(fixedCategory, categoryOptions),
    [fixedCategory, categoryOptions]
  );

  const changeFilter = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch, category: fixedCategory || patch.category || prev.category }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, category: fixedCategory || null });
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = products;
    if (fixedCategory) {
      list = list.filter((p) => p.category === fixedCategory);
    }
    if (filters.category && !fixedCategory) {
      if (categoryFilter) {
        list = list.filter(categoryFilter(filters.category));
      } else {
        const cat = categories.find((c) => c.name === filters.category);
        if (cat) list = list.filter((p) => p.category === cat.slug);
      }
    }
    if (filters.sizes.length) {
      list = list.filter((p) =>
        filters.sizes.some((s) => p.sizes.includes(s))
      );
    }
    if (filters.colors.length) {
      list = list.filter((p) =>
        filters.colors.some((c) => p.colors.some((pc) => pc.name === c))
      );
    }
    if (filters.price) {
      list = list.filter(
        (p) => p.price >= filters.price.min && p.price <= filters.price.max
      );
    }
    if (filters.brands.length) {
      list = list.filter((p) => filters.brands.includes(p.brand));
    }
    if (filters.rating) {
      list = list.filter((p) => p.rating >= filters.rating);
    }
    if (filters.availability.length) {
      const hasInStock = filters.availability.includes('In Stock');
      const hasOutOfStock = filters.availability.includes('Out of Stock');
      list = list.filter((p) => {
        const inStock = p.stock > 0;
        if (inStock) return hasInStock;
        return hasOutOfStock;
      });
    }
    return list;
  }, [products, filters, fixedCategory, categoryFilter]);

  const sorted = useMemo(() => {
    const inputGender = searchParams.get('gender');
    let list = filtered;
    if (inputGender === 'men' || inputGender === 'women') {
      list = list.filter((p) => p.gender === inputGender);
    }
    const arr = [...list];
    switch (sort) {
      case 'newest':
        arr.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case 'price-asc':
        arr.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        arr.sort((a, b) => b.price - a.price);
        break;
      case 'best-selling':
        arr.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'featured':
      default:
        arr.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
    }
    return arr;
  }, [filtered, sort, searchParams]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (value) => {
    setSort(value);
    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      next.set('sort', value);
      return next;
    });
  };

  const filterPanel = (
    <ProductFilter
      facets={facets}
      filters={filters}
      onChange={changeFilter}
      onReset={resetFilters}
      onApply={() => setSidebarOpen(false)}
    />
  );

  return (
    <main>
      {/* Page header */}
      {!hideHeader && (
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
        {/* Toolbar */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <ProductSort value={sort} onChange={handleSort} count={filtered.length} />
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-neutral-900 transition-all hover:border-black"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {/* Grid */}
        <div>
          {loading ? (
            <ProductGrid loading products={[]} />
          ) : (
            <>
              <ProductGrid products={paginated} cols={4} />
              {sorted.length > 0 && (
                <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Sidebar filter - desktop and mobile */}
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
