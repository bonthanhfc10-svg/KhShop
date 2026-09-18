import { createApiClient } from '../../utils/createApiClient';

const api = createApiClient();

function extractPagination(response, key) {
  const paginator = response?.data?.[key];
  if (!paginator) return { items: [], pagination: { currentPage: 1, lastPage: 1, perPage: 15, total: 0 } };
  return {
    items: paginator.data || [],
    pagination: {
      currentPage: paginator.current_page || 1,
      lastPage: paginator.last_page || 1,
      perPage: paginator.per_page || 15,
      total: paginator.total || 0,
    },
  };
}

export const customerService = {
  async getAll(params = {}, signal) {
    const { data } = await api.get('/v1/admin/customer', { params, signal });
    return extractPagination(data, 'customers');
  },

  async getById(id, signal) {
    const { data } = await api.get(`/v1/admin/customer/${id}`, { signal });
    return data?.data || null;
  },

  async updateStatus(id, isActive) {
    const { data } = await api.patch(`/v1/admin/customer/${id}/status`, { is_active: isActive });
    return data?.data?.customer || null;
  },
};

export default customerService;
