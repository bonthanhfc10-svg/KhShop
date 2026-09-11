import api from './api';

export const homeService = {
  async getHome() {
    const { data } = await api.get('/v1/home');
    return data;
  },
};

export default homeService;
