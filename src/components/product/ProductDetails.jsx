import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, Zap, Check } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { Rating } from './Rating';
import { ColorSelector } from './ColorSelector';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Modal from '../common/Modal';

const SIZE_GUIDE = [
  { size: 'S', body: '34–36"', chest: '34–37"', waist: '28–31"' },
  { size: 'M', body: '37–39"', chest: '38–41"', waist: '32–35"' },
  { size: 'L', body: '40–42"', chest: '42–45"', waist: '36–39"' },
  { size: 'XL', body: '43–46"', chest: '46–49"', waist: '40–43"' },
  { size: 'XXL', body: '47–50"', chest: '50–53"', waist: '44–47"' },
];

export default function ProductDetails({ product, selectedColor, onColorChange }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const wished = isInWishlist(product.id);

  const discount = product.discount;
  const selectedColorName = selectedColor?.name || null;
  const selectedColorImage = selectedColor?.image || product.images?.[0];

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColorName) return;
    addToCart(product, {
      size: selectedSize,
      color: selectedColorName,
      colorImage: selectedColorImage,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColorName) return;
    addToCart(product, {
      size: selectedSize,
      color: selectedColorName,
      colorImage: selectedColorImage,
      quantity,
    });
    navigate('/checkout');
  };

  return (
    <div>
      <p className="eyebrow">{product.categoryName}</p>
      <h1 className="heading-display mt-2 text-3xl sm:text-4xl">{product.name}</h1>

      <div className="mt-3">
        <Rating rating={product.rating} reviews={product.reviews} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="font-display text-3xl font-extrabold tracking-tight text-neutral-900">
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
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-600">
              Size
            </span>
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="text-xs font-semibold text-neutral-500 underline underline-offset-2 hover:text-black"
            >
              Size guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
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
            disabled={!selectedSize || !selectedColorName}
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
            onClick={handleBuyNow}
            disabled={!selectedSize || !selectedColorName}
            className="btn-secondary flex-1 py-5"
          >
            <Zap size={18} /> Buy Now
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

      <div className="mt-8 space-y-3 border-t border-neutral-200 pt-6 text-sm text-neutral-600">
        <p>✓ Free shipping on orders over $50</p>
        <p>✓ Easy 30-day returns</p>
        <p>✓ Secure checkout</p>
      </div>

      <Modal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        title="Size Guide"
        size="md"
      >
        <div className="overflow-hidden border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-neutral-50 text-xs font-bold uppercase tracking-widest text-neutral-600">
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Body</th>
                <th className="px-4 py-3">Chest</th>
                <th className="px-4 py-3">Waist</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map((r) => (
                <tr key={r.size} className="border-t border-neutral-100">
                  <td className="px-4 py-3 font-semibold text-neutral-900">{r.size}</td>
                  <td className="px-4 py-3 text-neutral-600">{r.body}</td>
                  <td className="px-4 py-3 text-neutral-600">{r.chest}</td>
                  <td className="px-4 py-3 text-neutral-600">{r.waist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-neutral-500">
          Measurements are body measurements. If your measurements fall between
          sizes, we recommend sizing up for a more relaxed fit.
        </p>
      </Modal>
    </div>
  );
}
