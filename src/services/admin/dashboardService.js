import { createApiClient } from '../../utils/createApiClient';

const api = createApiClient();

export const dashboardService = {
  async getDashboard() {
    const { data } = await api.get('/v1/admin/dashboard');
    return data?.data || {};
  },
};
