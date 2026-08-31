import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const { data } = await api.get('/products', { params });
    return Array.isArray(data) ? data : (data.data ?? []);
  },
  async getProduct(slugOrId) {
    const { data } = await api.get(`/products/${slugOrId}`);
    return data;
  },
  async getFeatured() {
    const { data } = await api.get('/products/featured');
    return Array.isArray(data) ? data : (data.data ?? []);
  },
  async getNewArrivals() {
    const { data } = await api.get('/products/new-arrivals');
    return Array.isArray(data) ? data : (data.data ?? []);
  },
  async getRelated(productId) {
    const { data } = await api.get(`/products/${productId}/related`);
    return Array.isArray(data) ? data : (data.data ?? []);
  },
  async search(query) {
    const { data } = await api.get('/products/search', { params: { q: query } });
    return Array.isArray(data) ? data : (data.data ?? []);
  },
};

export default productService;
