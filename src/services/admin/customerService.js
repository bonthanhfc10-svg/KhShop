import { mockAdminCustomers } from '../../data/adminMock';

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export const customerService = {
  async getAll(params = {}) {
    await delay();
    let list = [...mockAdminCustomers];

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }
    if (params.status) {
      list = list.filter((c) => c.status === params.status);
    }

    return list;
  },

  async getById(id) {
    await delay();
    return mockAdminCustomers.find((c) => c.id === Number(id)) || null;
  },

  async getOrders(customerId) {
    await delay();
    const { mockAdminOrders } = await import('../../data/adminMock');
    const customer = mockAdminCustomers.find((c) => c.id === Number(customerId));
    if (!customer) return [];
    return mockAdminOrders.filter((o) => o.email === customer.email);
  },

  async updateStatus(id, status) {
    await delay();
    const customer = mockAdminCustomers.find((c) => c.id === Number(id));
    if (!customer) throw new Error('Customer not found');
    customer.status = status;
    return customer;
  },
};

export default customerService;
