import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Loader2 } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';
import { useWishlist } from '../../../store/WishlistContext';
import { useCart } from '../../../store/CartContext';

export default function WishlistItem({ wishlistItem, product }) {
  const { removeFromWishlist } = useWishlist();
  const { addToCart, addingToCart } = useCart();
  const [removing, setRemoving] = useState(false);

  const handleRemove = async (e) => {
    e.preventDefault();
    if (removing) return;
    setRemoving(true);
    await removeFromWishlist(wishlistItem.id);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (addingToCart) return;
    const firstSize = product.sizes?.[0];
    const sizeName = typeof firstSize === 'string' ? firstSize : firstSize?.name;
    await addToCart(product, {
      size: sizeName,
      color: product.colors?.[0]?.name,
      quantity: 1,
    });
  };

  return (
    <div className="group relative block">
      <Link to={`/product/${product.slug || product.id}`} className="card-image aspect-[4/5]">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <button
        onClick={handleRemove}
        disabled={removing}
        aria-label={`Remove ${product.name} from wishlist`}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-accent transition-transform hover:scale-110 disabled:pointer-events-none disabled:opacity-50"
      >
        {removing ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Heart size={18} fill="currentColor" />
        )}
      </button>
      <div className="pt-3">
        <Link to={`/product/${product.slug || product.id}`}>
          <h3 className="font-sans text-sm font-bold text-neutral-900 hover:underline">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm font-bold text-neutral-900">
          {formatPrice(product.price)}
          {product.oldPrice && (
            <span className="ml-2 text-sm text-neutral-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </p>
        <button
          onClick={handleAdd}
          disabled={addingToCart}
          className="btn-secondary mt-3 w-full py-2.5 text-[11px]"
        >
          {addingToCart ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ShoppingBag size={14} />
          )}
          {addingToCart ? 'Adding…' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
