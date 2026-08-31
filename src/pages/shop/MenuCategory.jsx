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

function resolveProductTypes(categoryName) {
  const key = categoryName
    .toLowerCase()
    .replace('girl ', '')
    .replace('boy ', '')
    .replace('kids ', '');
  if (key.includes('shoe')) return ['shoes'];
  if (key.includes('accessor')) return ['accessories'];
  if (key.includes('sport')) return ['sport'];
  if (
    key.includes('cloth') ||
    key.includes('shirt') ||
    key.includes('pant')
  ) {
    return ['clothing'];
  }
  return ['shoes', 'clothing', 'accessories', 'sport'];
}

function buildHeading(group, category) {
  if (!category) return group.name.toUpperCase();
  const cat = category.name;

  if (group.name === 'Sport') {
    return cat.toUpperCase();
  }

  if (group.name === 'Kids') {
    const map = {
      'Girl Shoes': "GIRL'S SHOES",
      'Boy Shoes': "BOY'S SHOES",
      'Boy Clothing': "BOY'S CLOTHING",
      'Girl Clothing': "GIRL'S CLOTHING",
      'Kids Accessories': 'KIDS ACCESSORIES',
    };
    return map[cat] || cat.toUpperCase();
  }

  if (group.name === 'Sale') {
    const map = {
      Women: "WOMEN'S SALE",
      Men: "MEN'S SALE",
      'Boy Kids': 'BOY KIDS SALE',
      'Girl Kids': 'GIRL KIDS SALE',
      'Men Sport': "MEN'S SPORT SALE",
      'Women Sport': "WOMEN'S SPORT SALE",
    };
    return map[cat] || cat.toUpperCase();
  }

  return `${group.name.toUpperCase()}'S ${cat.toUpperCase()}`;
}

function buildDescription(group, category) {
  if (!category) return `Explore the ${group.name} collection at KhShop.`;
  return `Shop ${group.name.toLowerCase()} ${category.name.toLowerCase()} at KhShop. Premium quality, modern style.`;
}

function buildBreadcrumb(group, category) {
  const crumbs = [{ label: 'Home', path: '/' }];
  crumbs.push({ label: group.name, path: group.path });
  if (category) crumbs.push({ label: category.name, path: category.path });
  return crumbs;
}

function filterProducts(group, category) {
  const isSale = group.name === 'Sale';
  const gender = ['men', 'women'].includes(group.slug) ? group.slug : null;
  const types = category ? resolveProductTypes(category.name) : [];
  const baseIsSale = category ? isSale : group.name === 'Sale';

  let list = products.filter((p) => {
    if (gender && p.gender !== gender) return false;
    if (types.length && !types.includes(p.category)) return false;
    if (baseIsSale && !p.isSale) return false;
    return true;
  });

  // Sale subcategories by gender where applicable
  if (isSale && category) {
    const catLc = category.name.toLowerCase();
    let saleGender = null;
    if (catLc.startsWith('women') || catLc === 'women') saleGender = 'women';
    if (catLc.startsWith('men') || catLc === 'men') saleGender = 'men';
    if (saleGender) {
      list = list.filter((p) => p.gender === saleGender && p.isSale);
    } else {
      list = list.filter((p) => p.isSale);
    }
  }

  // Fallback so pages are never empty
  if (list.length === 0) {
    if (gender) list = products.filter((p) => p.gender === gender);
    else if (isSale) list = products.filter((p) => p.isSale);
    else list = products;
  }

  return list;
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
    const map = {};
    if (group) {
      group.categories.forEach((cat) => {
        map[cat.name] = new Set(
          filterProducts(group, cat).map((p) => p.id)
        );
      });
    }
    return (categoryName) => (product) =>
      map[categoryName] ? map[categoryName].has(product.id) : true;
  }, [group]);

  if (!group) return <NotFound />;

  const heading = buildHeading(group, category);
  const description = buildDescription(group, category);
  const categoryProducts = filterProducts(group, category);
  const itemsPerPage = category && category.name === 'Sport' ? 9 : 12;

  const groupBanner = !category ? GROUP_BANNERS[group.slug] : null;
  const showGroupBanner = Boolean(groupBanner);
  const sectionDescription = showGroupBanner ? '' : description;
  const categoryOptions = group.categories.map((c) => c.name);

  return (
    <main>
      {showGroupBanner && (
        <CategoryBanner
          image={groupBanner.image}
          eyebrow={groupBanner.eyebrow}
          title={groupBanner.title}
          ctaLabel="Explore The Collection"
          ctaPath={group.path}
        />
      )}

      <div className="container-kh pt-8">
        <nav
          className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500"
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

      <ShopLayout
        title={heading}
        description={sectionDescription}
        products={categoryProducts}
        fixedCategory={null}
        itemsPerPage={itemsPerPage}
        hideHeader={showGroupBanner}
        categoryOptions={categoryOptions}
        categoryFilter={categoryMatches}
      />
    </main>
  );
}
