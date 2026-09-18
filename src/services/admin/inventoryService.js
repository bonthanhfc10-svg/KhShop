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

export const inventoryService = {
  async getAll(params = {}, signal) {
    const { data } = await api.get('/v1/admin/inventory', { params, signal });
    return extractPagination(data, 'inventory');
  },

  async getLowStock(params = {}, signal) {
    const { data } = await api.get('/v1/admin/inventory/low-stock', { params, signal });
    return extractPagination(data, 'inventory');
  },

  async updateStock(id, stock) {
    const { data } = await api.patch(`/v1/admin/inventory/${id}/stock`, { stock });
    return data?.data?.variant || null;
  },
};

export default inventoryService;
