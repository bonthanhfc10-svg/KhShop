export const categories = [
  {
    id: 1,
    name: 'Shoes',
    slug: 'shoes',
    description:
      'Performance-driven footwear engineered for every stride. From track to street, move with confidence.',
    image: '/images/categories/shoes.svg',
    count: 5,
  },
  {
    id: 2,
    name: 'Clothing',
    slug: 'clothing',
    description:
      'Breathable, bold and built for motion. Everyday essentials with a sharp, modern cut.',
    image: '/images/categories/clothing.svg',
    count: 4,
  },
  {
    id: 3,
    name: 'Accessories',
    slug: 'accessories',
    description:
      'Finish the look. Caps, bags, socks and belts crafted to level up any outfit.',
    image: '/images/categories/accessories.svg',
    count: 4,
  },
  {
    id: 4,
    name: 'Sport',
    slug: 'sport',
    description:
      'High-performance gear for runners, athletes and anyone who plays to win.',
    image: '/images/categories/sport.svg',
    count: 8,
  },
];

export const getCategoryBySlug = (slug) =>
  categories.find((c) => c.slug === slug);

export default categories;