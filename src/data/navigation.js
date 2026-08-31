export const navigation = [
  {
    name: 'Men',
    slug: 'men',
    path: '/shop/men',
    featureTitle: 'Shop Men',
    categories: [
      { name: 'Shoes', path: '/shop/men/shoes' },
      { name: 'Clothing', path: '/shop/men/clothing' },
      { name: 'Accessories', path: '/shop/men/accessories' },
      { name: 'Sport', path: '/shop/men/sport' },
    ],
  },
  {
    name: 'Women',
    slug: 'women',
    path: '/shop/women',
    featureTitle: 'Shop Women',
    categories: [
      { name: 'Shoes', path: '/shop/women/shoes' },
      { name: 'Clothing', path: '/shop/women/clothing' },
      { name: 'Accessories', path: '/shop/women/accessories' },
      { name: 'Sport', path: '/shop/women/sport' },
    ],
  },
  {
    name: 'Kids',
    slug: 'kids',
    path: '/shop/kids',
    featureTitle: 'Shop Kids',
    categories: [
      { name: 'Girl Shoes', path: '/shop/kids/girl-shoes' },
      { name: 'Boy Shoes', path: '/shop/kids/boy-shoes' },
      { name: 'Boy Clothing', path: '/shop/kids/boy-clothing' },
      { name: 'Girl Clothing', path: '/shop/kids/girl-clothing' },
      { name: 'Kids Accessories', path: '/shop/kids/accessories' },
    ],
  },
  {
    name: 'Sport',
    slug: 'sport',
    path: '/shop/sport',
    featureTitle: 'Shop Sport',
    categories: [
      { name: 'Running', path: '/shop/sport/running' },
      { name: 'Football', path: '/shop/sport/football' },
      { name: 'Training', path: '/shop/sport/training' },
      { name: 'Volleyball', path: '/shop/sport/volleyball' },
    ],
  },
  {
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
  },
];

export const footerShopLinks = [
  { label: 'Men', path: '/shop/men' },
  { label: 'Women', path: '/shop/women' },
  { label: 'Kids', path: '/shop/kids' },
  { label: 'Sport', path: '/shop/sport' },
  { label: 'Sale', path: '/shop/sale' },
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
  navigation.find((g) => g.path === `/shop/${slug}`);

export const getNavCategory = (groupSlug, categorySlug) => {
  const group = getNavGroup(groupSlug);
  if (!group) return null;
  const wanted = `/shop/${groupSlug}/${categorySlug}`;
  return (
    group.categories.find((c) => c.path === wanted) || {
      name: categorySlug,
      path: wanted,
    }
  );
};

export default navigation;
