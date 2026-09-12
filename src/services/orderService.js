import api from './api';

export const orderService = {
  async createOrder(payload) {
    const { data } = await api.post('/v1/order/', payload);
    return data;
  },

  async getOrders() {
    const { data } = await api.get('/v1/order/');
    return data;
  },

  async getOrder(id) {
    const { data } = await api.get(`/v1/order/${id}`);
    return data;
  },

  async cancelOrder(id) {
    const { data } = await api.post(`/v1/order/${id}/cancel`);
    return data;
  },
};

export default orderService;
