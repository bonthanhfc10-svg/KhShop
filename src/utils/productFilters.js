export const sortProducts = (products, sortKey) => {
  const arr = [...products];
  switch (sortKey) {
    case 'newest':
      return arr.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'best-selling':
      return arr.sort((a, b) => b.reviews - a.reviews);
    case 'featured':
    default:
      return arr.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
  }
};

export const matchesFilters = (product, filters = {}) => {
  if (filters.category && product.category !== filters.category) return false;

  if (Array.isArray(filters.sizes) && filters.sizes.length > 0) {
    if (!filters.sizes.some((s) => product.sizes.includes(s))) return false;
  }

  if (Array.isArray(filters.colors) && filters.colors.length > 0) {
    const productColors = product.colors.map((c) => c.name);
    if (!filters.colors.some((c) => productColors.includes(c))) return false;
  }

  if (filters.price) {
    const { min, max } = filters.price;
    if (product.price < min || product.price > max) return false;
  }

  if (Array.isArray(filters.brands) && filters.brands.length > 0) {
    if (!filters.brands.includes(product.brand)) return false;
  }

  if (filters.rating && product.rating < filters.rating) return false;

  if (Array.isArray(filters.availability) && filters.availability.length > 0) {
    const inStock = product.stock > 0;
    const inStockFiltered = filters.availability.includes('In Stock');
    const outOfStockFiltered = filters.availability.includes('Out of Stock');
    if (inStock && !inStockFiltered) return false;
    if (!inStock && !outOfStockFiltered) return false;
  }

  return true;
};

export const applyFilters = (products, filters = {}) =>
  products.filter((p) => matchesFilters(p, filters));
