import axios from 'axios';
import { storage } from './storage';

export function createApiClient(baseURL) {
  const client = axios.create({
    baseURL: baseURL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  client.interceptors.request.use((config) => {
    const token = storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
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

  return client;
}
