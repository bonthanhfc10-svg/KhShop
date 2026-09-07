import { adminApi } from './adminApi';

export const productService = {
  async getAll() {
    const { data } = await adminApi.get('/admin/products');
    return data;
  },
  async getById(id) {
    const { data } = await adminApi.get(`/admin/products/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await adminApi.post('/admin/products', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await adminApi.put(`/admin/products/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await adminApi.delete(`/admin/products/${id}`);
    return data;
  },
};
