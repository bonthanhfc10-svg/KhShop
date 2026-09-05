import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ShopLayout from '../../components/product/ShopLayout';
import CategoryBanner from '../../components/shop/CategoryBanner';
import NotFound from '../error/NotFound';
import { getNavGroup, getNavCategory } from '../../data/navigation';
import { products } from '../../data/products';
import menBanner from '../../assets/images/Menbanner.png';
import womenBanner from '../../assets/images/Womenbanner.png';
import kidsBanner from '../../assets/images/Kidsbanner.png';
import sportBanner from '../../assets/images/Sportbanner.png';

const GROUP_BANNERS = {
  men: { image: menBanner, eyebrow: 'KhShop', title: 'Men' },
  women: { image: womenBanner, eyebrow: 'KhShop', title: 'Women' },
  kids: { image: kidsBanner, eyebrow: 'KhShop', title: 'Kids' },
  sport: { image: sportBanner, eyebrow: 'KhShop', title: 'Sport' },
};

const SUBCATEGORY_IMAGES = {
  men: {
    Shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
    Clothing: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    Accessories: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
    Sport: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop',
  },
  women: {
    Shoes: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop',
    Clothing: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=500&fit=crop',
    Accessories: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop',
    Sport: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop',
  },
  kids: {
    'Girl Shoes': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=500&fit=crop',
    'Boy Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
    'Boy Clothing': 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop',
    'Girl Clothing': 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=500&fit=crop',
  },
  sport: {
    Running: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=500&fit=crop',
    Football: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=500&fit=crop',
    Training: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop',
    Volleyball: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=500&fit=crop',
  },
};

function buildDescription(group, category) {
  if (!category) return `${group.name} collection at KhShop. Modern style meets unbeatable prices for men and women. Premium quality, modern style, limited time only.`;
  return `${group.name} ${category.name} at KhShop. Modern style meets unbeatable prices for men and women. Premium quality, modern style, limited time only.`;
}

function filterProductsByGroup(group) {
  const gender = ['men', 'women'].includes(group.slug) ? group.slug : null;
  let list = products;
  if (gender) list = list.filter((p) => p.gender === gender);
  if (group.name === 'Sport') list = list.filter((p) => p.category === 'sport');
  if (list.length === 0) list = products;
  return list;
}

function resolveProductTypes(categoryName) {
  const key = categoryName.toLowerCase().replace('girl ', '').replace('boy ', '').replace('kids ', '');
  if (key.includes('shoe')) return ['shoes'];
  if (key.includes('accessor')) return ['accessories'];
  if (key.includes('sport')) return ['sport'];
  if (key.includes('cloth') || key.includes('shirt') || key.includes('pant')) return ['clothing'];
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
  const group = getNavGroup(groupSlug);
  const category = categorySlug
    ? getNavCategory(groupSlug, categorySlug)
    : null;

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
        products
          .filter((p) => {
            if (group.slug === 'men' && p.gender !== 'men') return false;
            if (group.slug === 'women' && p.gender !== 'women') return false;
            if (group.slug === 'sport' && p.category !== 'sport') return false;
            if (!types.includes(p.category)) return false;
            return true;
          })
          .map((p) => p.id)
      );
    });
    return (categoryName) => (product) =>
      map[categoryName] ? map[categoryName].has(product.id) : true;
  }, [group]);

  const categoryProducts = useMemo(() => {
    if (!group || !category) return [];
    const types = resolveProductTypes(category.name);
    let list = products;
    if (group.slug === 'men') list = list.filter((p) => p.gender === 'men');
    if (group.slug === 'women') list = list.filter((p) => p.gender === 'women');
    if (group.slug === 'sport') list = list.filter((p) => p.category === 'sport');
    if (types.length) list = list.filter((p) => types.includes(p.category));
    if (list.length === 0) list = filterProductsByGroup(group);
    return list;
  }, [category, group]);

  if (!group) return <NotFound />;

  const groupBanner = !category ? GROUP_BANNERS[group.slug] : null;
  const showGroupBanner = Boolean(groupBanner);
  const showSubcategories = showGroupBanner && group.categories.length > 0;
  const subcategoryImages = SUBCATEGORY_IMAGES[group.slug] || {};
  const groupProducts = filterProductsByGroup(group);
  const categoryOptions = group.categories.map((c) => c.name);

  return (
    <main>
      {showGroupBanner && (
        <CategoryBanner
          image={groupBanner.image}
          eyebrow={groupBanner.eyebrow}
          title={groupBanner.title}
          subtitle={buildDescription(group, category)}
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
                <Link to={c.path} className="transition-colors hover:text-black">
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
            {group.categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className="group relative block aspect-[3/4] overflow-hidden bg-neutral-100"
              >
                <img
                  src={subcategoryImages[cat.name] || ''}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
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
          products={groupProducts}
          itemsPerPage={12}
          hideHeader
          categoryOptions={categoryOptions}
          categoryFilter={categoryMatches}
        />
      )}

      {category && (
        <ShopLayout
          title={`${group.name} ${category.name}`}
          description={buildDescription(group, category)}
          products={categoryProducts}
          itemsPerPage={12}
          hideHeader={false}
        />
      )}
    </main>
  );
}
