import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const DEFAULT_FILTERS = {
  category: null,
  sizes: [],
  colors: [],
  price: null,
  brands: [],
  rating: null,
  availability: [],
};

function buildFacets(products) {
  const sizeSet = new Map();
  const colorSet = new Map();
  const brandSet = new Map();
  let minPrice = Infinity;
  let maxPrice = -Infinity;

  for (const p of products) {
    for (const s of p.sizes || []) {
      if (s.name) sizeSet.set(s.name, s);
    }
    for (const c of p.colors || []) {
      if (c.name) colorSet.set(c.name, c);
    }
    if (p.brand) brandSet.set(p.brand, p.brand);
    const price = Number(p.price) || 0;
    if (price > 0 && price < minPrice) minPrice = price;
    if (price > maxPrice) maxPrice = price;
  }

  return {
    sizes: [...sizeSet.values()].map((s) => s.name).sort(),
    colors: [...colorSet.values()].map((c) => ({ name: c.name, hex: c.hex })).sort((a, b) => a.name.localeCompare(b.name)),
    brands: [...brandSet.values()].sort(),
    price: {
      min: minPrice === Infinity ? 0 : minPrice,
      max: maxPrice === -Infinity ? 200 : maxPrice,
    },
  };
}

export default function useShopFilters(products, {
  fixedCategory = null,
  // eslint-disable-next-line no-unused-vars
  categoryOptions = null,
  categoryFilter = null,
  itemsPerPage = 12,
} = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [page, setPage] = useState(1);

  const facets = useMemo(() => buildFacets(products || []), [products]);

  const changeFilter = (patch) => {
    setFilters((prev) => ({
      ...prev,
      ...patch,
      category: fixedCategory || patch.category || prev.category,
    }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, category: fixedCategory || null });
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = products || [];

    if (fixedCategory) {
      list = list.filter((p) => p.categorySlug === fixedCategory || p.categoryName?.toLowerCase() === fixedCategory?.toLowerCase());
    }

    if (filters.category && !fixedCategory) {
      if (categoryFilter) {
        list = list.filter(categoryFilter(filters.category));
      } else {
        list = list.filter(
          (p) =>
            p.categorySlug?.toLowerCase() === filters.category?.toLowerCase() ||
            p.categoryName?.toLowerCase() === filters.category?.toLowerCase()
        );
      }
    }

    if (filters.sizes.length) {
      list = list.filter((p) =>
        filters.sizes.some((s) => p.sizes?.some((ps) => ps.name === s))
      );
    }

    if (filters.colors.length) {
      list = list.filter((p) =>
        filters.colors.some((c) => p.colors?.some((pc) => pc.name === c))
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
      list = list.filter((p) => (p.rating || 0) >= filters.rating);
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
    const arr = [...filtered];
    switch (sort) {
      case 'newest':
        arr.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-asc':
        arr.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        arr.sort((a, b) => b.price - a.price);
        break;
      case 'best-selling':
        arr.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      case 'featured':
      default:
        arr.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }
    return arr;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (value) => {
    setSort(value);
    setPage(1);
    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      next.set('sort', value);
      return next;
    });
  };

  return {
    facets,
    filters,
    sort,
    page: currentPage,
    totalPages,
    filteredCount: filtered.length,
    paginated,
    changeFilter,
    resetFilters,
    setSort: handleSort,
    setPage,
  };
}
