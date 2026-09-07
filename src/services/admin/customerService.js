import { adminApi } from './adminApi';

export const customerService = {
  async getAll() {
    const { data } = await adminApi.get('/admin/customers');
    return data;
  },
  async getById(id) {
    const { data } = await adminApi.get(`/admin/customers/${id}`);
    return data;
  },
};
