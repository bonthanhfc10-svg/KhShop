import { useParams, useLocation } from 'react-router-dom';
import ShopLayout from '../../../components/customer/product/ShopLayout';
import { useProducts, useProductFilters } from '../../../hooks/useProducts';
import { getCategoryBySlug } from '../../../data/categories';
import NotFound from '../error/NotFound';

export default function Category() {
  const { slug } = useParams();
  const location = useLocation();
  const pathSlug = location.pathname.split('/').filter(Boolean).pop();
  const category = getCategoryBySlug(slug) || getCategoryBySlug(pathSlug);

  const { products, loading, error } = useProducts('list', {
    categorySlug: category?.slug,
  });

  const { filters: filterData } = useProductFilters(
    category ? { categorySlug: category.slug } : {}
  );

  if (!category) {
    return <NotFound />;
  }

  return (
    <ShopLayout
      title={category.name}
      description={category.description}
      products={products}
      loading={loading}
      error={error}
      fixedCategory={category.slug}
      itemsPerPage={9}
      filterData={filterData}
    />
  );
}
