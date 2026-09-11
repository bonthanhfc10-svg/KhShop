import api from './api';

const CATEGORY_ROUTE_MAP = {
  shoes: 'shoes',
  clothing: 'clothing',
  accessories: 'accessories',
  sport: 'sport',
  running: 'running',
  football: 'football',
  training: 'training',
  volleyball: 'volleyball',
  'girl-shoes': 'girl-shoes',
  'boy-shoes': 'boy-shoes',
  'boy-clothing': 'boy-clothing',
  'girl-clothing': 'girl-clothing',
};

function buildCategoryPath(parentSlug, childSlug) {
  const prefix = parentSlug + '-';
  let category = childSlug.startsWith(prefix)
    ? childSlug.slice(prefix.length)
    : childSlug;
  category = category.replace(/^-+/, '');
  const mapped = CATEGORY_ROUTE_MAP[category] || category;
  return `/shop/${parentSlug}/${mapped}`;
}

export const menuService = {
  async getMenu() {
    const { data } = await api.get('/v1/category/menu');
    const menus = data?.data?.menus || [];

    const apiNav = menus.map((menu) => ({
      name: menu.name,
      slug: menu.slug,
      path: `/shop/${menu.slug}`,
      featureTitle: `Shop ${menu.name}`,
      categories: (menu.children || []).map((child) => ({
        name: child.name,
        path: buildCategoryPath(menu.slug, child.slug),
      })),
    }));

    const hasSale = apiNav.some((m) => m.slug === 'sale');
    if (!hasSale) {
      apiNav.push({
        name: 'Sale',
        slug: 'sale',
        path: '/shop/sale',
        featureTitle: 'Shop Sale',
        isSale: true,
        categories: [
          { name: 'Women', path: '/shop/sale/women' },
          { name: 'Men', path: '/shop/sale/men' },
          { name: 'Boy Kids', path: '/shop/sale/boy-kids' },
          { name: 'Girl Kids', path: '/shop/sale/girl-kids' },
          { name: 'Men Sport', path: '/shop/sale/men-sport' },
          { name: 'Women Sport', path: '/shop/sale/women-sport' },
        ],
      });
    }

    return apiNav;
  },
};

export default menuService;
