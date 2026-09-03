import { USE_MOCK } from '../../services/config';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const reportService = {
  async getSales(period = '30days') {
    if (USE_MOCK) {
      await delay(300);
      const { adminReports } = await import('../data/mockData');
      return { data: adminReports.sales, period };
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.get('/admin/reports/sales', { params: { period } });
    return data;
  },
  async getTopProducts() {
    if (USE_MOCK) {
      await delay(300);
      const { adminReports } = await import('../data/mockData');
      return adminReports.topProducts;
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.get('/admin/reports/products');
    return data;
  },
  async getTopCustomers() {
    if (USE_MOCK) {
      await delay(300);
      const { adminReports } = await import('../data/mockData');
      return adminReports.topCustomers;
    }
    const { default: api } = await import('./adminApi');
    const { data } = await api.get('/admin/reports/customers');
    return data;
  },
};
