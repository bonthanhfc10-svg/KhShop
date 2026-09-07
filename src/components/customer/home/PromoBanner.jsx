import { Link } from 'react-router-dom';

export default function PromoBanner() {
  return (
    <section className="relative flex min-h-[50vh] items-center overflow-hidden bg-neutral-950 sm:min-h-[60vh]">
      <img
        src="/images/banners/promo.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="container-kh relative z-10 flex flex-col items-center text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-200">
          Limited Time
        </p>
        <h2 className="heading-display mt-3 text-5xl sm:text-6xl lg:text-7xl">
          Mid-Season Sale
        </h2>
        <p className="mt-3 text-sm uppercase tracking-widest text-neutral-200 sm:text-base">
          Up to 50% off select styles
        </p>
        <Link
          to="/shop/sale"
          className="btn-primary mt-8 bg-white text-black hover:bg-neutral-200"
        >
          Shop the Sale
        </Link>
      </div>
    </section>
  );
}
