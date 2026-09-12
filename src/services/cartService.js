import api from './api';

export const cartService = {
  async getCart() {
    const { data } = await api.get('/v1/cart');
    return data;
  },

  async addItem(item) {
    const { data } = await api.post('/v1/cart', item);
    return data;
  },

  async updateItem(id, quantity) {
    const { data } = await api.patch(`/v1/cart/${id}`, { qty: quantity });
    return data;
  },

  async removeItem(id) {
    const { data } = await api.delete(`/v1/cart/${id}`);
    return data;
  },

  async clear() {
    const { data } = await api.delete('/v1/cart');
    return data;
  },

  async merge(items) {
    const { data } = await api.post('/v1/cart/merge', { items });
    return data;
  },
};

export default cartService;
