export const mockAdminProducts = [
  { id: 1, name: 'Kh Runner Pro', slug: 'kh-runner-pro', sku: 'KHS-SHO-001', category: 'shoes', categoryName: 'Shoes', price: 79.99, salePrice: 63.99, stock: 24, status: 'Active', featured: true, newArrival: true, bestSeller: true, images: ['/images/products/shoe-black.svg'], brand: 'KhShop', description: 'Engineered for everyday comfort.' },
  { id: 2, name: 'Stride Court Sneaker', slug: 'stride-court-sneaker', sku: 'KHS-SHO-002', category: 'shoes', categoryName: 'Shoes', price: 64.99, salePrice: null, stock: 32, status: 'Active', featured: false, newArrival: true, bestSeller: false, images: ['/images/products/shoe-white.svg'], brand: 'KhShop', description: 'Clean, minimal court silhouette.' },
  { id: 3, name: 'Velocity Track Runner', slug: 'velocity-track-runner', sku: 'KHS-SPO-001', category: 'sport', categoryName: 'Sport', price: 89.99, salePrice: 67.49, stock: 18, status: 'Active', featured: true, newArrival: false, bestSeller: true, images: ['/images/products/shoe-red.svg'], brand: 'KhShop', description: 'Built for speed.' },
  { id: 4, name: 'Urban Street Low', slug: 'urban-street-low', sku: 'KHS-SHO-004', category: 'shoes', categoryName: 'Shoes', price: 54.99, salePrice: null, stock: 41, status: 'Active', featured: false, newArrival: false, bestSeller: false, images: ['/images/products/shoe-grey.svg'], brand: 'KhShop', description: 'Everyday street style.' },
  { id: 5, name: 'Apex Court Classic', slug: 'apex-court-classic', sku: 'KHS-SHO-005', category: 'shoes', categoryName: 'Shoes', price: 74.99, salePrice: 62.99, stock: 27, status: 'Active', featured: false, newArrival: false, bestSeller: false, images: ['/images/products/shoe-blue.svg'], brand: 'KhShop', description: 'Modern take on classic court shoe.' },
  { id: 6, name: 'Breeze Runner', slug: 'breeze-runner', sku: 'KHS-SPO-002', category: 'sport', categoryName: 'Sport', price: 69.99, salePrice: null, stock: 15, status: 'Active', featured: false, newArrival: false, bestSeller: true, images: ['/images/products/shoe-black.svg'], brand: 'KhShop', description: 'Lightweight running shoe.' },
  { id: 7, name: 'Classic Polo', slug: 'classic-polo', sku: 'KHS-CLO-001', category: 'clothing', categoryName: 'Clothing', price: 34.99, salePrice: null, stock: 56, status: 'Active', featured: false, newArrival: false, bestSeller: false, images: ['/images/products/shoe-white.svg'], brand: 'KhShop', description: 'Classic fit polo shirt.' },
  { id: 8, name: 'Performance Tee', slug: 'performance-tee', sku: 'KHS-CLO-002', category: 'clothing', categoryName: 'Clothing', price: 24.99, salePrice: 19.99, stock: 8, status: 'Active', featured: false, newArrival: true, bestSeller: false, images: ['/images/products/shoe-grey.svg'], brand: 'KhShop', description: 'Moisture-wicking performance tee.' },
  { id: 9, name: 'Kh Sport Bag', slug: 'kh-sport-bag', sku: 'KHS-ACC-001', category: 'accessories', categoryName: 'Accessories', price: 44.99, salePrice: null, stock: 0, status: 'Active', featured: false, newArrival: false, bestSeller: false, images: ['/images/products/shoe-black.svg'], brand: 'KhShop', description: 'Durable sport bag.' },
  { id: 10, name: 'Urban Jogger', slug: 'urban-jogger', sku: 'KHS-CLO-003', category: 'clothing', categoryName: 'Clothing', price: 49.99, salePrice: 39.99, stock: 3, status: 'Active', featured: false, newArrival: false, bestSeller: true, images: ['/images/products/shoe-grey.svg'], brand: 'KhShop', description: 'Comfortable urban jogger pants.' },
];

export const mockAdminCategories = [
  { id: 1, name: 'Men', slug: 'men', description: 'Men collection', status: 'Active', products: 45, children: [
    { id: 11, name: 'Men Shoes', slug: 'men-shoes', status: 'Active', products: 20 },
    { id: 12, name: 'Men Clothing', slug: 'men-clothing', status: 'Active', products: 15 },
    { id: 13, name: 'Men Accessories', slug: 'men-accessories', status: 'Active', products: 10 },
  ]},
  { id: 2, name: 'Women', slug: 'women', description: 'Women collection', status: 'Active', products: 38, children: [
    { id: 21, name: 'Women Shoes', slug: 'women-shoes', status: 'Active', products: 18 },
    { id: 22, name: 'Women Clothing', slug: 'women-clothing', status: 'Active', products: 12 },
    { id: 23, name: 'Women Accessories', slug: 'women-accessories', status: 'Active', products: 8 },
  ]},
  { id: 3, name: 'Kids', slug: 'kids', description: 'Kids collection', status: 'Active', products: 25, children: [
    { id: 31, name: 'Boy Shoes', slug: 'boy-shoes', status: 'Active', products: 10 },
    { id: 32, name: 'Girl Shoes', slug: 'girl-shoes', status: 'Active', products: 10 },
    { id: 33, name: 'Kids Clothing', slug: 'kids-clothing', status: 'Active', products: 5 },
  ]},
  { id: 4, name: 'Sport', slug: 'sport', description: 'Sport collection', status: 'Active', products: 30, children: [] },
];

