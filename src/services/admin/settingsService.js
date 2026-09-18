import { createApiClient } from '../../utils/createApiClient';

const api = createApiClient();

export const settingsService = {
  async getSettings() {
    const { data } = await api.get('/v1/admin/settings');
    return data?.data || {};
  },

  async updateSettings(settings) {
    const { data } = await api.put('/v1/admin/settings', settings);
    return data?.data || {};
  },
};

export default settingsService;
