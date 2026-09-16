import { createApiClient } from '../../utils/createApiClient';

const api = createApiClient();

export const supplierService = {
  async getAll(params = {}) {
    const { data } = await api.get('/v1/admin/supplier', { params });
    return data?.data?.suppliers || [];
  },

  async getById(id) {
    const { data } = await api.get(`/v1/admin/supplier/${id}`);
    return data?.data?.supplier || null;
  },

  async create(supplierData) {
    const { data } = await api.post('/v1/admin/supplier', supplierData);
    return data?.data?.supplier;
  },

  async update(id, supplierData) {
    const { data } = await api.patch(`/v1/admin/supplier/${id}`, supplierData);
    return data?.data?.supplier;
  },

  async delete(id) {
    const { data } = await api.delete(`/v1/admin/supplier/${id}`);
    return data;
  },
};

export default supplierService;
