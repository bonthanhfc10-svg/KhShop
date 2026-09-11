import { mockAdminCategories } from '../../data/adminMock';

let _categories = JSON.parse(JSON.stringify(mockAdminCategories));
let _nextId = 100;

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export const categoryService = {
  async getAll() {
    await delay();
    return _categories;
  },

  async getById(id) {
    await delay();
    for (const cat of _categories) {
      if (cat.id === Number(id)) return cat;
      if (cat.children) {
        const child = cat.children.find((c) => c.id === Number(id));
        if (child) return child;
      }
    }
    return null;
  },

  async create(categoryData) {
    await delay();
    const newCategory = {
      id: _nextId++,
      ...categoryData,
      slug: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      status: categoryData.status || 'Active',
      products: 0,
      children: [],
    };
    _categories.push(newCategory);
    return newCategory;
  },

  async update(id, categoryData) {
    await delay();
    for (let i = 0; i < _categories.length; i++) {
      if (_categories[i].id === Number(id)) {
        _categories[i] = { ..._categories[i], ...categoryData };
        return _categories[i];
      }
      if (_categories[i].children) {
        for (let j = 0; j < _categories[i].children.length; j++) {
          if (_categories[i].children[j].id === Number(id)) {
            _categories[i].children[j] = { ..._categories[i].children[j], ...categoryData };
            return _categories[i].children[j];
          }
        }
      }
    }
    throw new Error('Category not found');
  },

  async delete(id) {
    await delay();
    const idx = _categories.findIndex((c) => c.id === Number(id));
    if (idx !== -1) {
      _categories.splice(idx, 1);
      return true;
    }
    for (const cat of _categories) {
      if (cat.children) {
        const childIdx = cat.children.findIndex((c) => c.id === Number(id));
        if (childIdx !== -1) {
          cat.children.splice(childIdx, 1);
          return true;
        }
      }
    }
    throw new Error('Category not found');
  },
};

export default categoryService;
