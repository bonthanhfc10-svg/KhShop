import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function DetailBreadcrumb({ context = [], current }) {
  return (
    <nav
      className="mb-6 flex flex-wrap items-center gap-2 text-sm text-neutral-500"
      aria-label="Breadcrumb"
    >
      <Link to="/" className="transition-colors hover:text-black">
        Home
      </Link>
      {context.map((item, i) => (
        <span key={item.path} className="flex items-center gap-1.5">
          <ChevronRight size={12} />
          <Link to={item.path} className="transition-colors hover:text-black">
            {item.label}
          </Link>
        </span>
      ))}
      <ChevronRight size={12} />
      <span className="text-neutral-900">{current}</span>
    </nav>
  );
}
