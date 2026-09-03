import { USE_MOCK } from '../../services/config';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const inventoryService = {
  async getAll() {
    if (USE_MOCK) {
      await delay();
      const { adminInventory } = await import('../data/mockData');
      return adminInventory;
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.get('/admin/inventory');
    return data;
  },
  async adjust(productId, quantity, reason) {
    if (USE_MOCK) {
      await delay(300);
      return { productId, quantity, reason, success: true };
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.post('/admin/inventory/adjust', { productId, quantity, reason });
    return data;
  },
};
