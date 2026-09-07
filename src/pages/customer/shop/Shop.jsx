import ShopLayout from '../../../components/customer/product/ShopLayout';
import { useProducts } from '../../../hooks/useProducts';
import Loading from '../../../components/common/Loading';

export default function Shop() {
  const { products, loading } = useProducts('list');

  return (
    <ShopLayout
      title="Shop"
      description="Explore the KhShop collection. Shoes, clothing, accessories and sport gear built for every move."
      products={products}
      loading={loading}
      itemsPerPage={12}
    />
  );
}
