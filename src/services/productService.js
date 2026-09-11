import { products, getProductBySlug, searchProducts, getRelatedProducts } from '../data/products';

export const productService = {
  async getProducts(params = {}) {
    let list = [...products];

    if (params.categorySlug) {
      list = list.filter((p) => p.category === params.categorySlug);
    }
    if (params.search) {
      list = searchProducts(params.search);
    }
    if (params.sort === 'new_arrival') {
      list = list.filter((p) => p.isNew);
    }
    if (params.min_price) {
      list = list.filter((p) => p.price >= Number(params.min_price));
    }
    if (params.max_price) {
      list = list.filter((p) => p.price <= Number(params.max_price));
    }

    return list;
  },

  async getProduct(slug) {
    const p = getProductBySlug(slug);
    return p || null;
  },

  async getFilters() {
    const sizeSet = new Map();
    const colorSet = new Map();
    const brandSet = new Map();
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    for (const p of products) {
      for (const s of p.sizes || []) sizeSet.set(s, s);
      for (const c of p.colors || []) {
        if (c.name && c.hex) colorSet.set(c.name, { name: c.name, hex: c.hex });
      }
      if (p.brand) brandSet.set(p.brand, p.brand);
      if (p.price < minPrice) minPrice = p.price;
      if (p.price > maxPrice) maxPrice = p.price;
    }

    return {
      sizes: [...sizeSet.values()].sort(),
      colors: [...colorSet.values()].sort((a, b) => a.name.localeCompare(b.name)),
      brands: [...brandSet.values()].sort(),
      minPrice,
      maxPrice,
    };
  },

  async getNewArrivals() {
    return products.filter((p) => p.isNew).slice(0, 8);
  },

  async search(query) {
    return searchProducts(query);
  },

  async getRelated(productSlug) {
    const product = getProductBySlug(productSlug);
    if (!product) return [];
    return getRelatedProducts(product, 4);
  },
};

export default productService;
