import { adminApi } from './adminApi';

export const categoryService = {
  async getAll() {
    const { data } = await adminApi.get('/admin/categories');
    return data;
  },
  async create(payload) {
    const { data } = await adminApi.post('/admin/categories', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await adminApi.put(`/admin/categories/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await adminApi.delete(`/admin/categories/${id}`);
    return data;
  },
};
