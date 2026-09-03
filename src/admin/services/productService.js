import { USE_MOCK } from '../../services/config';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const productService = {
  async getAll() {
    if (USE_MOCK) {
      await delay();
      const { adminProducts } = await import('../data/mockData');
      return adminProducts;
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.get('/admin/products');
    return data;
  },
  async getById(id) {
    if (USE_MOCK) {
      await delay(200);
      const { adminProducts } = await import('../data/mockData');
      return adminProducts.find((p) => p.id === Number(id));
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.get(`/admin/products/${id}`);
    return data;
  },
  async create(payload) {
    if (USE_MOCK) {
      await delay(600);
      return { id: Date.now(), ...payload };
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.post('/admin/products', payload);
    return data;
  },
  async update(id, payload) {
    if (USE_MOCK) {
      await delay(600);
      return { id, ...payload };
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.put(`/admin/products/${id}`, payload);
    return data;
  },
  async remove(id) {
    if (USE_MOCK) {
      await delay(400);
      return { success: true };
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.delete(`/admin/products/${id}`);
    return data;
  },
};
