import { products as storefrontProducts } from '../../data/products';

export const adminProducts = storefrontProducts.slice(0, 20).map((p, i) => {
  const stock = [24, 18, 0, 35, 12, 28, 45, 0, 15, 50, 8, 30][i % 12];
  const sizes =
    p.category === 'shoes'
      ? ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
      : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: `KHS-${p.category.toUpperCase().slice(0, 3)}-${String(p.id).padStart(3, '0')}`,
    description: p.description,
    category: p.category,
    categoryName: p.categoryName,
    brand: p.brand,
    price: p.price,
    salePrice: p.oldPrice || null,
    stock,
    lowStockAlert: 10,
    status: stock > 0 ? 'active' : 'draft',
    featured: p.isBestSeller || false,
    newArrival: p.isNew || false,
    bestSeller: p.isBestSeller || false,
    image: p.images[0],
    gallery: p.images,
    colors: (p.colors || []).map((c, ci) => ({
      id: `${p.id}-${ci}`,
      name: c.name,
      sku: `KHS-${p.category.toUpperCase().slice(0, 3)}-${String(p.id).padStart(3, '0')}-${ci + 1}`,
      price: p.price,
      stock: Math.max(0, stock - ci * 2),
      image: c.images[0],
      gallery: c.images,
    })),
    sizes,
    sold: [245, 189, 152, 138, 121, 97, 86, 74, 128, 110, 92, 68, 55, 141, 87, 63, 49, 42, 76, 58][i] || 0,
    revenue: [19500, 15120, 9850, 7580, 6450, 5210, 4210, 3320, 5840, 4920, 3890, 2740, 2150, 6120, 3640, 2580, 1880, 1590, 2990, 2240][i] || 0,
    createdAt: new Date(2026, i % 8, (i * 2) % 28 + 1).toISOString(),
  };
});

export const adminCategories = [
  { id: 1, name: 'Men', slug: 'men', parent: null, products: 45, status: 'active', image: '/images/categories/shoes.svg' },
  { id: 2, name: 'Women', slug: 'women', parent: null, products: 52, status: 'active', image: '/images/categories/clothing.svg' },
  { id: 3, name: 'Kids', slug: 'kids', parent: null, products: 38, status: 'active', image: '/images/categories/accessories.svg' },
  { id: 4, name: 'Sport', slug: 'sport', parent: null, products: 27, status: 'active', image: '/images/categories/sport.svg' },
  { id: 5, name: 'Sale', slug: 'sale', parent: null, products: 61, status: 'active', image: '/images/categories/sport.svg' },
  { id: 6, name: 'Shoes', slug: 'shoes', parent: 1, products: 18, status: 'active' },
  { id: 7, name: 'Clothing', slug: 'clothing', parent: 1, products: 15, status: 'active' },
  { id: 8, name: 'Accessories', slug: 'accessories', parent: 1, products: 12, status: 'active' },
  { id: 9, name: 'Shoes', slug: 'shoes', parent: 2, products: 22, status: 'active' },
  { id: 10, name: 'Clothing', slug: 'clothing', parent: 2, products: 19, status: 'active' },
  { id: 11, name: 'Running', slug: 'running', parent: 4, products: 9, status: 'active' },
  { id: 12, name: 'Football', slug: 'football', parent: 4, products: 8, status: 'active' },
  { id: 13, name: 'Girl Shoes', slug: 'girl-shoes', parent: 3, products: 14, status: 'active' },
  { id: 14, name: 'Boy Clothing', slug: 'boy-clothing', parent: 3, products: 11, status: 'active' },
  { id: 15, name: 'Women', slug: 'sale-women', parent: 5, products: 24, status: 'active' },
  { id: 16, name: 'Men', slug: 'sale-men', parent: 5, products: 20, status: 'active' },
];

