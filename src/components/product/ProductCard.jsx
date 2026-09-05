import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wished = isInWishlist(product.id);

  return (
    <div className="group relative block">
      <div className="card-image aspect-[4/5]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
          {product.isNew && (
            <span className="bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              New
            </span>
          )}
        </div>

        {/* wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-md ${
            wished ? 'border-accent text-accent' : 'border-neutral-200 text-neutral-600'
          }`}
        >
          <Heart size={17} fill={wished ? 'currentColor' : 'none'} />
        </button>

        {/* view button */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-14 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex w-full items-center justify-center gap-2 bg-black py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-800"
          >
            View
          </button>
        </div>
      </div>

      {/* info */}
      <div className="pt-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-500">
            {product.categoryName}
          </p>
          <div className="flex items-center gap-1" aria-label={`Rated ${product.rating} out of 5`}>
            <Star size={12} className="fill-current text-accent" />
            <span className="text-xs font-semibold text-neutral-700">{product.rating}</span>
          </div>
        </div>
        <h3 className="mt-1.5 font-display text-sm font-bold leading-snug text-neutral-900 sm:text-[15px]">
          {product.name}
        </h3>

        <div className="mt-2.5 flex items-center gap-2.5">
          <p className="font-display text-base font-extrabold text-neutral-900">
            {formatPrice(product.price)}
          </p>
          {product.oldPrice && (
            <p className="text-sm text-neutral-400 line-through">
              {formatPrice(product.oldPrice)}
            </p>
          )}
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c.id != null ? c.id : c.name}
              className="inline-block h-5 w-5 overflow-hidden border border-neutral-200"
              aria-label={c.name}
              title={c.name}
            >
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </span>
          ))}
          {product.colors.length > 4 && (
            <span className="pl-0.5 text-[10px] font-semibold text-neutral-500">
              +{product.colors.length - 4}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
