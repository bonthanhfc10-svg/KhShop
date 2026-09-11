import { useMemo } from 'react';
import ShopLayout from '../../../components/customer/product/ShopLayout';
import { useProducts } from '../../../hooks/useProducts';
import { getNavGroup } from '../../../data/navigation';
import CategoryBanner from '../../../components/customer/shop/CategoryBanner';
import saleBanner from '../../../assets/images/Salebanner.png';

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

  const sale = useMemo(
    () => allProducts.filter((p) => p.sale_price != null && p.sale_price < p.originalPrice),
    [allProducts]
  );

  const saleGroup = getNavGroup('sale');

  const categoryOptions = useMemo(
    () => saleGroup.categories.map((c) => c.name),
    [saleGroup]
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
      />
    </main>
  );
}
