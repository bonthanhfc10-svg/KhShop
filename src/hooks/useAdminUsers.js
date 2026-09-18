import { useState, useEffect, useCallback, useRef } from 'react';
import { adminUserService } from '../services/admin/adminUserService';

export function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, perPage: 15, total: 0 });
  const [filters, setFilters] = useState({ search: '', role_id: '', is_active: 'all' });
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
      if (activeFilters.role_id) params.role_id = activeFilters.role_id;
      if (activeFilters.is_active && activeFilters.is_active !== 'all') {
        params.is_active = activeFilters.is_active;
      }

      const result = await adminUserService.getAll(params, controller.signal);
      if (!controller.signal.aborted) {
        setUsers(result.items);
        setPagination(result.pagination);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err?.response?.data?.message || 'Failed to load users.');
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
    users,
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
