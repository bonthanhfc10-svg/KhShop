import { useState } from 'react';
import { Heart, Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';
import { ColorSelector } from './ColorSelector';
import { useCart } from '../../../store/CartContext';
import { useWishlist } from '../../../store/WishlistContext';

export default function ProductDetails({ product, selectedColor, onColorChange }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const sizeOptions = product.sizes?.map((s) => s.name || s) || [];
  const hasSizes = sizeOptions.length > 0;
  const [selectedSize, setSelectedSize] = useState(hasSizes ? sizeOptions[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const wished = isInWishlist(product.id);

  const discount = product.discount;
  const selectedColorName = selectedColor?.name || null;
  const selectedColorImage = selectedColor?.image || product.images?.[0];

  const handleAddToCart = () => {
    if ((hasSizes && !selectedSize) || !selectedColorName) return;
    const selectedSizeObj = selectedColor?.sizes?.find((s) => s.name === selectedSize);
    addToCart(product, {
      variant_id: selectedSizeObj?.variant_id || null,
      size: selectedSize,
      color: selectedColorName,
      colorImage: selectedColorImage,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div>
      <h1 className="heading-display text-3xl sm:text-4xl">{product.name}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="font-sans text-3xl font-extrabold tracking-tight text-neutral-900">
          {formatPrice(product.price)}
        </span>
        {product.oldPrice && (
          <>
            <span className="text-lg text-neutral-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
            <span className="bg-accent px-2 py-0.5 text-xs font-bold tracking-wide text-white">
              Save {discount}%
            </span>
          </>
        )}
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-6">
        {/* Color */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-600">
              Color
            </span>
            <span className="text-sm text-neutral-900">
              {selectedColor?.name || 'Select a color'}
            </span>
          </div>
          <ColorSelector
            colors={product.colors}
            selectedId={selectedColor?.id}
            onColorChange={onColorChange}
          />
        </div>

        {/* Size */}
        <div className="mb-6">
          <div className="mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-600">
              Size
            </span>
          </div>
          {hasSizes ? (
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`min-w-12 border px-4 py-2.5 text-sm font-medium transition-colors ${
                    selectedSize === s
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-300 text-neutral-700 hover:border-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-sm text-neutral-500">No Size</span>
          )}
        </div>

        {/* Quantity */}
        <div className="mb-8">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-neutral-600">
            Quantity
          </span>
          <div className="inline-flex items-center border border-neutral-300">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-12 w-12 items-center justify-center text-neutral-600 hover:text-black"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center text-base font-medium" aria-live="polite">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="flex h-12 w-12 items-center justify-center text-neutral-600 hover:text-black"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          <span className="ml-4 text-sm text-neutral-500">
            {product.stock} in stock
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleAddToCart}
            disabled={(hasSizes && !selectedSize) || !selectedColorName}
            className="btn-primary flex-1 py-5"
          >
            {added ? (
              <>
                <Check size={18} /> Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag size={18} /> Add to Cart
              </>
            )}
          </button>
          <button
            onClick={() => toggleWishlist(product)}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`flex h-14 w-14 items-center justify-center border transition-colors ${
              wished
                ? 'border-accent bg-accent text-white'
                : 'border-neutral-300 text-neutral-600 hover:border-black hover:text-black'
            }`}
          >
            <Heart size={20} fill={wished ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-8 border-t border-neutral-200 pt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-600">
            Description
          </h2>
          <p className="text-[15px] leading-relaxed text-neutral-700">
            {product.description}
          </p>
        </div>
      )}

      <div className="mt-8 space-y-3 border-t border-neutral-200 pt-6 text-sm text-neutral-600">
        <p>✓ Free shipping on orders over $50</p>
        <p>✓ Easy 30-day returns</p>
        <p>✓ Secure checkout</p>
      </div>
    </div>
  );
}