export const adminCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 555 010 1000', orders: 12, totalSpent: 1458.0, status: 'active', joined: '2024-01-15', avatar: null },
  { id: 2, name: 'Sarah Miller', email: 'sarah@example.com', phone: '+1 555 010 1001', orders: 9, totalSpent: 1230.5, status: 'active', joined: '2024-02-20', avatar: null },
  { id: 3, name: 'Mike Chen', email: 'mike@example.com', phone: '+1 555 010 1002', orders: 5, totalSpent: 540.0, status: 'active', joined: '2024-03-05', avatar: null },
  { id: 4, name: 'Emma Wilson', email: 'emma@example.com', phone: '+1 555 010 1003', orders: 18, totalSpent: 2430.75, status: 'active', joined: '2023-11-02', avatar: null },
  { id: 5, name: 'James Lee', email: 'james@example.com', phone: '+1 555 010 1004', orders: 3, totalSpent: 210.5, status: 'inactive', joined: '2024-05-18', avatar: null },
  { id: 6, name: 'Lisa Park', email: 'lisa@example.com', phone: '+1 555 010 1005', orders: 7, totalSpent: 890.0, status: 'active', joined: '2024-01-30', avatar: null },
  { id: 7, name: 'Tom Brown', email: 'tom@example.com', phone: '+1 555 010 1006', orders: 11, totalSpent: 1350.25, status: 'active', joined: '2023-09-14', avatar: null },
  { id: 8, name: 'Anna Kim', email: 'anna@example.com', phone: '+1 555 010 1007', orders: 2, totalSpent: 145.0, status: 'inactive', joined: '2024-06-22', avatar: null },
  { id: 9, name: 'David Garcia', email: 'david@example.com', phone: '+1 555 010 1008', orders: 8, totalSpent: 1120.0, status: 'active', joined: '2024-02-11', avatar: null },
  { id: 10, name: 'Rachel Adams', email: 'rachel@example.com', phone: '+1 555 010 1009', orders: 15, totalSpent: 2100.0, status: 'active', joined: '2023-07-08', avatar: null },
];

export const adminOrders = [
  { id: 'KH-10001', customer: 'John Doe', email: 'john@example.com', date: '2026-09-03T10:30:00', items: 3, total: 129.99, payment: 'Paid', status: 'Completed', paymentMethod: 'Credit Card' },
  { id: 'KH-10002', customer: 'Sarah Miller', email: 'sarah@example.com', date: '2026-09-03T09:15:00', items: 1, total: 89.99, payment: 'Paid', status: 'Processing', paymentMethod: 'PayPal' },
  { id: 'KH-10003', customer: 'Mike Chen', email: 'mike@example.com', date: '2026-09-02T16:45:00', items: 5, total: 219.5, payment: 'Pending', status: 'Pending', paymentMethod: 'Cash on Delivery' },
  { id: 'KH-10004', customer: 'Emma Wilson', email: 'emma@example.com', date: '2026-09-02T14:00:00', items: 2, total: 158.0, payment: 'Paid', status: 'Shipped', paymentMethod: 'Credit Card' },
  { id: 'KH-10005', customer: 'James Lee', email: 'james@example.com', date: '2026-09-01T11:30:00', items: 1, total: 54.99, payment: 'Paid', status: 'Delivered', paymentMethod: 'Debit Card' },
  { id: 'KH-10006', customer: 'Lisa Park', email: 'lisa@example.com', date: '2026-09-01T09:00:00', items: 4, total: 189.75, payment: 'Paid', status: 'Completed', paymentMethod: 'Credit Card' },
  { id: 'KH-10007', customer: 'Tom Brown', email: 'tom@example.com', date: '2026-08-31T17:20:00', items: 2, total: 145.0, payment: 'Refunded', status: 'Cancelled', paymentMethod: 'PayPal' },
  { id: 'KH-10008', customer: 'Anna Kim', email: 'anna@example.com', date: '2026-08-31T13:10:00', items: 1, total: 79.99, payment: 'Paid', status: 'Delivered', paymentMethod: 'Credit Card' },
  { id: 'KH-10009', customer: 'David Garcia', email: 'david@example.com', date: '2026-08-30T15:40:00', items: 3, total: 167.0, payment: 'Paid', status: 'Completed', paymentMethod: 'Debit Card' },
  { id: 'KH-10010', customer: 'Rachel Adams', email: 'rachel@example.com', date: '2026-08-30T10:25:00', items: 6, total: 312.5, payment: 'Pending', status: 'Processing', paymentMethod: 'Bank Transfer' },
  { id: 'KH-10011', customer: 'John Doe', email: 'john@example.com', date: '2026-08-29T12:00:00', items: 2, total: 98.5, payment: 'Paid', status: 'Delivered', paymentMethod: 'Credit Card' },
  { id: 'KH-10012', customer: 'Sarah Miller', email: 'sarah@example.com', date: '2026-08-29T08:45:00', items: 1, total: 120.0, payment: 'Paid', status: 'Completed', paymentMethod: 'PayPal' },
  { id: 'KH-10013', customer: 'Emma Wilson', email: 'emma@example.com', date: '2026-08-28T16:30:00', items: 3, total: 210.0, payment: 'Paid', status: 'Delivered', paymentMethod: 'Credit Card' },
  { id: 'KH-10014', customer: 'Tom Brown', email: 'tom@example.com', date: '2026-08-28T11:15:00', items: 2, total: 136.0, payment: 'Paid', status: 'Completed', paymentMethod: 'Debit Card' },
  { id: 'KH-10015', customer: 'Rachel Adams', email: 'rachel@example.com', date: '2026-08-27T14:50:00', items: 4, total: 245.0, payment: 'Paid', status: 'Delivered', paymentMethod: 'Credit Card' },
];

