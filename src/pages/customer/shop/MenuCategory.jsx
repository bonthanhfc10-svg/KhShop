import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ShopLayout from '../../../components/customer/product/ShopLayout';
import CategoryBanner from '../../../components/customer/shop/CategoryBanner';
import NotFound from '../error/NotFound';
import { useProducts, useProductFilters } from '../../../hooks/useProducts';
import { useMenus } from '../../../store/MenuContext';
import { findMenuBySlug, findCategoryBySlug } from '../../../services/menuService';

function buildDescription(groupName, categoryName) {
  if (!categoryName)
    return `${groupName} collection at KhShop. Modern style meets unbeatable prices for men and women. Premium quality, modern style, limited time only.`;
  return `${groupName} ${categoryName} at KhShop. Modern style meets unbeatable prices for men and women. Premium quality, modern style, limited time only.`;
}

function filterProductsByGroup(products, group) {
  const gender = ['men', 'women'].includes(group.slug) ? group.slug : null;
  let list = products;
  if (gender) list = list.filter((p) => p.gender === gender);
  if (group.name === 'Sport') list = list.filter((p) => p.categorySlug === 'sport');
  if (list.length === 0) list = products;
  return list;
}

function resolveProductTypes(categoryName) {
  const key = categoryName
    .toLowerCase()
    .replace('girl ', '')
    .replace('boy ', '')
    .replace('kids ', '');
  if (key.includes('shoe')) return ['shoes'];
  if (key.includes('accessor')) return ['accessories'];
  if (key.includes('sport')) return ['sport'];
  if (key.includes('cloth') || key.includes('shirt') || key.includes('pant'))
    return ['clothing'];
  return ['shoes', 'clothing', 'accessories', 'sport'];
}

function buildBreadcrumb(group, category) {
  const crumbs = [{ label: 'Home', path: '/' }];
  crumbs.push({ label: group.name, path: group.path });
  if (category) crumbs.push({ label: category.name, path: category.path });
  return crumbs;
}

export default function MenuCategory() {
  const { group: groupSlug, category: categorySlug } = useParams();
  const { rawMenus } = useMenus();

  const rawMenu = findMenuBySlug(rawMenus, groupSlug);
  const rawCategory = categorySlug
    ? findCategoryBySlug(rawMenus, groupSlug, categorySlug)
    : null;

  const group = rawMenu
    ? {
        name: rawMenu.name,
        slug: rawMenu.slug,
        path: `/shop/${rawMenu.slug}`,
        categories: (rawMenu.children || []).map((child) => ({
          name: child.name,
          path: `/shop/${rawMenu.slug}/${child.slug}`,
        })),
      }
    : null;

  const category = rawCategory
    ? {
        name: rawCategory.name,
        path: `/shop/${groupSlug}/${rawCategory.slug}`,
      }
    : null;

  const { products: allProducts, loading, error } = useProducts('list');

  const filterParams = useMemo(() => {
    if (rawCategory) {
      return { categorySlug: rawCategory.slug };
    }
    if (rawMenu) {
      return { menuSlug: rawMenu.slug };
    }
    return {};
  }, [rawMenu, rawCategory]);

  const { filters: filterData } = useProductFilters(filterParams);

  const breadcrumb = useMemo(
    () => (group ? buildBreadcrumb(group, category) : []),
    [group, category]
  );

  const categoryMatches = useMemo(() => {
    if (!group) return () => true;
    const map = {};
    group.categories.forEach((cat) => {
      const types = resolveProductTypes(cat.name);
      map[cat.name] = new Set(
        allProducts
          .filter((p) => {
            if (group.slug === 'men' && p.gender !== 'men') return false;
            if (group.slug === 'women' && p.gender !== 'women') return false;
            if (group.slug === 'sport' && p.categorySlug !== 'sport')
              return false;
            if (!types.includes(p.categorySlug)) return false;
            return true;
          })
          .map((p) => p.id)
      );
    });
    return (categoryName) => (product) =>
      map[categoryName] ? map[categoryName].has(product.id) : true;
  }, [group, allProducts]);

  const categoryProducts = useMemo(() => {
    if (!group || !category) return [];
    const types = resolveProductTypes(category.name);
    let list = allProducts;
    if (group.slug === 'men') list = list.filter((p) => p.gender === 'men');
    if (group.slug === 'women')
      list = list.filter((p) => p.gender === 'women');
    if (group.slug === 'sport')
      list = list.filter((p) => p.categorySlug === 'sport');
    if (types.length) list = list.filter((p) => types.includes(p.categorySlug));
    if (list.length === 0) list = filterProductsByGroup(allProducts, group);
    return list;
  }, [category, group, allProducts]);

  if (!group) return <NotFound />;

  const bannerImage =
    rawMenu?.banner?.image_path || '/images/default-banner.jpg';

  const showGroupBanner = !category;
  const showSubcategories = showGroupBanner && group.categories.length > 0;

  const categoryOptions = group.categories.map((c) => c.name);

  const subcategories = group.categories.map((cat) => {
    const rawChild = (rawMenu?.children || []).find(
      (c) => c.slug === cat.path.split('/').pop()
    );
    return {
      ...cat,
      image: rawChild?.image_path || null,
    };
  });

  return (
    <main>
      {showGroupBanner && (
        <CategoryBanner
          image={bannerImage}
          eyebrow="KhShop"
          title={group.name}
          subtitle={buildDescription(group.name, null)}
          ctaPath={group.path}
        />
      )}

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

      {showGroupBanner && (
        <ShopLayout
          title={`${group.name}'s Products`}
          description=""
          products={filterProductsByGroup(allProducts, group)}
          loading={loading}
          error={error}
          itemsPerPage={12}
          hideHeader
          categoryOptions={categoryOptions}
          categoryFilter={categoryMatches}
          filterData={filterData}
        />
      )}

      {category && (
        <ShopLayout
          title={`${group.name} ${category.name}`}
          description={buildDescription(group.name, category.name)}
          products={categoryProducts}
          loading={loading}
          error={error}
          itemsPerPage={12}
          hideHeader={false}
          filterData={filterData}
        />
      )}
    </main>
  );
}
