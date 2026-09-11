const PLACEHOLDER = '/images/placeholder.svg';

export function mapApiProduct(raw) {
  const image =
    raw.first_variant?.image?.image_path || PLACEHOLDER;

  const price = Number(raw.price) || 0;
  const salePrice = raw.sale_price != null ? Number(raw.sale_price) : null;
  const hasDiscount = salePrice != null && salePrice < price;

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    price: hasDiscount ? salePrice : price,
    oldPrice: hasDiscount ? price : null,
    images: [image],
    colors: (raw.available_colors || []).map((c) => ({
      name: c.name,
      hex: c.code,
    })),
    totalColors: raw.total_colors || 0,
    stock: raw.first_variant?.stock ?? 0,
  };
}
