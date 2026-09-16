import { createApiClient } from '../../utils/createApiClient';

const api = createApiClient();

export const categoryService = {
  async getAll(params = {}) {
    const { data } = await api.get('/v1/category', { params });
    return data?.data?.categories || [];
  },

  async getById(id) {
    const { data } = await api.get(`/v1/category/${id}`);
    return data?.data?.category || null;
  },

  async create(categoryData) {
    const formData = new FormData();
    if (categoryData.name) formData.append('name', categoryData.name);
    if (categoryData.description) formData.append('description', categoryData.description);
    if (categoryData.parent_id) formData.append('parent_id', categoryData.parent_id);
    if (categoryData.imageFile) formData.append('image_path', categoryData.imageFile);

    const { data } = await api.post('/v1/category', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data?.data?.category;
  },

  async update(id, categoryData) {
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    if (categoryData.name) formData.append('name', categoryData.name);
    if (categoryData.description !== undefined) formData.append('description', categoryData.description);
    if (categoryData.is_active !== undefined) formData.append('is_active', categoryData.is_active ? '1' : '0');
    if (categoryData.parent_id !== undefined) formData.append('parent_id', categoryData.parent_id ?? '');
    if (categoryData.imageFile) formData.append('image_path', categoryData.imageFile);

    const { data } = await api.post(`/v1/category/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data?.data?.category;
  },

  async delete(id) {
    const { data } = await api.delete(`/v1/category/${id}`);
    return data;
  },
};

export default categoryService;
