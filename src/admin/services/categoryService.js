import { USE_MOCK } from '../../services/config';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const categoryService = {
  async getAll() {
    if (USE_MOCK) {
      await delay();
      const { adminCategories } = await import('../data/mockData');
      return adminCategories;
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.get('/admin/categories');
    return data;
  },
  async create(payload) {
    if (USE_MOCK) {
      await delay(400);
      return { id: Date.now(), ...payload };
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.post('/admin/categories', payload);
    return data;
  },
  async update(id, payload) {
    if (USE_MOCK) {
      await delay(400);
      return { id, ...payload };
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.put(`/admin/categories/${id}`, payload);
    return data;
  },
  async remove(id) {
    if (USE_MOCK) {
      await delay(300);
      return { success: true };
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.delete(`/admin/categories/${id}`);
    return data;
  },
};
