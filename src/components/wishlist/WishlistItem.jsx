import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export default function WishlistItem({ product }) {
  const { removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemove = (e) => {
    e.preventDefault();
    removeFromWishlist(product.id);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product, {
      size: product.sizes[0],
      color: product.colors[0]?.name,
      quantity: 1,
    });
  };

  return (
    <div className="group relative block">
      <Link to={`/product/${product.id}`} className="card-image aspect-[4/5]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <button
        onClick={handleRemove}
        aria-label={`Remove ${product.name} from wishlist`}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-accent transition-transform hover:scale-110"
      >
        <Heart size={18} fill="currentColor" />
      </button>
      <div className="pt-3">
        <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-500">
          {product.categoryName}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1 font-display text-sm font-bold text-neutral-900 hover:underline">
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
        <button onClick={handleAdd} className="btn-secondary mt-3 w-full py-2.5 text-[11px]">
          <ShoppingBag size={14} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
