import { categories } from '../data/categories';

export const categoryService = {
  async getCategories() {
    return categories;
  },

  async getCategory(slug) {
    return categories.find((c) => c.slug === slug) || null;
  },

  async getCategoryProducts(slug, params = {}) {
    const { products } = await import('../data/products');
    let list = products.filter((p) => p.category === slug);
    return list;
  },
};

export default categoryService;
