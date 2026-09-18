import { createApiClient } from '../../utils/createApiClient';

const api = createApiClient();

export const bannerService = {
  async getAll(params = {}) {
    const { data } = await api.get('/v1/admin/banner', { params });
    return data?.data?.banners || [];
  },

  async getById(id) {
    const { data } = await api.get(`/v1/admin/banner/${id}`);
    return data?.data?.banner || null;
  },

  async create(bannerData) {
    const formData = new FormData();
    formData.append('title', bannerData.title);
    if (bannerData.description) formData.append('description', bannerData.description);
    if (bannerData.imageFile) formData.append('image', bannerData.imageFile);
    if (bannerData.menu_id) formData.append('menu_id', bannerData.menu_id);
    formData.append('is_active', bannerData.is_active ? '1' : '0');

    const { data } = await api.post('/v1/admin/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data?.data?.banner;
  },

  async update(id, bannerData) {
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    if (bannerData.title) formData.append('title', bannerData.title);
    if (bannerData.description !== undefined) formData.append('description', bannerData.description || '');
    if (bannerData.imageFile) formData.append('image', bannerData.imageFile);
    if (bannerData.menu_id !== undefined) formData.append('menu_id', bannerData.menu_id || '');
    if (bannerData.is_active !== undefined) formData.append('is_active', bannerData.is_active ? '1' : '0');

    const { data } = await api.post(`/v1/admin/banner/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data?.data?.banner;
  },

  async delete(id) {
    const { data } = await api.delete(`/v1/admin/banner/${id}`);
    return data;
  },

  async updateStatus(id, isActive) {
    const { data } = await api.patch(`/v1/admin/banner/${id}/status`, { is_active: isActive });
    return data?.data?.banner;
  },
};

export default bannerService;
