import { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ShopLayout from '../../../components/customer/product/ShopLayout';
import { useProducts, useProductFilters } from '../../../hooks/useProducts';
import { useMenus } from '../../../store/MenuContext';
import { getCategoryBySlug } from '../../../data/categories';
import NotFound from '../error/NotFound';

export default function Category() {
  const { slug } = useParams();
  const location = useLocation();
  const { rawMenus } = useMenus();
  const pathSlug = location.pathname.split('/').filter(Boolean).pop();
  const category = getCategoryBySlug(slug) || getCategoryBySlug(pathSlug);

  const menuSlug = useMemo(() => {
    if (!category || !rawMenus.length) return null;
    const menu = rawMenus.find((m) =>
      (m.children || []).some((c) => c.slug === category.slug)
    );
    return menu?.slug || null;
  }, [category, rawMenus]);

  const productParams = useMemo(() => {
    const params = {};
    if (menuSlug) params.menuSlug = menuSlug;
    if (category?.slug) params.selectedCategories = [category.slug];
    return params;
  }, [menuSlug, category]);

  const { products, loading, error } = useProducts('list', productParams);

  const filterParams = useMemo(() => {
    const params = {};
    if (menuSlug) params.menuSlug = menuSlug;
    if (category?.slug) params.selectedCategories = [category.slug];
    return params;
  }, [menuSlug, category]);

  const { filters: filterData } = useProductFilters(filterParams);

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
