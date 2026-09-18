import { createApiClient } from '../../utils/createApiClient';

const api = createApiClient();

export const collectionService = {
  async getAll(params = {}) {
    const { data } = await api.get('/v1/admin/collection', { params });
    return data?.data?.collections || [];
  },

  async getById(id) {
    const { data } = await api.get(`/v1/admin/collection/${id}`);
    return data?.data?.collection || null;
  },

  async create(collectionData) {
    const formData = new FormData();
    formData.append('name', collectionData.name);
    if (collectionData.description) formData.append('description', collectionData.description);
    if (collectionData.imageFile) formData.append('image', collectionData.imageFile);
    formData.append('is_active', collectionData.is_active ? '1' : '0');
    formData.append('sort_order', collectionData.sort_order ?? 0);

    const { data } = await api.post('/v1/admin/collection', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data?.data?.collection;
  },

  async update(id, collectionData) {
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    if (collectionData.name) formData.append('name', collectionData.name);
    if (collectionData.description !== undefined) formData.append('description', collectionData.description || '');
    if (collectionData.imageFile) formData.append('image', collectionData.imageFile);
    if (collectionData.is_active !== undefined) formData.append('is_active', collectionData.is_active ? '1' : '0');
    if (collectionData.sort_order !== undefined) formData.append('sort_order', collectionData.sort_order);

    const { data } = await api.post(`/v1/admin/collection/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data?.data?.collection;
  },

  async delete(id) {
    const { data } = await api.delete(`/v1/admin/collection/${id}`);
    return data;
  },

  async updateStatus(id, isActive) {
    const { data } = await api.patch(`/v1/admin/collection/${id}/status`, { is_active: isActive });
    return data?.data?.collection;
  },

  async assignProducts(id, productIds) {
    const { data } = await api.post(`/v1/admin/collection/${id}/products`, { product_ids: productIds });
    return data?.data?.collection;
  },

  async removeProduct(id, productId) {
    const { data } = await api.delete(`/v1/admin/collection/${id}/products/${productId}`);
    return data?.data?.collection;
  },
};

export default collectionService;
