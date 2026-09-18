import { createApiClient } from '../../utils/createApiClient';

const api = createApiClient();

export const adminAccountService = {
  async getProfile() {
    const { data } = await api.get('/v1/profile');
    return data?.data || null;
  },

  async updateProfile(payload) {
    const { data } = await api.put('/v1/profile', payload);
    return data?.data || null;
  },

  async changePassword(payload) {
    const { data } = await api.post('/v1/profile/change-password', payload);
    return data;
  },
};

export default adminAccountService;
