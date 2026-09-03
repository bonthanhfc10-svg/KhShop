import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link to="/admin/dashboard" className="transition-colors hover:text-neutral-900">
            Admin
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRight size={14} className="text-neutral-300" />
              {isLast ? (
                <span className="font-medium text-neutral-900">{item.label}</span>
              ) : (
                <Link
                  to={item.path || '#'}
                  className="transition-colors hover:text-neutral-900"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
