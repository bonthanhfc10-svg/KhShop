import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function MegaMenu({ group, onNavigate }) {
  return (
    <div
      className="absolute left-1/2 top-full z-50 w-[min(100%_-_40px,1200px)] animate-mega-in border border-neutral-200 bg-white shadow-xl"
      role="menu"
      aria-label={`${group.name} menu`}
    >
      <div className="flex flex-col items-center px-8 py-10 text-center sm:px-14">
        <Link
          to={group.path}
          onClick={onNavigate}
          className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-black"
        >
          {group.featureTitle || `Shop ${group.name}`}
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <div className="mt-7 flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-12 gap-y-4 border-t border-neutral-100 pt-7">
          {group.categories.map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              onClick={onNavigate}
              className="text-sm font-medium text-neutral-700 transition-colors hover:text-black"
              role="menuitem"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
