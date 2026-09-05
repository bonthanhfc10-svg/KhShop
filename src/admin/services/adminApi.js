import axios from 'axios';
import { storage } from '../../utils/storage';

export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

adminApi.interceptors.request.use((config) => {
  const token = storage.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      storage.remove('token');
      if (error.config?.url !== '/v1/auth/login') {
        window.dispatchEvent(new CustomEvent('auth:401'));
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;
