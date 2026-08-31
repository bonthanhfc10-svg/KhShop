import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CategoryBanner({ image, eyebrow, title, subtitle, ctaLabel, ctaPath }) {
  return (
    <section className="relative flex min-h-[46vh] items-center overflow-hidden bg-neutral-950 sm:min-h-[52vh]">
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
      <div className="container-kh relative z-10 py-16">
        <div className="max-w-xl">
          {eyebrow && (
            <p className="eyebrow animate-fade-up text-neutral-300">{eyebrow}</p>
          )}
          <h1 className="heading-display mt-4 animate-fade-up text-5xl leading-[0.92] text-white [animation-delay:150ms] sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-md animate-fade-up text-base text-neutral-300 [animation-delay:300ms] sm:text-lg">
              {subtitle}
            </p>
          )}
          {ctaLabel && (
            <Link
              to={ctaPath}
              className="group mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white"
            >
              {ctaLabel}
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
