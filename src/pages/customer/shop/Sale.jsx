import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ShopLayout from '../../../components/customer/product/ShopLayout';
import { useProducts, useProductFilters } from '../../../hooks/useProducts';
import { useMenus } from '../../../store/MenuContext';
import CategoryBanner from '../../../components/customer/shop/CategoryBanner';
import useShopFilters from '../../../hooks/useShopFilters';

export default function Sale() {
  const { rawMenus } = useMenus();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || null;

  const saleMenu = useMemo(
    () => rawMenus.find((m) => m.slug === 'sale') || null,
    [rawMenus]
  );

  const saleBanner = saleMenu?.banner?.image_path || '/images/sale-banner.jpg';

  const saleCategories = useMemo(() => {
    if (saleMenu?.children?.length) {
      return saleMenu.children.map((child) => ({
        name: child.name,
        path: `/products/sale/${child.slug}`,
      }));
    }
    return [];
  }, [saleMenu]);

  const breadcrumbContext = useMemo(
    () => (saleMenu ? [{ label: saleMenu.name, path: '/products/sale' }] : []),
    [saleMenu]
  );

  const hasBackendSale = Boolean(saleMenu?.children?.length);

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
    menuSlug: hasBackendSale ? 'sale' : null,
    search: searchQuery,
  });

  const params = useMemo(() => buildRequestParams(), [buildRequestParams]);

  const { products, loading, error, totalPages, totalCount } = useProducts('list', params);
  const { filters: filterData } = useProductFilters(hasBackendSale ? { menuSlug: 'sale' } : {});

  return (
    <main>
      <CategoryBanner
        image={saleBanner}
        eyebrow="KhShop"
        title="Sale"
        subtitle="Seasonal savings on your favourite styles. Modern style meets unbeatable prices. Limited time while stocks last."
        ctaPath="/products/sale"
      />
      <ShopLayout
        title="Sale"
        description="Seasonal savings on your favourite styles. Limited time while stocks last."
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
    </main>
  );
}
