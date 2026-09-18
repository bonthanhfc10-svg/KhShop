import { useState, useEffect, useCallback, useRef } from 'react';
import { orderService } from '../services/admin/orderService';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, perPage: 15, total: 0 });
  const [filters, setFilters] = useState({ search: '', status: 'all', payment_status: 'all', order_type: 'all' });
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
      if (activeFilters.status && activeFilters.status !== 'all') params.status = activeFilters.status;
      if (activeFilters.payment_status && activeFilters.payment_status !== 'all') params.payment_status = activeFilters.payment_status;
      if (activeFilters.order_type && activeFilters.order_type !== 'all') params.order_type = activeFilters.order_type;

      const result = await orderService.getAll(params, controller.signal);
      if (!controller.signal.aborted) {
        setOrders(result.items);
        setPagination(result.pagination);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err?.response?.data?.message || 'Failed to load orders.');
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

  return {
    orders,
    loading,
    error,
    pagination,
    filters,
    reload: () => load(pagination.currentPage, pagination.perPage),
    goToPage,
    changePerPage,
    applyFilters,
  };
}
