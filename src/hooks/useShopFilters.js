import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories } from '../data/categories';
import { uniqueSizes, uniqueBrands, productColors, priceRange } from '../data/products';

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

export default function useShopFilters(products, {
  fixedCategory = null,
  categoryOptions = null,
  categoryFilter = null,
  itemsPerPage = 12,
} = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [page, setPage] = useState(1);

  const facets = useMemo(
    () => buildFacets(fixedCategory, categoryOptions),
    [fixedCategory, categoryOptions]
  );

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
      list = list.filter((p) => filters.sizes.some((s) => p.sizes.includes(s)));
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
