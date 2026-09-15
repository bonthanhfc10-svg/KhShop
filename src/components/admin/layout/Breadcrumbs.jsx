import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link to="/admin/dashboard" className="transition-colors hover:text-slate-900">
            Admin
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRight size={13} className="text-slate-300" />
              {isLast ? (
                <span className="font-medium text-slate-800">{item.label}</span>
              ) : (
                <Link
                  to={item.path || '#'}
                  className="transition-colors hover:text-slate-900"
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
