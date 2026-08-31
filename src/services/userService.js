import api from './api';

export const userService = {
  async updateProfile(payload) {
    const { data } = await api.put('/me', payload);
    return data;
  },
  async getAddresses() {
    const { data } = await api.get('/addresses');
    return Array.isArray(data) ? data : (data.data ?? []);
  },
  async createAddress(payload) {
    const { data } = await api.post('/addresses', payload);
    return data;
  },
  async updateAddress(id, payload) {
    const { data } = await api.put(`/addresses/${id}`, payload);
    return data;
  },
  async deleteAddress(id) {
    const { data } = await api.delete(`/addresses/${id}`);
    return data;
  },
};

export default userService;
