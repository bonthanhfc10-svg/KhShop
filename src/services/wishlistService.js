import api from './api';

export const wishlistService = {
  async getAll() {
    const { data } = await api.get('/v1/wishlist');
    return data;
  },

  async add(productId) {
    const { data } = await api.post('/v1/wishlist', { product_id: productId });
    return data;
  },

  async remove(wishlistId) {
    const { data } = await api.delete(`/v1/wishlist/${wishlistId}`);
    return data;
  },

  async clear() {
    const { data } = await api.delete('/v1/wishlist/clear');
    return data;
  },

  async merge(productIds) {
    const { data } = await api.post('/v1/wishlist/merge', { product_ids: productIds });
    return data;
  },
};

export default wishlistService;
