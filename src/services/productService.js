import api from './api';
import { colorCodeToHex } from '../utils/colorMap';

const PLACEHOLDER = '/images/placeholder.svg';

export function mapApiProductList(raw) {
  const firstVariant = raw.variants?.[0];
  const image = firstVariant?.image?.image_path || PLACEHOLDER;

  const price = Number(raw.price) || 0;
  const salePrice = raw.sale_price != null ? Number(raw.sale_price) : null;
  const hasDiscount = salePrice != null && salePrice < price;

  const colorMap = new Map();
  for (const v of raw.variants || []) {
    if (v.color) colorMap.set(v.color.id, { name: v.color.name, hex: colorCodeToHex(v.color.code) });
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
    sizes: (filter.sizes || []).map((s) => ({ id: s.id, name: s.name })).sort((a, b) => a.name.localeCompare(b.name)),
    colors: (filter.colors || [])
      .map((c) => ({ id: c.id, name: c.name, code: c.code, hex: colorCodeToHex(c.code) }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    brands: (filter.brands || []).map((b) => ({ id: b.id, name: b.name, slug: b.slug })).sort((a, b) => a.name.localeCompare(b.name)),
    price: {
      min: Number(filter.minPrice) || 0,
      max: Number(filter.maxPrice) || 200,
    },
    sort: (filter.sort || []).map((s) => ({ id: s.id, name: s.name, slug: s.slug })),
  };
}

export const productService = {
  async getProducts(params = {}) {
    const { data } = await api.post('/v1/product/list', params);
    const raw = data?.data || {};
    const products = (raw.products || []).map(mapApiProductList);
    return {
      products,
      page: raw.currentPage || 1,
      totalPages: raw.totalPages || 1,
      totalCount: raw.totalCount || products.length,
    };
  },

  async getProduct(slug) {
    try {
      const { data } = await api.get(`/v1/product/${slug}`);
      const raw = data;
      if (!raw) return null;

      const colors = (raw.colors || []).map((c) => ({
        id: c.id,
        name: c.name,
        hex: c.hex || null,
        image: c.images?.[0]?.image_path || PLACEHOLDER,
        images: (c.images || []).map((img) => img.image_path),
        sizes: (c.sizes || []).map((s) => ({
          id: s.id,
          variant_id: s.variant_id,
          name: s.name,
          stock: s.stock ?? 0,
        })),
      }));

      const stock = colors.reduce(
        (sum, c) => sum + c.sizes.reduce((s, sz) => s + sz.stock, 0),
        0
      );

      return {
        id: raw.id,
        name: raw.name,
        slug: raw.slug,
        description: raw.description || null,
        price: Number(raw.price) || 0,
        oldPrice: raw.sale_price != null ? Number(raw.sale_price) : null,
        colors,
        stock,
        reviews: 0,
      };
    } catch (err) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  },

  async getFilters(params = {}) {
    const { data } = await api.post('/v1/product/filter', params);
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
