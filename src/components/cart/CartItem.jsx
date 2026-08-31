import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';

export default function CartItem({ item, onRemove, onUpdateQuantity }) {
  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 border-b border-neutral-200 py-5">
      <Link to={`/product/${item.id}`} className="block h-28 w-24 shrink-0 overflow-hidden bg-neutral-100">
        <img
          src={item.colorImage || item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              to={`/product/${item.id}`}
              className="font-display text-sm font-bold text-neutral-900 hover:underline"
            >
              {item.name}
            </Link>
            <p className="mt-0.5 text-xs text-neutral-500">{item.category}</p>
            <p className="mt-1 text-xs text-neutral-500">
              {item.size && <span className="mr-3">Size: {item.size}</span>}
              {item.color && <span>Color: {item.color}</span>}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.id, item.size, item.color)}
            className="p-1 text-neutral-400 transition-colors hover:text-accent"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center border border-neutral-300">
            <button
              onClick={() => onUpdateQuantity(item.id, item.size, item.color, item.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:text-black"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-medium" aria-live="polite">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.size, item.color, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:text-black"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="text-sm font-bold text-neutral-900">{formatPrice(lineTotal)}</p>
        </div>
      </div>
    </div>
  );
}
