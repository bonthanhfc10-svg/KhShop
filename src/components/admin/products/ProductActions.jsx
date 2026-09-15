import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductActions({ product, onDelete, className = '' }) {
  const navigate = useNavigate();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => navigate(`/admin/products/${product.id}`)}
        aria-label="View product"
        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-admin-primary-light hover:text-admin-primary"
        title="View"
      >
        <Eye size={15} />
      </button>
      <button
        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
        aria-label="Edit product"
        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
        title="Edit"
      >
        <Pencil size={15} />
      </button>
      <button
        onClick={() => onDelete(product)}
        aria-label="Delete product"
        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
        title="Delete"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
