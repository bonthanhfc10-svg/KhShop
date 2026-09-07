import { adminApi } from './adminApi';

export const inventoryService = {
  async getAll() {
    const { data } = await adminApi.get('/admin/inventory');
    return data;
  },
  async adjust(productId, quantity, reason) {
    const { data } = await adminApi.post('/admin/inventory/adjust', { productId, quantity, reason });
    return data;
  },
};
