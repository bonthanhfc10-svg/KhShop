import ShopLayout from '../../../components/customer/product/ShopLayout';
import { useProducts } from '../../../hooks/useProducts';

export default function Shop() {
  const { products, loading, error } = useProducts('list');

  return (
    <ShopLayout
      title="Shop"
      description="Explore the KhShop collection. Shoes, clothing, accessories and sport gear built for every move."
      products={products}
      loading={loading}
      error={error}
      itemsPerPage={12}
    />
  );
}
