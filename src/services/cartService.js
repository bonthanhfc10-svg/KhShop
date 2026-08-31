import api from './api';

export const cartService = {
  async getCart() {
    const { data } = await api.get('/cart');
    return data;
  },
  async addItem(item) {
    const { data } = await api.post('/cart', item);
    return data;
  },
  async updateItem(id, quantity) {
    const { data } = await api.put(`/cart/${id}`, { quantity });
    return data;
  },
  async removeItem(id) {
    const { data } = await api.delete(`/cart/${id}`);
    return data;
  },
  async clear() {
    const { data } = await api.delete('/cart');
    return data;
  },
};

export default cartService;
