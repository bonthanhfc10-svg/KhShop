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

export const orderService = {
  async getAll(params = {}, signal) {
    const { data } = await api.get('/v1/admin/order', { params, signal });
    return extractPagination(data, 'orders');
  },

  async getById(id, signal) {
    const { data } = await api.get(`/v1/admin/order/${id}`, { signal });
    return data?.data?.order || null;
  },

  async updateStatus(id, status) {
    const { data } = await api.patch(`/v1/admin/order/${id}/status`, { status });
    return data?.data?.order || null;
  },

  async cancel(id) {
    const { data } = await api.patch(`/v1/admin/order/${id}/cancel`);
    return data?.data?.order || null;
  },
};

export default orderService;
