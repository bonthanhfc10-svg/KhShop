import ShopLayout from '../../components/product/ShopLayout';
import { products } from '../../data/products';

export default function Shop() {
  return (
    <ShopLayout
      title="Shop"
      description="Explore the KhShop collection. Shoes, clothing, accessories and sport gear built for every move."
      products={products}
      itemsPerPage={12}
    />
  );
}
