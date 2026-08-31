import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-neutral-950 sm:min-h-[85vh] lg:min-h-[88vh]">
      <img
        src="/images/banners/hero.svg"
        alt="KhShop new season collection"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />

      <div className="container-kh relative z-10 py-20">
        <div className="max-w-2xl">
          <p className="eyebrow animate-fade-up text-neutral-300">
            New Season · New Arrivals
          </p>
          <h1 className="heading-display mt-5 animate-fade-up text-5xl leading-[0.92] text-white [animation-delay:150ms] sm:text-7xl lg:text-8xl">
            Move
            <br />
            Different.
          </h1>
          <p className="mt-6 max-w-md animate-fade-up text-base text-neutral-300 [animation-delay:300ms] sm:text-lg">
            Premium shoes, clothing, accessories and sport gear engineered for those who lead.
            Built to move. Designed to stand out.
          </p>
          <div className="mt-10 flex animate-fade-up flex-wrap gap-4 [animation-delay:450ms]">
            <Link
              to="/shop?gender=men"
              className="btn-primary bg-white text-black hover:bg-neutral-200"
            >
              Shop Men
            </Link>
            <Link to="/shop?gender=women" className="btn-outline-light">
              Shop Women
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
