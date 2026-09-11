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
  return `/products/${parentSlug}/${mapped}`;
}

const SALE_FALLBACK_CATEGORIES = [
  { name: 'Women', path: '/products/sale/women' },
  { name: 'Men', path: '/products/sale/men' },
  { name: 'Boy Kids', path: '/products/sale/boy-kids' },
  { name: 'Girl Kids', path: '/products/sale/girl-kids' },
  { name: 'Men Sport', path: '/products/sale/men-sport' },
  { name: 'Women Sport', path: '/products/sale/women-sport' },
];

export function findMenuBySlug(menus, slug) {
  return menus.find((m) => m.slug === slug) || null;
}

export function findCategoryBySlug(menus, groupSlug, categorySlug) {
  const menu = findMenuBySlug(menus, groupSlug);
  if (!menu) return null;
  const child = (menu.children || []).find((c) => c.slug === categorySlug);
  if (!child) {
    return { name: categorySlug, slug: categorySlug };
  }
  return { name: child.name, slug: child.slug, image_path: child.image_path || null };
}

export const menuService = {
  async getMenu() {
    const { data } = await api.get('/v1/category/menu');
    const rawMenus = data?.data?.menus || [];

    const apiNav = rawMenus.map((menu) => ({
      name: menu.name,
      slug: menu.slug,
      path: `/products/${menu.slug}`,
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
        path: '/products/sale',
        featureTitle: 'Shop Sale',
        isSale: true,
        categories: SALE_FALLBACK_CATEGORIES.map((c) => ({ ...c })),
      });
      rawMenus.push({
        name: 'Sale',
        slug: 'sale',
        banner: null,
        children: [],
      });
    }

    return { navigation: apiNav, rawMenus };
  },
};

export default menuService;
