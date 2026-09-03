import { USE_MOCK } from '../../services/config';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const customerService = {
  async getAll() {
    if (USE_MOCK) {
      await delay();
      const { adminCustomers } = await import('../data/mockData');
      return adminCustomers;
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.get('/admin/customers');
    return data;
  },
  async getById(id) {
    if (USE_MOCK) {
      await delay(200);
      const { adminCustomers } = await import('../data/mockData');
      return adminCustomers.find((c) => c.id === Number(id));
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.get(`/admin/customers/${id}`);
    return data;
  },
};
