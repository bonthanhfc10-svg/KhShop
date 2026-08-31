export const formatPrice = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};
