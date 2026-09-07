import { adminApi } from './adminApi';

export const orderService = {
  async getAll() {
    const { data } = await adminApi.get('/admin/orders');
    return data;
  },
  async getById(id) {
    const { data } = await adminApi.get(`/admin/orders/${id}`);
    return data;
  },
  async updateStatus(id, status) {
    const { data } = await adminApi.put(`/admin/orders/${id}/status`, { status });
    return data;
  },
};