export const mockAdminOrders = [
  { id: 'KH-204918', customer: 'Alex Johnson', email: 'alex@example.com', date: '2026-08-18T10:30:00', status: 'Delivered', items: 2, total: 143.98, payment: 'Credit Card', address: '221 Springfield Lane, Denver, CO 80210' },
  { id: 'KH-203477', customer: 'Sara Miller', email: 'sara@example.com', date: '2026-07-02T15:45:00', status: 'Shipped', items: 1, total: 75.98, payment: 'PayPal', address: '456 Oak Ave, Austin, TX 78701' },
  { id: 'KH-202156', customer: 'Mike Chen', email: 'mike@example.com', date: '2026-05-11T09:20:00', status: 'Pending', items: 1, total: 89.99, payment: 'Cash on Delivery', address: '789 Pine St, Seattle, WA 98101' },
  { id: 'KH-205123', customer: 'Emily Davis', email: 'emily@example.com', date: '2026-09-01T14:00:00', status: 'Processing', items: 3, total: 199.97, payment: 'Credit Card', address: '321 Elm St, Portland, OR 97201' },
  { id: 'KH-205456', customer: 'James Wilson', email: 'james@example.com', date: '2026-09-05T08:15:00', status: 'Pending', items: 1, total: 54.99, payment: 'Bank Transfer', address: '654 Maple Dr, Chicago, IL 60601' },
  { id: 'KH-205789', customer: 'Lisa Brown', email: 'lisa@example.com', date: '2026-09-08T11:30:00', status: 'Delivered', items: 2, total: 129.98, payment: 'Credit Card', address: '987 Cedar Ln, Miami, FL 33101' },
  { id: 'KH-206012', customer: 'Tom Anderson', email: 'tom@example.com', date: '2026-09-09T16:45:00', status: 'Processing', items: 4, total: 289.96, payment: 'PayPal', address: '147 Birch Rd, Boston, MA 02101' },
  { id: 'KH-206345', customer: 'Anna Lee', email: 'anna@example.com', date: '2026-09-10T09:00:00', status: 'Pending', items: 1, total: 79.99, payment: 'Cash on Delivery', address: '258 Walnut St, San Francisco, CA 94102' },
];

export const mockAdminCustomers = [
  { id: 1, name: 'Alex Johnson', email: 'alex@example.com', phone: '+1 555 010 2030', status: 'Active', joined: '2025-01-15', orders: 5, totalSpent: 489.95, address: '221 Springfield Lane, Denver, CO 80210' },
  { id: 2, name: 'Sara Miller', email: 'sara@example.com', phone: '+1 555 020 3040', status: 'Active', joined: '2025-03-22', orders: 3, totalSpent: 245.97, address: '456 Oak Ave, Austin, TX 78701' },
  { id: 3, name: 'Mike Chen', email: 'mike@example.com', phone: '+1 555 030 4050', status: 'Active', joined: '2025-06-10', orders: 8, totalSpent: 712.92, address: '789 Pine St, Seattle, WA 98101' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '+1 555 040 5060', status: 'Active', joined: '2025-08-05', orders: 2, totalSpent: 154.98, address: '321 Elm St, Portland, OR 97201' },
  { id: 5, name: 'James Wilson', email: 'james@example.com', phone: '+1 555 050 6070', status: 'Inactive', joined: '2025-09-12', orders: 1, totalSpent: 54.99, address: '654 Maple Dr, Chicago, IL 60601' },
  { id: 6, name: 'Lisa Brown', email: 'lisa@example.com', phone: '+1 555 060 7080', status: 'Active', joined: '2025-11-20', orders: 6, totalSpent: 567.94, address: '987 Cedar Ln, Miami, FL 33101' },
];

