import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ShopLayout from '../../../components/customer/product/ShopLayout';
import { useProducts, useProductFilters } from '../../../hooks/useProducts';
import { useMenus } from '../../../store/MenuContext';
import { findMenuBySlug } from '../../../services/menuService';
import NotFound from '../error/NotFound';
import useShopFilters from '../../../hooks/useShopFilters';

export default function Category() {
  const { menuSlug: urlMenuSlug, categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const { rawMenus } = useMenus();
  const searchQuery = searchParams.get('search') || null;

  const rawMenu = useMemo(() => {
    if (urlMenuSlug) {
      return findMenuBySlug(rawMenus, urlMenuSlug);
    }
    if (!categorySlug || !rawMenus.length) return null;
    return rawMenus.find((m) =>
      (m.children || []).some((c) => c.slug === categorySlug)
    ) || null;
  }, [urlMenuSlug, categorySlug, rawMenus]);

  const resolvedMenuSlug = rawMenu?.slug || urlMenuSlug || null;

  const childCategory = useMemo(() => {
    if (!rawMenu || !categorySlug) return null;
    const child = (rawMenu.children || []).find((c) => c.slug === categorySlug);
    if (!child) return { name: categorySlug, slug: categorySlug, image_path: null };
    return { name: child.name, slug: child.slug, image_path: child.image_path || null };
  }, [rawMenu, categorySlug]);

  const breadcrumbContext = useMemo(() => {
    const context = [{ label: 'Home', path: '/' }];
    if (resolvedMenuSlug && rawMenu) {
      context.push({ label: rawMenu.name, path: `/products/${resolvedMenuSlug}` });
    }
    if (childCategory) {
      context.push({ label: childCategory.name, path: `/products/${resolvedMenuSlug}/${childCategory.slug}` });
    }
    return context;
  }, [resolvedMenuSlug, rawMenu, childCategory]);

  const {
    draftFilters,
    draftSort,
    appliedFilters,
    page,
    changeDraftFilter,
    changeDraftSort,
    applyFilters,
    resetFilters,
    setPage,
    buildRequestParams,
  } = useShopFilters({
    menuSlug: resolvedMenuSlug,
    categorySlug: childCategory?.slug || null,
    search: searchQuery,
  });

  const productParams = useMemo(() => buildRequestParams(), [buildRequestParams]);
  const { products, loading, error, totalPages, totalCount } = useProducts('list', productParams);

  const filterParams = useMemo(() => {
    const params = {};
    if (resolvedMenuSlug) params.menuSlug = resolvedMenuSlug;
    if (childCategory?.slug) params.categorySlug = childCategory.slug;
    return params;
  }, [resolvedMenuSlug, childCategory]);

  const { filters: filterData } = useProductFilters(filterParams);

  if (!childCategory) return <NotFound />;

  return (
    <ShopLayout
      title={childCategory.name}
      description=""
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
