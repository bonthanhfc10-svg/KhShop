import { useState, useEffect, useCallback, useRef } from 'react';
import { inventoryService } from '../services/admin/inventoryService';

export function useInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, perPage: 15, total: 0 });
  const [filters, setFilters] = useState({ search: '', status: '' });
  const abortRef = useRef(null);

  const load = useCallback(async (page = 1, perPage = 15, filterOverrides = null) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const activeFilters = filterOverrides !== null ? filterOverrides : filters;
      const params = { page, per_page: perPage };
      if (activeFilters.search) params.search = activeFilters.search;
      if (activeFilters.status && activeFilters.status !== 'all') {
        params.status = activeFilters.status;
      }

      const result = await inventoryService.getAll(params, controller.signal);
      if (!controller.signal.aborted) {
        setItems(result.items);
        setPagination(result.pagination);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err?.response?.data?.message || 'Failed to load inventory.');
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

  const updateStock = useCallback(async (id, stock) => {
    const updated = await inventoryService.updateStock(id, stock);
    if (updated) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item
        )
      );
    }
    return updated;
  }, []);

  return {
    items,
    loading,
    error,
    pagination,
    filters,
    reload: () => load(pagination.currentPage, pagination.perPage),
    goToPage,
    changePerPage,
    applyFilters,
    updateStock,
  };
}

export function useLowStock() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, perPage: 15, total: 0 });
  const [filters, setFilters] = useState({ search: '' });
  const abortRef = useRef(null);

  const load = useCallback(async (page = 1, perPage = 15, filterOverrides = null) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const activeFilters = filterOverrides !== null ? filterOverrides : filters;
      const params = { page, per_page: perPage };
      if (activeFilters.search) params.search = activeFilters.search;

      const result = await inventoryService.getLowStock(params, controller.signal);
      if (!controller.signal.aborted) {
        setItems(result.items);
        setPagination(result.pagination);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err?.response?.data?.message || 'Failed to load low stock items.');
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

  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    load(1, pagination.perPage, newFilters);
  }, [load, pagination.perPage]);

  return {
    items,
    loading,
    error,
    pagination,
    filters,
    reload: () => load(pagination.currentPage, pagination.perPage),
    goToPage,
    applyFilters,
  };
}
