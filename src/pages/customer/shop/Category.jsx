import { useParams, useLocation } from 'react-router-dom';
import ShopLayout from '../../../components/customer/product/ShopLayout';
import { useProducts } from '../../../hooks/useProducts';
import Loading from '../../../components/common/Loading';
import { getCategoryBySlug } from '../../../data/categories';
import NotFound from '../error/NotFound';

export default function Category() {
  const { slug } = useParams();
  const location = useLocation();
  const pathSlug = location.pathname.split('/').filter(Boolean).pop();
  const category = getCategoryBySlug(slug) || getCategoryBySlug(pathSlug);
  const { products, loading } = useProducts('category', { category: category?.slug });

  if (!category) {
    return <NotFound />;
  }

  return (
    <ShopLayout
      title={category.name}
      description={category.description}
      products={products}
      loading={loading}
      fixedCategory={category.slug}
      itemsPerPage={9}
    />
  );
}
