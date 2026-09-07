import { adminApi } from './adminApi';

export const reportService = {
  async getSales(period = '30days') {
    const { data } = await adminApi.get('/admin/reports/sales', { params: { period } });
    return data;
  },
  async getTopProducts() {
    const { data } = await adminApi.get('/admin/reports/products');
    return data;
  },
  async getTopCustomers() {
    const { data } = await adminApi.get('/admin/reports/customers');
    return data;
  },
};
