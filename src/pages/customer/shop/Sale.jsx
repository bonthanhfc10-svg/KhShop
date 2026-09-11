import { useMemo } from 'react';
import ShopLayout from '../../../components/customer/product/ShopLayout';
import { useProducts, useProductFilters } from '../../../hooks/useProducts';
import { useMenus } from '../../../store/MenuContext';
import CategoryBanner from '../../../components/customer/shop/CategoryBanner';

const DEFAULT_SALE_CATEGORIES = [
  { name: 'Women', path: '/shop/sale/women' },
  { name: 'Men', path: '/shop/sale/men' },
  { name: 'Boy Kids', path: '/shop/sale/boy-kids' },
  { name: 'Girl Kids', path: '/shop/sale/girl-kids' },
  { name: 'Men Sport', path: '/shop/sale/men-sport' },
  { name: 'Women Sport', path: '/shop/sale/women-sport' },
];

function matchesSaleCategory(categoryName) {
  const catLc = categoryName.toLowerCase();
  const isSport = catLc.endsWith('sport');

  let gender = null;
  if (catLc.startsWith('women') || catLc === 'women') gender = 'women';
  if (catLc.startsWith('men') || catLc === 'men') gender = 'men';

  return (p) => {
    if (gender && p.gender !== gender) return false;
    if (isSport && p.categorySlug !== 'sport') return false;
    return true;
  };
}

export default function Sale() {
  const { products: allProducts, loading, error } = useProducts('list');
  const { rawMenus } = useMenus();

  const saleMenu = useMemo(
    () => rawMenus.find((m) => m.slug === 'sale') || null,
    [rawMenus]
  );

  const saleBanner = saleMenu?.banner?.image_path || '/images/sale-banner.jpg';

  const saleCategories = useMemo(() => {
    if (saleMenu?.children?.length) {
      return saleMenu.children.map((child) => ({
        name: child.name,
        path: `/shop/sale/${child.slug}`,
      }));
    }
    return DEFAULT_SALE_CATEGORIES;
  }, [saleMenu]);

  const sale = useMemo(
    () =>
      allProducts.filter(
        (p) => p.sale_price != null && p.sale_price < p.originalPrice
      ),
    [allProducts]
  );

  const categoryOptions = useMemo(
    () => saleCategories.map((c) => c.name),
    [saleCategories]
  );

  const categoryFilter = useMemo(() => {
    const map = {};
    categoryOptions.forEach((name) => {
      map[name] = new Set(
        sale.filter(matchesSaleCategory(name)).map((p) => p.id)
      );
    });
    return (categoryName) => (product) =>
      map[categoryName] ? map[categoryName].has(product.id) : true;
  }, [sale, categoryOptions]);

  const hasBackendSale = Boolean(saleMenu?.children?.length);

  const { filters: filterData } = useProductFilters(
    hasBackendSale ? { menuSlug: 'sale' } : {}
  );

  return (
    <main>
      <CategoryBanner
        image={saleBanner}
        eyebrow="KhShop"
        title="Sale"
        subtitle="Seasonal savings on your favourite styles. Modern style meets unbeatable prices. Limited time while stocks last."
        ctaPath="/shop/sale"
      />
      <ShopLayout
        title="Sale"
        description="Seasonal savings on your favourite styles. Limited time while stocks last."
        products={sale}
        loading={loading}
        error={error}
        itemsPerPage={12}
        hideHeader
        categoryOptions={categoryOptions}
        categoryFilter={categoryFilter}
        filterData={filterData}
      />
    </main>
  );
}
