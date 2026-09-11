import { mockAdminInventory } from '../../data/adminMock';

let _inventory = [...mockAdminInventory];
let _nextId = _inventory.length + 1;

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export const inventoryService = {
  async getAll(params = {}) {
    await delay();
    let list = [..._inventory];

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.product.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q)
      );
    }
    if (params.status) {
      list = list.filter((i) => i.status === params.status);
    }
    if (params.category) {
      list = list.filter((i) => i.category === params.category);
    }

    return list;
  },

  async getLowStock() {
    await delay();
    return _inventory.filter((i) => i.stock <= 10);
  },

  async updateStock(id, stock) {
    await delay();
    const item = _inventory.find((i) => i.id === Number(id));
    if (!item) throw new Error('Inventory item not found');
    item.stock = stock;
    item.status = stock === 0 ? 'Out of Stock' : stock <= 10 ? 'Low Stock' : 'In Stock';
    return item;
  },
};

export default inventoryService;
