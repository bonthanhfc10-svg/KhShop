import { useState, useCallback, useEffect, useRef } from 'react';

const DEFAULT_FILTERS = {
  sizes: [],
  colors: [],
  brands: [],
  price: null,
};

export default function useShopFilters({
  menuSlug = null,
  categorySlug = null,
  search = null,
} = {}) {
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [draftSort, setDraftSort] = useState(null);

  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [appliedSort, setAppliedSort] = useState(null);
  const [page, setPage] = useState(1);

  const slugContextRef = useRef(`${menuSlug ?? ''}|${categorySlug ?? ''}`);

  useEffect(() => {
    const key = `${menuSlug ?? ''}|${categorySlug ?? ''}`;
    if (slugContextRef.current !== key) {
      slugContextRef.current = key;
      setDraftFilters(DEFAULT_FILTERS);
      setDraftSort(null);
      setAppliedFilters(DEFAULT_FILTERS);
      setAppliedSort(null);
      setPage(1);
    }
  }, [menuSlug, categorySlug]);

  const changeDraftFilter = useCallback((patch) => {
    setDraftFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const changeDraftSort = useCallback((value) => {
    setDraftSort(value);
    setAppliedSort(value);
    setPage(1);
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedFilters({ ...draftFilters });
    setAppliedSort(draftSort);
    setPage(1);
  }, [draftFilters, draftSort]);

  const resetFilters = useCallback(() => {
    setDraftFilters(DEFAULT_FILTERS);
    setDraftSort(null);
    setAppliedFilters(DEFAULT_FILTERS);
    setAppliedSort(null);
    setPage(1);
  }, []);

  const buildRequestParams = useCallback(() => {
    const params = {};
    if (menuSlug) params.menuSlug = menuSlug;
    if (categorySlug) params.selectedCategories = [categorySlug];
    if (search) params.search = search;
    if (appliedFilters.sizes.length) params.selectedSizes = appliedFilters.sizes;
    if (appliedFilters.colors.length) params.selectedColors = appliedFilters.colors;
    if (appliedFilters.brands.length) params.selectedBrands = appliedFilters.brands;
    if (appliedFilters.price) {
      if (appliedFilters.price.min > 0) params.min_price = appliedFilters.price.min;
      if (appliedFilters.price.max < 200) params.max_price = appliedFilters.price.max;
    }
    if (appliedSort) params.sort = appliedSort;
    if (page > 1) params.page = page;
    return params;
  }, [menuSlug, categorySlug, search, appliedFilters, appliedSort, page]);

  const hasActiveFilters =
    appliedFilters.sizes.length > 0 ||
    appliedFilters.colors.length > 0 ||
    appliedFilters.brands.length > 0 ||
    appliedFilters.price != null ||
    appliedSort != null;

  return {
    draftFilters,
    draftSort,
    appliedFilters,
    appliedSort,
    page,
    hasActiveFilters,
    changeDraftFilter,
    changeDraftSort,
    applyFilters,
    resetFilters,
    setPage,
    buildRequestParams,
  };
}
