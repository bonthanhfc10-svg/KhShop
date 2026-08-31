import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function InfoPage({ title, intro, children, crumb }) {
  return (
    <main className="container-kh py-12 sm:py-16">
      <nav
        className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="transition-colors hover:text-black">
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-neutral-900">{crumb || title}</span>
      </nav>

      <header className="max-w-2xl">
        <h1 className="heading-display text-3xl sm:text-4xl">{title}</h1>
        {intro && (
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
            {intro}
          </p>
        )}
      </header>

      <div className="mt-10 max-w-3xl">{children}</div>
    </main>
  );
}
