import api from './api';

export const authService = {
  async login(credentials) {
    const { data } = await api.post('/login', credentials);
    return data;
  },
  async register(payload) {
    const { data } = await api.post('/register', payload);
    return data;
  },
  async forgotPassword(email) {
    const { data } = await api.post('/forgot-password', { email });
    return data;
  },
  async getProfile() {
    const { data } = await api.get('/me');
    return data;
  },
  async logout() {
    const { data } = await api.post('/logout');
    return data;
  },
};

export default authService;
