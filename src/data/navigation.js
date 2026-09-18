export const navigation = [
  {
    name: 'Men',
    slug: 'men',
    path: '/men',
    featureTitle: 'Shop Men',
    categories: [
      { name: 'Shoes', path: '/category/shoes' },
      { name: 'Clothing', path: '/category/clothing' },
      { name: 'Accessories', path: '/category/accessories' },
      { name: 'Sport', path: '/category/sport' },
    ],
  },
  {
    name: 'Women',
    slug: 'women',
    path: '/women',
    featureTitle: 'Shop Women',
    categories: [
      { name: 'Shoes', path: '/category/shoes' },
      { name: 'Clothing', path: '/category/clothing' },
      { name: 'Accessories', path: '/category/accessories' },
      { name: 'Sport', path: '/category/sport' },
    ],
  },
  {
    name: 'Kids',
    slug: 'kids',
    path: '/kids',
    featureTitle: 'Shop Kids',
    categories: [
      { name: 'Girl Shoes', path: '/category/girl-shoes' },
      { name: 'Boy Shoes', path: '/category/boy-shoes' },
      { name: 'Boy Clothing', path: '/category/boy-clothing' },
      { name: 'Girl Clothing', path: '/category/girl-clothing' },
      { name: 'Kids Accessories', path: '/category/accessories' },
    ],
  },
  {
    name: 'Sport',
    slug: 'sport',
    path: '/sport',
    featureTitle: 'Shop Sport',
    categories: [
      { name: 'Running', path: '/category/running' },
      { name: 'Football', path: '/category/football' },
      { name: 'Training', path: '/category/training' },
      { name: 'Volleyball', path: '/category/volleyball' },
    ],
  },
  {
    name: 'Sale',
    slug: 'sale',
    path: '/sale',
    featureTitle: 'Shop Sale',
    isSale: true,
    categories: [
      { name: 'Women', path: '/category/women-sale' },
      { name: 'Men', path: '/category/men-sale' },
      { name: 'Boy Kids', path: '/category/boy-kids' },
      { name: 'Girl Kids', path: '/category/girl-kids' },
      { name: 'Men Sport', path: '/category/men-sport' },
      { name: 'Women Sport', path: '/category/women-sport' },
    ],
  },
];

export const footerShopLinks = [
  { label: 'Men', path: '/products/men' },
  { label: 'Women', path: '/products/women' },
  { label: 'Kids', path: '/products/kids' },
  { label: 'Sport', path: '/products/sport' },
  { label: 'Sale', path: '/products/sale' },
];

export const footerHelpLinks = [
  { label: 'Contact', path: '/contact' },
  { label: 'Shipping', path: '/shipping' },
  { label: 'Returns', path: '/returns' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Size Guide', path: '/size-guide' },
];

export const footerAboutLinks = [
  { label: 'About KhShop', path: '/about' },
  { label: 'Our Story', path: '/about' },
  { label: 'Careers', path: '/careers' },
];

export const accountLinks = [
  { label: 'Dashboard', path: '/account' },
  { label: 'Profile', path: '/account/profile' },
  { label: 'Orders', path: '/account/orders' },
  { label: 'Addresses', path: '/account/addresses' },
];

export const getNavGroup = (slug) =>
  navigation.find((g) => g.path === `/${slug}`);

export const getNavCategory = (groupSlug, categorySlug) => {
  const group = getNavGroup(groupSlug);
  if (!group) return null;
  const wanted = `/${groupSlug}/${categorySlug}`;
  return (
    group.categories.find((c) => c.path === wanted) || {
      name: categorySlug,
      path: wanted,
    }
  );
};

export default navigation;
