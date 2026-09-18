import api from './api';

function buildCategoryPath(parentSlug, childSlug) {
  return `/products/${parentSlug}/${childSlug}`;
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
