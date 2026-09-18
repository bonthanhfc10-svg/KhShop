import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Loader2 } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';
import { colorCountText } from '../../../utils/colorCount';
import { useWishlist } from '../../../store/WishlistContext';

export default function ProductCard({ product, breadcrumbContext, onRemove }) {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist, togglingWishlistId } = useWishlist();
  const wished = isInWishlist(product.id);
  const isLoading = togglingWishlistId === product.id;

  return (
    <div className="group relative block rounded-lg bg-white p-4 shadow-md">
      <div className="card-image aspect-[4/5]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 m-auto h-[85%] w-[85%] object-contain"
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
            if (!isLoading) toggleWishlist(product);
          }}
          disabled={isLoading}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-md disabled:pointer-events-none disabled:opacity-50 ${
            wished ? 'border-accent text-accent' : 'border-neutral-200 text-neutral-600'
          }`}
        >
          {isLoading ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <Heart size={17} fill={wished ? 'currentColor' : 'none'} />
          )}
        </button>

        {/* remove button — only shown on Wishlist page */}
        {onRemove && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onRemove(product);
            }}
            aria-label={`Remove ${product.name}`}
            className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white/90 backdrop-blur-sm text-neutral-600 transition-all duration-200 hover:scale-110 hover:border-accent hover:text-accent hover:shadow-md"
          >
            <Trash2 size={15} />
          </button>
        )}

        {/* view button */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-14 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => navigate(`/${product.slug}`, { state: { breadcrumbContext } })}
            className="flex w-full items-center justify-center gap-2 bg-black py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-800"
          >
            View
          </button>
        </div>
      </div>

      {/* info */}
      <div className="pt-4">
        <h3 className="font-sans text-sm font-bold leading-snug text-neutral-900 sm:text-[15px]">
          {product.name}
        </h3>

        <div className="mt-2.5 flex items-center gap-2.5">
          <p className="font-sans text-base font-extrabold text-neutral-900">
            {formatPrice(product.price)}
          </p>
          {product.oldPrice && (
            <p className="text-sm text-neutral-400 line-through">
              {formatPrice(product.oldPrice)}
            </p>
          )}
        </div>

        <div className="mt-2.5">
          {(() => {
            const text = colorCountText(product.colors);
            return text ? (
              <span className="text-xs text-neutral-500">{text}</span>
            ) : null;
          })()}
        </div>
      </div>
    </div>
  );
}
