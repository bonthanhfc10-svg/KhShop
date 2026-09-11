import { mockAdminOrders } from '../../data/adminMock';

let _orders = [...mockAdminOrders];

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export const orderService = {
  async getAll(params = {}) {
    await delay();
    let list = [..._orders];

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q)
      );
    }
    if (params.status) {
      list = list.filter((o) => o.status === params.status);
    }

    return list;
  },

  async getById(id) {
    await delay();
    const order = _orders.find((o) => o.id === id);
    if (!order) return null;

    const { products } = await import('../../data/products');
    return {
      ...order,
      items: order.items
        ? order.items.map((item) => {
            const product = products.find((p) => p.id === item.id) || products[0];
            return { ...item, name: product.name, image: product.images?.[0] };
          })
        : [],
      timeline: [
        { label: 'Order Placed', date: order.date, done: true },
        { label: 'Processing', date: order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? order.date : null, done: order.status !== 'Pending' },
        { label: 'Shipped', date: order.status === 'Shipped' || order.status === 'Delivered' ? order.date : null, done: order.status === 'Shipped' || order.status === 'Delivered' },
        { label: 'Delivered', date: order.status === 'Delivered' ? order.date : null, done: order.status === 'Delivered' },
      ],
    };
  },

  async updateStatus(id, status) {
    await delay();
    const order = _orders.find((o) => o.id === id);
    if (!order) throw new Error('Order not found');
    order.status = status;
    return order;
  },
};

export default orderService;
