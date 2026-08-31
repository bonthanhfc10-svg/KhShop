import { products } from './products';

const p = (id) => {
  const found = products.find((x) => x.id === id);
  return found || products[0];
};

const mkItem = (id, quantity, size, color) => {
  const product = p(id);
  return {
    id: product.id,
    name: product.name,
    image: product.images[0],
    price: product.price,
    quantity,
    size,
    color,
  };
};

export const orders = [
  {
    id: 'KH-204918',
    date: '2026-08-18T10:30:00',
    status: 'Delivered',
    items: [
      mkItem(1, 1, '9', 'Black'),
      mkItem(12, 1, 'M', 'Grey'),
    ],
    shipping: 0,
    address: {
      firstName: 'Alex',
      lastName: 'Johnson',
      address: '221 Springfield Lane',
      city: 'Denver',
      postalCode: '80210',
      country: 'United States',
      phone: '+1 555 010 2030',
    },
    payment: { method: 'Credit / Debit Card', cardLast4: '4242' },
    timeline: [
      { label: 'Order Placed', date: '2026-08-18T10:30:00', done: true },
      { label: 'Processing', date: '2026-08-18T14:00:00', done: true },
      { label: 'Shipped', date: '2026-08-19T09:00:00', done: true },
      { label: 'Delivered', date: '2026-08-22T12:00:00', done: true },
    ],
  },
  {
    id: 'KH-203477',
    date: '2026-07-02T15:45:00',
    status: 'Shipped',
    items: [mkItem(7, 2, 'L', 'Black')],
    shipping: 5.99,
    address: {
      firstName: 'Alex',
      lastName: 'Johnson',
      address: '221 Springfield Lane',
      city: 'Denver',
      postalCode: '80210',
      country: 'United States',
      phone: '+1 555 010 2030',
    },
    payment: { method: 'PayPal' },
    timeline: [
      { label: 'Order Placed', date: '2026-07-02T15:45:00', done: true },
      { label: 'Processing', date: '2026-07-03T10:00:00', done: true },
      { label: 'Shipped', date: '2026-07-04T08:00:00', done: true },
      { label: 'Delivered', date: null, done: false },
    ],
  },
  {
    id: 'KH-202156',
    date: '2026-05-11T09:20:00',
    status: 'Pending',
    items: [mkItem(3, 1, '10', 'Red')],
    shipping: 0,
    address: {
      firstName: 'Alex',
      lastName: 'Johnson',
      address: '221 Springfield Lane',
      city: 'Denver',
      postalCode: '80210',
      country: 'United States',
      phone: '+1 555 010 2030',
    },
    payment: { method: 'Cash on Delivery' },
    timeline: [
      { label: 'Order Placed', date: '2026-05-11T09:20:00', done: true },
      { label: 'Processing', date: null, done: false },
      { label: 'Shipped', date: null, done: false },
      { label: 'Delivered', date: null, done: false },
    ],
  },
];

export const getOrderById = (id) => orders.find((o) => o.id === id);

export default orders;
