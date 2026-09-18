import api from './api';

export const addressService = {
  async getAll() {
    const { data } = await api.get('/v1/addresses');
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/v1/addresses/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/v1/addresses', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.patch(`/v1/addresses/${id}`, payload);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/v1/addresses/${id}`);
    return data;
  },

  async setDefault(id) {
    const { data } = await api.patch(`/v1/addresses/${id}/default`);
    return data;
  },
};

export default addressService;
