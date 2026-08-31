import api from './api';

export const orderService = {
  async createOrder(payload) {
    const { data } = await api.post('/orders', payload);
    return data;
  },
  async getOrders() {
    const { data } = await api.get('/orders');
    return Array.isArray(data) ? data : (data.data ?? []);
  },
  async getOrder(id) {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
  async cancelOrder(id) {
    const { data } = await api.post(`/orders/${id}/cancel`);
    return data;
  },
};

export default orderService;
