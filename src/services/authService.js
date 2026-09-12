import api from './api';

export const authService = {
  async login({ email, password }) {
    const { data } = await api.post('/v1/auth/login', { email, password });
    return data;
  },

  async register({ name, email, password, password_confirm }) {
    const { data } = await api.post('/v1/auth/register', {
      name,
      email,
      password,
      password_confirm,
    });
    return data;
  },

  async logout() {
    const { data } = await api.post('/v1/auth/logout');
    return data;
  },

  async verifyEmail({ email, otp }) {
    const { data } = await api.post('/v1/auth/email/verify', { email, otp });
    return data;
  },

  async resendVerificationOtp(email) {
    const { data } = await api.post('/v1/auth/email/resend-otp', { email });
    return data;
  },

  async forgotPassword(email) {
    const { data } = await api.post('/v1/auth/password/forgot', { email });
    return data;
  },

  async verifyResetOtp({ email, otp }) {
    const { data } = await api.post('/v1/auth/password/verify-otp', {
      email,
      otp,
    });
    return data;
  },

  async resetPassword({ email, otp, password, password_confirm }) {
    const { data } = await api.post('/v1/auth/password/reset', {
      email,
      otp,
      password,
      password_confirm,
    });
    return data;
  },

  async resendResetOtp(email) {
    const { data } = await api.post('/v1/auth/password/resend-otp', { email });
    return data;
  },

  async getProfile() {
    const { data } = await api.get('/v1/profile');
    return data;
  },
};

export default authService;
