import { useParams, useLocation } from 'react-router-dom';
import ShopLayout from '../../components/product/ShopLayout';
import { products, getProductsByCategory } from '../../data/products';
import { getCategoryBySlug } from '../../data/categories';
import NotFound from '../error/NotFound';

export default function Category() {
  const { slug } = useParams();
  const location = useLocation();
  const pathSlug = location.pathname.split('/').filter(Boolean).pop();
  const category = getCategoryBySlug(slug) || getCategoryBySlug(pathSlug);

  if (!category) {
    return <NotFound />;
  }

  const items =
    getProductsByCategory(category.slug).length > 0
      ? getProductsByCategory(category.slug)
      : products.filter((p) => p.category === category.slug);

  return (
    <ShopLayout
      title={category.name}
      description={category.description}
      products={items}
      fixedCategory={category.slug}
      itemsPerPage={9}
    />
  );
}
