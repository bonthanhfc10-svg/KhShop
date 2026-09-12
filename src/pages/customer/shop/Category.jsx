import { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ShopLayout from '../../../components/customer/product/ShopLayout';
import { useProducts, useProductFilters } from '../../../hooks/useProducts';
import { useMenus } from '../../../store/MenuContext';
import { getCategoryBySlug } from '../../../data/categories';
import NotFound from '../error/NotFound';
import useShopFilters from '../../../hooks/useShopFilters';

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

  const breadcrumbContext = useMemo(() => {
    if (!menuSlug || !category) return [];
    const menu = rawMenus.find((m) => m.slug === menuSlug);
    const context = [];
    if (menu) context.push({ label: menu.name, path: `/products/${menu.slug}` });
    context.push({ label: category.name, path: `/products/${menuSlug}/${category.slug}` });
    return context;
  }, [menuSlug, category, rawMenus]);

  const {
    draftFilters,
    draftSort,
    appliedFilters,
    appliedSort,
    page,
    changeDraftFilter,
    changeDraftSort,
    applyFilters,
    resetFilters,
    setPage,
    buildRequestParams,
  } = useShopFilters({
    menuSlug,
    categorySlug: category?.slug || null,
  });

  const productParams = useMemo(() => buildRequestParams(), [buildRequestParams]);

  const { products, loading, error, totalPages, totalCount } = useProducts('list', productParams);

  const filterParams = useMemo(() => {
    const params = {};
    if (menuSlug) params.menuSlug = menuSlug;
    if (category?.slug) params.categorySlug = category.slug;
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
      filterData={filterData}
      draftFilters={draftFilters}
      draftSort={draftSort}
      appliedFilters={appliedFilters}
      page={page}
      totalPages={totalPages}
      totalCount={totalCount}
      onFilterChange={changeDraftFilter}
      onSortChange={changeDraftSort}
      onApplyFilters={applyFilters}
      onResetFilters={resetFilters}
      onPageChange={setPage}
      breadcrumbContext={breadcrumbContext}
    />
  );
}
