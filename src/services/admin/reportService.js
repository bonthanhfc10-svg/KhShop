import { createApiClient } from '../../utils/createApiClient';

const api = createApiClient();

export const reportService = {
  async getSalesData(period = '7days') {
    const { data } = await api.get(`/v1/admin/sale-report/data/${period}`);
    return data?.data || { revenue: 0, orders: 0, avgOrder: 0, customers: 0 };
  },

  async getSalesChart(period = '7D') {
    const { data } = await api.get(`/v1/admin/sale-report/chart/${period}`);
    return data?.data || [];
  },

  async getTopProducts() {
    const { data } = await api.get('/v1/admin/sale-report/top-products');
    return data?.data || [];
  },

  async getTopCustomers() {
    const { data } = await api.get('/v1/admin/sale-report/top-customers');
    return data?.data || { summary: {}, customers: [] };
  },

  async getDashboardStats() {
    const salesData = await this.getSalesData('today');
    return {
      ...salesData,
      totalCustomers: 0,
      activeCustomers: 0,
      activeOrders: 0,
      conversionRate: 0,
    };
  },

  async getOrdersSummary() {
    return { total: 0 };
  },
};

export default reportService;
