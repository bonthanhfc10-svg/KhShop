import { createApiClient } from '../../utils/createApiClient';

const api = createApiClient();

function extractPagination(response, key) {
  const paginator = response?.data?.[key];
  if (!paginator) return { items: [], pagination: { currentPage: 1, lastPage: 1, perPage: 10, total: 0 } };
  return {
    items: paginator.data || [],
    pagination: {
      currentPage: paginator.current_page || 1,
      lastPage: paginator.last_page || 1,
      perPage: paginator.per_page || 10,
      total: paginator.total || 0,
    },
  };
}

export const productService = {
  async getAll(params = {}, signal) {
    const { data } = await api.get('/v1/admin/product', { params, signal });
    return extractPagination(data, 'products');
  },

  async getById(id) {
    const { data } = await api.get(`/v1/admin/product/${id}`);
    return data?.data?.product || null;
  },

  async getColors(params = {}) {
    const { data } = await api.get('/v1/admin/product/colors', { params });
    return extractPagination(data, 'colors');
  },

  async getSizes(params = {}) {
    const { data } = await api.get('/v1/admin/product/sizes', { params });
    return extractPagination(data, 'sizes');
  },

  async getBrands(params = {}) {
    const { data } = await api.get('/v1/admin/product/brands', { params });
    return extractPagination(data, 'brands');
  },

  async getCategories(params = {}) {
    const { data } = await api.get('/v1/admin/product/categories', { params });
    return extractPagination(data, 'categories');
  },

  async create(productData) {
    const formData = new FormData();

    const fieldMap = {
      name: 'name',
      slug: 'slug',
      category_id: 'category_id',
      brand_id: 'brand_id',
      description: 'description',
      price: 'price',
      discount_type: 'discount_type',
      discount_value: 'discount_value',
      is_active: 'is_active',
    };

    Object.entries(fieldMap).forEach(([formKey, apiKey]) => {
      if (productData[formKey] !== undefined && productData[formKey] !== null) {
        const val = productData[formKey];
        formData.append(apiKey, typeof val === 'boolean' ? (val ? '1' : '0') : val);
      }
    });

    if (productData.variants && Array.isArray(productData.variants)) {
      productData.variants.forEach((variant, index) => {
        if (variant.color_id !== undefined) formData.append(`variants[${index}][color_id]`, variant.color_id);
        if (variant.size_id !== undefined) formData.append(`variants[${index}][size_id]`, variant.size_id);
        if (variant.sku) formData.append(`variants[${index}][sku]`, variant.sku);
        if (variant.stock !== undefined) formData.append(`variants[${index}][stock]`, variant.stock);
        if (variant.price_modifier !== undefined) formData.append(`variants[${index}][price_modifier]`, variant.price_modifier);
        if (variant.is_active !== undefined) formData.append(`variants[${index}][is_active]`, variant.is_active ? '1' : '0');
        if (variant.imageFile) {
          formData.append(`variants[${index}][image]`, variant.imageFile);
        }
      });
    }

    const { data } = await api.post('/v1/admin/product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data?.data;
  },

  async update(id, productData) {
    const formData = new FormData();
    formData.append('_method', 'PATCH');

    const fieldMap = {
      name: 'name',
      slug: 'slug',
      category_id: 'category_id',
      brand_id: 'brand_id',
      description: 'description',
      price: 'price',
      discount_type: 'discount_type',
      discount_value: 'discount_value',
      is_active: 'is_active',
    };

    Object.entries(fieldMap).forEach(([formKey, apiKey]) => {
      if (productData[formKey] !== undefined && productData[formKey] !== null) {
        const val = productData[formKey];
        formData.append(apiKey, typeof val === 'boolean' ? (val ? '1' : '0') : val);
      }
    });

    if (productData.variants && Array.isArray(productData.variants)) {
      productData.variants.forEach((variant, index) => {
        if (variant.id) formData.append(`variants[${index}][id]`, variant.id);
        if (variant.color_id !== undefined) formData.append(`variants[${index}][color_id]`, variant.color_id);
        if (variant.size_id !== undefined) formData.append(`variants[${index}][size_id]`, variant.size_id);
        if (variant.sku) formData.append(`variants[${index}][sku]`, variant.sku);
        if (variant.stock !== undefined) formData.append(`variants[${index}][stock]`, variant.stock);
        if (variant.price_modifier !== undefined) formData.append(`variants[${index}][price_modifier]`, variant.price_modifier);
        if (variant.is_active !== undefined) formData.append(`variants[${index}][is_active]`, variant.is_active ? '1' : '0');
        if (variant.imageFile) {
          formData.append(`variants[${index}][image]`, variant.imageFile);
        }
      });
    }

    const { data } = await api.post(`/v1/admin/product/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data?.data;
  },

  async delete(id) {
    const { data } = await api.delete(`/v1/admin/product/${id}`);
    return data;
  },
};

export default productService;
