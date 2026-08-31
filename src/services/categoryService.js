import api from './api';

export const categoryService = {
  async getCategories() {
    const { data } = await api.get('/categories');
    return Array.isArray(data) ? data : (data.data ?? []);
  },
  async getCategory(slug) {
    const { data } = await api.get(`/categories/${slug}`);
    return data;
  },
  async getCategoryProducts(slug, params = {}) {
    const { data } = await api.get(`/categories/${slug}/products`, { params });
    return Array.isArray(data) ? data : (data.data ?? []);
  },
};

export default categoryService;