export const mockAdminInventory = [
  { id: 1, product: 'Kh Runner Pro', sku: 'KHS-SHO-001', category: 'Shoes', color: 'Black', size: '9', stock: 24, status: 'In Stock', productId: 1 },
  { id: 2, product: 'Kh Runner Pro', sku: 'KHS-SHO-001', category: 'Shoes', color: 'White', size: '10', stock: 18, status: 'In Stock', productId: 1 },
  { id: 3, product: 'Stride Court Sneaker', sku: 'KHS-SHO-002', category: 'Shoes', color: 'White', size: '7', stock: 32, status: 'In Stock', productId: 2 },
  { id: 4, product: 'Velocity Track Runner', sku: 'KHS-SPO-001', category: 'Sport', color: 'Red', size: '10', stock: 18, status: 'In Stock', productId: 3 },
  { id: 5, product: 'Urban Street Low', sku: 'KHS-SHO-004', category: 'Shoes', color: 'Grey', size: '8', stock: 41, status: 'In Stock', productId: 4 },
  { id: 6, product: 'Apex Court Classic', sku: 'KHS-SHO-005', category: 'Shoes', color: 'Blue', size: '7', stock: 27, status: 'In Stock', productId: 5 },
  { id: 7, product: 'Breeze Runner', sku: 'KHS-SPO-002', category: 'Sport', color: 'Black', size: '9', stock: 8, status: 'Low Stock', productId: 6 },
  { id: 8, product: 'Classic Polo', sku: 'KHS-CLO-001', category: 'Clothing', color: 'White', size: 'M', stock: 56, status: 'In Stock', productId: 7 },
  { id: 9, product: 'Performance Tee', sku: 'KHS-CLO-002', category: 'Clothing', color: 'Grey', size: 'L', stock: 8, status: 'Low Stock', productId: 8 },
  { id: 10, product: 'Kh Sport Bag', sku: 'KHS-ACC-001', category: 'Accessories', color: 'Black', size: 'One Size', stock: 0, status: 'Out of Stock', productId: 9 },
  { id: 11, product: 'Urban Jogger', sku: 'KHS-CLO-003', category: 'Clothing', color: 'Grey', size: 'M', stock: 3, status: 'Low Stock', productId: 10 },
  { id: 12, product: 'Urban Jogger', sku: 'KHS-CLO-003', category: 'Clothing', color: 'Black', size: 'L', stock: 12, status: 'In Stock', productId: 10 },
];

export const mockSalesData = {
  today: { revenue: 1249.95, orders: 8, avgOrder: 156.24, customers: 6 },
  '7days': { revenue: 8749.65, orders: 52, avgOrder: 168.26, customers: 38 },
  '30days': { revenue: 34892.50, orders: 208, avgOrder: 167.75, customers: 145 },
  year: { revenue: 412890.00, orders: 2456, avgOrder: 168.11, customers: 1280 },
};

export const mockSalesChart = {
  '7D': [
    { date: 'Mon', sales: 1200, orders: 8 },
    { date: 'Tue', sales: 1800, orders: 12 },
    { date: 'Wed', sales: 1500, orders: 10 },
    { date: 'Thu', sales: 2200, orders: 14 },
    { date: 'Fri', sales: 1900, orders: 11 },
    { date: 'Sat', sales: 2800, orders: 18 },
    { date: 'Sun', sales: 1600, orders: 9 },
  ],
  '30D': Array.from({ length: 30 }, (_, i) => ({
    date: `Sep ${i + 1}`,
    sales: Math.floor(Math.random() * 3000) + 800,
    orders: Math.floor(Math.random() * 20) + 5,
  })),
  '3M': ['Jul', 'Aug', 'Sep'].map((m) => ({
    date: m,
    sales: Math.floor(Math.random() * 40000) + 20000,
    orders: Math.floor(Math.random() * 200) + 100,
  })),
  '1Y': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => ({
    date: m,
    sales: Math.floor(Math.random() * 60000) + 20000,
    orders: Math.floor(Math.random() * 350) + 150,
  })),
};

export const mockTopProducts = [
  { id: 3, name: 'Velocity Track Runner', category: 'Sport', sold: 201, revenue: 18087.99, image: '/images/products/shoe-red.svg' },
  { id: 1, name: 'Kh Runner Pro', category: 'Shoes', sold: 128, revenue: 10238.72, image: '/images/products/shoe-black.svg' },
  { id: 7, name: 'Classic Polo', category: 'Clothing', sold: 95, revenue: 3324.05, image: '/images/products/shoe-white.svg' },
  { id: 2, name: 'Stride Court Sneaker', category: 'Shoes', sold: 89, revenue: 5784.11, image: '/images/products/shoe-white.svg' },
  { id: 10, name: 'Urban Jogger', category: 'Clothing', sold: 76, revenue: 3799.24, image: '/images/products/shoe-grey.svg' },
];

export const mockTopCustomers = [
  { id: 3, name: 'Mike Chen', email: 'mike@example.com', orders: 8, totalSpent: 712.92, joined: '2025-06-10' },
  { id: 6, name: 'Lisa Brown', email: 'lisa@example.com', orders: 6, totalSpent: 567.94, joined: '2025-11-20' },
  { id: 1, name: 'Alex Johnson', email: 'alex@example.com', orders: 5, totalSpent: 489.95, joined: '2025-01-15' },
  { id: 2, name: 'Sara Miller', email: 'sara@example.com', orders: 3, totalSpent: 245.97, joined: '2025-03-22' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', orders: 2, totalSpent: 154.98, joined: '2025-08-05' },
];
