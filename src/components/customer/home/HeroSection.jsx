import { Link } from 'react-router-dom';

const FALLBACK_IMAGE = '/images/banners/hero.svg';

export default function HeroSection({ banner = null }) {
  const image = banner?.image_path || FALLBACK_IMAGE;
  const title = banner?.title || 'Move\nDifferent.';
  const description =
    banner?.description ||
    'Premium shoes, clothing, accessories and sport gear engineered for those who lead. Built to move. Designed to stand out.';

  const titleLines = title.split('\n');

  return (
    <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-neutral-950 sm:min-h-[85vh] lg:min-h-[88vh]">
      <img
        src={image}
        alt={titleLines[0] || 'KhShop'}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />

      <div className="container-kh relative z-10 py-20">
        <div className="max-w-2xl">
          <h1 className="heading-display mt-5 animate-fade-up text-5xl leading-[0.92] text-white [animation-delay:150ms] sm:text-7xl lg:text-8xl">
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-md animate-fade-up text-base text-neutral-300 [animation-delay:300ms] sm:text-lg">
            {description}
          </p>
          <div className="mt-10 flex animate-fade-up flex-wrap gap-4 [animation-delay:450ms]">
            <Link
              to="/products?gender=men"
              className="btn-primary bg-white text-black hover:bg-neutral-200"
            >
              Shop Men
            </Link>
            <Link to="/products?gender=women" className="btn-outline-light">
              Shop Women
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
