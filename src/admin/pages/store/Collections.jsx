import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import AdminButton from '../../components/common/AdminButton';

const initial = [
  { id: 1, name: 'Men', slug: 'men', image: '/images/categories/shoes.svg', products: 45, status: 'Active', featured: true },
  { id: 2, name: 'Women', slug: 'women', image: '/images/categories/clothing.svg', products: 52, status: 'Active', featured: true },
  { id: 3, name: 'Kids', slug: 'kids', image: '/images/categories/accessories.svg', products: 38, status: 'Active', featured: false },
  { id: 4, name: 'Sport', slug: 'sport', image: '/images/categories/sport.svg', products: 27, status: 'Active', featured: true },
  { id: 5, name: 'Sale', slug: 'sale', image: '/images/categories/pants.svg', products: 61, status: 'Active', featured: true },
  { id: 6, name: 'Featured Products', slug: 'featured', image: '/images/categories/shirts.svg', products: 12, status: 'Active', featured: false },
];

export default function Collections() {
  const [collections, setCollections] = useState(initial);

  const use = (b) => {
    switch (b) {
      case '/images/categories/shoes.svg': return ['Running', 'Football', 'Training', 'Volleyball'];
      case '/images/categories/clothing.svg': return ['Shirt', 'Shoes', 'Clothing', 'Accessories', 'Sport'];
      case '/images/categories/accessories.svg': return ['Girl Shoes', 'Boy Shoes', 'Boy Clothing', 'Girl Clothing', 'Kids Accessories'];
      case '/images/categories/sport.svg': return ['Running', 'Football', 'Training', 'Volleyball'];
      case '/images/categories/pants.svg': return ['Women', 'Men', 'Boy Kids', 'Girl Kids', 'Men Sport', 'Women Sport'];
      case '/images/categories/shirts.svg': return ['Best Sellers', 'New Arrivals', 'On Sale'];
      default: return [];
    }
  };

  const remove = (id) => setCollections((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Collections</h1>
          <p className="mt-1 text-sm text-neutral-500">Featured collections shown on the storefront.</p>
        </div>
        <AdminButton><Plus size={16} /> Add Collection</AdminButton>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {collections.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            <div className="relative h-36 w-full">
              <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3"><StatusBadge status={c.status} /></span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-neutral-900">{c.name}</h3>
                  <p className="text-xs text-neutral-400">/{c.slug}</p>
                </div>
                <div className="flex gap-1">
                  <button aria-label="Edit collection" className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => remove(c.id)} aria-label="Delete collection" className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {use(c.image).map((t) => (
                  <span key={t} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-sm">
                <span className="text-neutral-500">{c.products} products</span>
                {c.featured && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900">
                    ★ Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
