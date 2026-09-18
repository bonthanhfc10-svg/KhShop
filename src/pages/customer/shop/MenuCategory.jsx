import { useMemo } from 'react';
import { useParams, Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ShopLayout from '../../../components/customer/product/ShopLayout';
import CategoryBanner from '../../../components/customer/shop/CategoryBanner';
import Loading from '../../../components/common/Loading';
import NotFound from '../error/NotFound';
import { useProducts, useProductFilters } from '../../../hooks/useProducts';
import { useMenus } from '../../../store/MenuContext';
import { findMenuBySlug } from '../../../services/menuService';
import useShopFilters from '../../../hooks/useShopFilters';

function buildDescription(groupName) {
  return `${groupName} collection at KhShop. Modern style meets unbeatable prices for men and women. Premium quality, modern style, limited time only.`;
}

function buildBreadcrumb(group) {
  return [
    { label: 'Home', path: '/' },
    { label: group.name, path: group.path },
  ];
}

export default function MenuCategory() {
  const { menuSlug: urlMenuSlug } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { rawMenus, menuLoading } = useMenus();
  const searchQuery = searchParams.get('search') || null;

  const rawMenu = findMenuBySlug(rawMenus, urlMenuSlug);

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
    menuSlug: rawMenu?.slug || null,
    search: searchQuery,
  });

  const group = rawMenu
    ? {
        name: rawMenu.name,
        slug: rawMenu.slug,
        path: `/products/${rawMenu.slug}`,
        categories: (rawMenu.children || []).map((child) => ({
          name: child.name,
          slug: child.slug,
          path: `/products/${rawMenu.slug}/${child.slug}`,
        })),
      }
    : null;

  const breadcrumbContext = useMemo(() => {
    const context = [];
    if (group) context.push({ label: group.name, path: group.path });
    return context.length > 0 ? context : null;
  }, [group]);

  const productParams = useMemo(() => buildRequestParams(), [buildRequestParams]);
  const { products, loading, error, totalPages, totalCount } = useProducts('list', productParams);

  const filterParams = useMemo(() => {
    const params = {};
    if (rawMenu) params.menuSlug = rawMenu.slug;
    return params;
  }, [rawMenu]);

  const { filters: filterData } = useProductFilters(filterParams);

  const breadcrumb = useMemo(
    () => (group ? buildBreadcrumb(group) : []),
    [group]
  );

  if (menuLoading) return <main className="container-kh"><Loading full /></main>;
  if (!group) return <NotFound />;

  const bannerImage = rawMenu?.banner?.image_path || '/images/default-banner.jpg';
  const showSubcategories = group.categories.length > 0;

  const subcategories = group.categories.map((cat) => {
    const rawChild = (rawMenu?.children || []).find((c) => c.slug === cat.slug);
    return { ...cat, image: rawChild?.image_path || null };
  });

  return (
    <main>
      <CategoryBanner
        image={bannerImage}
        eyebrow="KhShop"
        title={group.name}
        subtitle={buildDescription(group.name)}
        ctaPath={group.path}
      />

      <div className="container-kh pt-8">
        <nav
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-neutral-500"
          aria-label="Breadcrumb"
        >
          {breadcrumb.map((c, i) => (
            <span key={c.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={12} />}
              {i === breadcrumb.length - 1 ? (
                <span className="text-neutral-900">{c.label}</span>
              ) : (
                <Link
                  to={c.path}
                  className="transition-colors hover:text-black"
                >
                  {c.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {showSubcategories && (
        <div className="container-kh pb-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {subcategories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className="group relative block aspect-[3/4] overflow-hidden bg-neutral-100"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5">
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white sm:text-base">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <ShopLayout
        title={`${group.name}'s Products`}
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
    </main>
  );
}
