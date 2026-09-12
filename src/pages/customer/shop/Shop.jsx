import { useMemo } from 'react';
import ShopLayout from '../../../components/customer/product/ShopLayout';
import { useProducts, useProductFilters } from '../../../hooks/useProducts';
import useShopFilters from '../../../hooks/useShopFilters';

export default function Shop() {
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
  } = useShopFilters({});

  const params = useMemo(() => buildRequestParams(), [buildRequestParams]);

  const { products, loading, error, totalPages, totalCount } = useProducts('list', params);
  const { filters: filterData } = useProductFilters({});

  return (
    <ShopLayout
      title="Shop"
      description="Explore the KhShop collection. Shoes, clothing, accessories and sport gear built for every move."
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
      breadcrumbContext={[]}
    />
  );
}
