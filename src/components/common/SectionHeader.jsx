import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeader({
  eyebrow,
  title,
  linkTo,
  linkLabel = 'View All',
  align = 'start',
}) {
  return (
    <div
      className={`mb-10 flex items-end justify-between gap-6 ${
        align === 'center' ? 'flex-col items-center text-center' : ''
      }`}
    >
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="heading-display mt-2 text-3xl sm:text-4xl">{title}</h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="group hidden shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-neutral-900 transition-colors hover:text-neutral-500 sm:inline-flex"
          aria-label={linkLabel}
        >
          {linkLabel}
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}
