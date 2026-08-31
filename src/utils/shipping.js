export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_COST = 5.99;

export const SHIPPING_METHODS = [
  {
    id: 'standard',
    label: 'Standard',
    description: '3–5 business days',
    cost: 5.99,
  },
  {
    id: 'express',
    label: 'Express',
    description: '1–2 business days',
    cost: 12.99,
  },
  {
    id: 'free-over-50',
    label: 'Free Standard (orders over $50)',
    description: '3–5 business days',
    cost: 0,
  },
];

export const calculateShipping = (subtotal, methodId = 'standard') => {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  const method = SHIPPING_METHODS.find((m) => m.id === methodId);
  return method ? method.cost : SHIPPING_COST;
};

export const getDeliveryCost = (subtotal, methodId) =>
  calculateShipping(subtotal, methodId);
