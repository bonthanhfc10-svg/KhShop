import { mockAdminProducts } from '../../data/adminMock';

let _products = [...mockAdminProducts];
let _nextId = _products.length + 1;

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export const productService = {
  async getAll(params = {}) {
    await delay();
    let list = [..._products];

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (params.status) {
      list = list.filter((p) => p.status === params.status);
    }

    return list;
  },

  async getById(id) {
    await delay();
    return _products.find((p) => p.id === Number(id)) || null;
  },

  async create(productData) {
    await delay();
    const newProduct = { ...productData, id: _nextId++, slug: productData.name.toLowerCase().replace(/\s+/g, '-') };
    _products.push(newProduct);
    return newProduct;
  },

  async update(id, productData) {
    await delay();
    const idx = _products.findIndex((p) => p.id === Number(id));
    if (idx === -1) throw new Error('Product not found');
    _products[idx] = { ..._products[idx], ...productData };
    return _products[idx];
  },

  async delete(id) {
    await delay();
    const idx = _products.findIndex((p) => p.id === Number(id));
    if (idx === -1) throw new Error('Product not found');
    _products.splice(idx, 1);
    return true;
  },

  async bulkDelete(ids) {
    await delay();
    _products = _products.filter((p) => !ids.includes(p.id));
    return true;
  },
};

export default productService;
