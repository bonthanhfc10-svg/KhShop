export const orderSubtotal = (order) =>
  order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const orderTotal = (order) => orderSubtotal(order) + order.shipping;

export const orderTotalFormatted = (order, formatPrice) =>
  formatPrice(orderTotal(order));
