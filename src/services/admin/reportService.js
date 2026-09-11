import { mockAdminOrders, mockAdminCustomers, mockSalesData, mockSalesChart, mockTopProducts, mockTopCustomers } from '../../data/adminMock';

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export const reportService = {
  async getSalesData(period = '7days') {
    await delay();
    return mockSalesData[period] || mockSalesData['7days'];
  },

  async getSalesChart(period = '7D') {
    await delay();
    return mockSalesChart[period] || mockSalesChart['7D'];
  },

  async getTopProducts() {
    await delay();
    return mockTopProducts;
  },

  async getTopCustomers() {
    await delay();
    return mockTopCustomers;
  },

  async getDashboardStats() {
    await delay();
    const activeCustomers = mockAdminCustomers.filter((c) => c.status === 'Active').length;
    const activeOrders = mockAdminOrders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
    return {
      ...mockSalesData.today,
      totalCustomers: mockAdminCustomers.length,
      activeCustomers,
      activeOrders,
      conversionRate: 3.2,
    };
  },

  async getOrdersSummary() {
    await delay();
    const counts = { total: mockAdminOrders.length };
    for (const o of mockAdminOrders) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return counts;
  },
};

export default reportService;
