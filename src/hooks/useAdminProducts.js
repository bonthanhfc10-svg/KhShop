import { useState, useEffect, useCallback, useRef } from 'react';
import { productService } from '../services/admin/productService';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, perPage: 10, total: 0 });
  const [filters, setFilters] = useState({ search: '', category_id: '', is_active: '' });
  const abortRef = useRef(null);

  const load = useCallback(async (page = 1, perPage = 10, filterOverrides = null) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const activeFilters = filterOverrides !== null ? filterOverrides : filters;
      const params = { page, per_page: perPage };
      if (activeFilters.search) params.search = activeFilters.search;
      if (activeFilters.category_id && activeFilters.category_id !== 'all') params.category_id = activeFilters.category_id;
      if (activeFilters.is_active && activeFilters.is_active !== 'all') {
        params.is_active = activeFilters.is_active === 'active' ? '1' : '0';
      }

      const result = await productService.getAll(params, controller.signal);
      if (!controller.signal.aborted) {
        setProducts(result.items);
        setPagination(result.pagination);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err?.response?.data?.message || 'Failed to load products.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [filters]);

  useEffect(() => {
    load(1, pagination.perPage);
  }, []);

  const goToPage = useCallback((page) => {
    load(page, pagination.perPage);
  }, [load, pagination.perPage]);

  const changePerPage = useCallback((perPage) => {
    load(1, perPage);
  }, [load]);

  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    load(1, pagination.perPage, newFilters);
  }, [load, pagination.perPage]);

  const removeProduct = useCallback(async (id) => {
    await productService.delete(id);
    const remainingOnPage = products.length - 1;
    if (remainingOnPage === 0 && pagination.currentPage > 1) {
      load(pagination.currentPage - 1, pagination.perPage);
    } else {
      load(pagination.currentPage, pagination.perPage);
    }
  }, [products.length, pagination.currentPage, pagination.perPage, load]);

  return {
    products,
    loading,
    error,
    pagination,
    filters,
    reload: () => load(pagination.currentPage, pagination.perPage),
    goToPage,
    changePerPage,
    applyFilters,
    removeProduct,
  };
}
