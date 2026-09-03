import { USE_MOCK } from '../../services/config';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const orderService = {
  async getAll() {
    if (USE_MOCK) {
      await delay();
      const { adminOrders } = await import('../data/mockData');
      return adminOrders;
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.get('/admin/orders');
    return data;
  },
  async getById(id) {
    if (USE_MOCK) {
      await delay(200);
      const { adminOrders } = await import('../data/mockData');
      return adminOrders.find((o) => o.id === id);
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.get(`/admin/orders/${id}`);
    return data;
  },
  async updateStatus(id, status) {
    if (USE_MOCK) {
      await delay(300);
      return { id, status };
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.put(`/admin/orders/${id}/status`, { status });
    return data;
  },
};
