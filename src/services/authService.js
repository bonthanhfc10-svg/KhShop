import api from './api';

export const authService = {
  async login(credentials) {
    const { data } = await api.post('/v1/auth/login', credentials);
    return data;
  },
  async register(payload) {
    const { data } = await api.post('/v1/auth/register', payload);
    return data;
  },
  async forgotPassword(email) {
    const { data } = await api.post('/v1/auth/password/forgot', { email });
    return data;
  },
  async verifyEmail(payload) {
    const { data } = await api.post('/v1/auth/email/verify', payload);
    return data;
  },
  async resendVerificationOtp(email) {
    const { data } = await api.post('/v1/auth/email/resend-otp', { email });
    return data;
  },
  async verifyResetOtp(payload) {
    const { data } = await api.post('/v1/auth/password/verify-otp', payload);
    return data;
  },
  async resendResetOtp(email) {
    const { data } = await api.post('/v1/auth/password/resend-otp', { email });
    return data;
  },
  async resetPassword(payload) {
    const { data } = await api.post('/v1/auth/password/reset', payload);
    return data;
  },
  async getProfile() {
    const { data } = await api.get('/v1/profile');
    return data;
  },
  async logout() {
    const { data } = await api.post('/v1/auth/logout');
    return data;
  },
};

export default authService;
