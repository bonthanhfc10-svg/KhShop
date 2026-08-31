import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

export default function CategorySection() {
  return (
    <section className="section-pad container-kh">
      <SectionHeader eyebrow="Curated for you" title="Shop By Category" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop/${cat.slug}`}
            className="group relative block overflow-hidden bg-neutral-100"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
                {cat.name}
              </h3>
              <p className="mt-1.5 text-sm text-neutral-300">{cat.count} styles</p>
              <span className="mt-4 inline-flex items-center gap-2 border-b border-white pb-1 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 group-hover:gap-3">
                Shop Now <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
