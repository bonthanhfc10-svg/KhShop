import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [selectedColor] = useState(product.colors?.[0]?.name || null);
  const [showSizes, setShowSizes] = useState(false);
  const [added, setAdded] = useState(false);
  const wished = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!selectedSize || !selectedColor) return;
    addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative block"
      onMouseLeave={() => setShowSizes(false)}
    >
      <div className="card-image aspect-[4/5]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:opacity-0"
          loading="lazy"
        />
        <img
          src={product.hoverImage || product.images[1] || product.images[0]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
          loading="lazy"
        />

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
          {product.isSale && product.discount > 0 && (
            <span className="bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
              -{product.discount}%
            </span>
          )}
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

        {/* quick add */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-14 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          {showSizes ? (
            <div className="bg-white p-3 shadow-xl">
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Select size
              </p>
              <div className="grid grid-cols-4 gap-1">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedSize(s);
                      handleQuickAdd(e);
                    }}
                    className={`border py-1.5 text-xs font-medium transition-colors ${
                      selectedSize === s
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-300 text-neutral-700 hover:border-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                if (product.sizes.length > 1) {
                  setShowSizes(true);
                } else {
                  handleQuickAdd(e);
                }
              }}
              className="flex w-full items-center justify-center gap-2 bg-black py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-800"
            >
              <ShoppingBag size={15} />
              {added ? 'Added!' : 'Quick Add'}
            </button>
          )}
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
    </Link>
  );
}
