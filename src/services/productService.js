import api from './api';

const PLACEHOLDER = '/images/placeholder.svg';

function mapApiProductList(raw) {
  const firstVariant = raw.variants?.[0];
  const image = firstVariant?.image?.image_path || PLACEHOLDER;

  const price = Number(raw.price) || 0;
  const salePrice = raw.sale_price != null ? Number(raw.sale_price) : null;
  const hasDiscount = salePrice != null && salePrice < price;

  const colorMap = new Map();
  for (const v of raw.variants || []) {
    if (v.color) colorMap.set(v.color.id, { name: v.color.name, hex: v.color.hex });
  }

  const sizeMap = new Map();
  for (const v of raw.variants || []) {
    if (v.size) sizeMap.set(v.size.id, { name: v.size.name });
  }

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    price: hasDiscount ? salePrice : price,
    oldPrice: hasDiscount ? price : null,
    images: [image],
    colors: [...colorMap.values()],
    sizes: [...sizeMap.values()],
    totalColors: raw.total_colors || 0,
    stock: firstVariant?.stock ?? 0,
    isNew: false,
    brand: null,
    categorySlug: null,
    categoryName: null,
    gender: null,
  };
}

function mapApiFilterData(filter) {
  if (!filter) return null;
  return {
    sizes: (filter.sizes || []).map((s) => s.name).sort(),
    colors: (filter.colors || [])
      .map((c) => ({ name: c.name, hex: c.code }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    brands: (filter.brands || []).map((b) => b.name).sort(),
    price: {
      min: Number(filter.minPrice) || 0,
      max: Number(filter.maxPrice) || 200,
    },
  };
}

export const productService = {
  async getProducts(params = {}) {
    const { data } = await api.post('/v1/product/list', params);
    const products = data?.data?.products || [];
    return products.map(mapApiProductList);
  },

  async getProduct(slug) {
    const { products } = await import('../data/products');
    return products.find((p) => p.slug === slug) || null;
  },

  async getFilters(params = {}) {
    const { data } = await api.get('/v1/product/filter', { data: params });
    const filter = data?.data?.filter || null;
    return mapApiFilterData(filter);
  },

  async getNewArrivals() {
    const { data } = await api.post('/v1/product/list', {});
    const products = data?.data?.products || [];
    return products.slice(0, 8).map(mapApiProductList);
  },

  async search(query) {
    const { data } = await api.post('/v1/product/list', { search: query });
    const products = data?.data?.products || [];
    return products.map(mapApiProductList);
  },

  async getRelated() {
    return [];
  },
};

export default productService;
