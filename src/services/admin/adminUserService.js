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

export const adminUserService = {
  async getAll(params = {}, signal) {
    const { data } = await api.get('/v1/user', { params, signal });
    return extractPagination(data, 'users');
  },

  async getById(id, signal) {
    const { data } = await api.get(`/v1/user/${id}`, { signal });
    return data?.data?.user || null;
  },

  async create(payload) {
    const { data } = await api.post('/v1/user', payload);
    return data?.data?.user || null;
  },

  async update(id, payload) {
    const { data } = await api.patch(`/v1/user/${id}`, payload);
    return data?.data?.user || null;
  },

  async remove(id) {
    const { data } = await api.delete(`/v1/user/${id}`);
    return data;
  },
};

export default adminUserService;
