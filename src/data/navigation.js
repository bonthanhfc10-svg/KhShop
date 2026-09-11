export const navigation = [
  {
    name: 'Men',
    slug: 'men',
    path: '/products/men',
    featureTitle: 'Shop Men',
    categories: [
      { name: 'Shoes', path: '/products/men/shoes' },
      { name: 'Clothing', path: '/products/men/clothing' },
      { name: 'Accessories', path: '/products/men/accessories' },
      { name: 'Sport', path: '/products/men/sport' },
    ],
  },
  {
    name: 'Women',
    slug: 'women',
    path: '/products/women',
    featureTitle: 'Shop Women',
    categories: [
      { name: 'Shoes', path: '/products/women/shoes' },
      { name: 'Clothing', path: '/products/women/clothing' },
      { name: 'Accessories', path: '/products/women/accessories' },
      { name: 'Sport', path: '/products/women/sport' },
    ],
  },
  {
    name: 'Kids',
    slug: 'kids',
    path: '/products/kids',
    featureTitle: 'Shop Kids',
    categories: [
      { name: 'Girl Shoes', path: '/products/kids/girl-shoes' },
      { name: 'Boy Shoes', path: '/products/kids/boy-shoes' },
      { name: 'Boy Clothing', path: '/products/kids/boy-clothing' },
      { name: 'Girl Clothing', path: '/products/kids/girl-clothing' },
      { name: 'Kids Accessories', path: '/products/kids/accessories' },
    ],
  },
  {
    name: 'Sport',
    slug: 'sport',
    path: '/products/sport',
    featureTitle: 'Shop Sport',
    categories: [
      { name: 'Running', path: '/products/sport/running' },
      { name: 'Football', path: '/products/sport/football' },
      { name: 'Training', path: '/products/sport/training' },
      { name: 'Volleyball', path: '/products/sport/volleyball' },
    ],
  },
  {
    name: 'Sale',
    slug: 'sale',
    path: '/products/sale',
    featureTitle: 'Shop Sale',
    isSale: true,
    categories: [
      { name: 'Women', path: '/products/sale/women' },
      { name: 'Men', path: '/products/sale/men' },
      { name: 'Boy Kids', path: '/products/sale/boy-kids' },
      { name: 'Girl Kids', path: '/products/sale/girl-kids' },
      { name: 'Men Sport', path: '/products/sale/men-sport' },
      { name: 'Women Sport', path: '/products/sale/women-sport' },
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
  navigation.find((g) => g.path === `/products/${slug}`);

export const getNavCategory = (groupSlug, categorySlug) => {
  const group = getNavGroup(groupSlug);
  if (!group) return null;
  const wanted = `/products/${groupSlug}/${categorySlug}`;
  return (
    group.categories.find((c) => c.path === wanted) || {
      name: categorySlug,
      path: wanted,
    }
  );
};

export default navigation;
