import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductActions({ product, onDelete, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Product actions"
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
      >
        <MoreHorizontal size={17} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
        >
          <button
            role="menuitem"
            onClick={() => { setOpen(false); navigate(`/admin/products/${product.id}`); }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            <Eye size={15} /> View
          </button>
          <button
            role="menuitem"
            onClick={() => { setOpen(false); navigate(`/admin/products/${product.id}/edit`); }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            <Pencil size={15} /> Edit
          </button>
          <button
            role="menuitem"
            onClick={() => { setOpen(false); onDelete(product); }}
            className="flex w-full items-center gap-2.5 border-t border-neutral-100 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