export const adminInventory = adminProducts.map((p) => ({
  id: p.id,
  product: p.name,
  sku: p.sku,
  category: p.categoryName,
  color: p.colors[0]?.name || 'Black',
  size: p.category === 'shoes' ? '40' : 'M',
  stock: p.stock,
  reserved: Math.max(0, Math.floor(p.stock * 0.2)),
  available: Math.max(0, p.stock - Math.floor(p.stock * 0.2)),
  status: p.stock === 0 ? 'Out of Stock' : p.stock <= 10 ? 'Low Stock' : 'In Stock',
}));

export const adminReports = {
  sales: {
    revenue: 24580.0,
    orders: 1248,
    avgOrderValue: 19.7,
    customers: 5432,
    trend: [
      { label: 'Jan', revenue: 18500, orders: 210 },
      { label: 'Feb', revenue: 19200, orders: 225 },
      { label: 'Mar', revenue: 21800, orders: 260 },
      { label: 'Apr', revenue: 20100, orders: 240 },
      { label: 'May', revenue: 22500, orders: 275 },
      { label: 'Jun', revenue: 24200, orders: 298 },
      { label: 'Jul', revenue: 23100, orders: 285 },
      { label: 'Aug', revenue: 24580, orders: 342 },
    ],
  },
  topProducts: storefrontProducts.slice(0, 5).map((p, i) => ({
    ...p,
    sold: [245, 189, 152, 138, 121][i],
    revenue: [19500, 15120, 9850, 7580, 6450][i],
  })),
  topCustomers: adminCustomers.slice(0, 5),
};

export const adminSettings = {
  store: {
    name: 'KHShop',
    email: 'admin@khshop.com',
    phone: '+1 555 010 0000',
    address: '221 Springfield Lane, Denver, CO 80210',
  },
  general: {
    currency: 'USD',
    timezone: 'UTC-7',
    tax: '8.25',
  },
  payment: {
    methods: ['Credit Card', 'PayPal', 'Cash on Delivery', 'Bank Transfer'],
  },
  shipping: {
    methods: ['Standard', 'Express'],
    fee: 5.99,
    freeShippingThreshold: 75,
  },
};
