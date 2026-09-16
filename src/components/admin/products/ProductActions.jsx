import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const btnBase =
  'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors';

export default function ProductActions({ product, onDelete, className = '' }) {
  const navigate = useNavigate();

  return (
    <div className={`flex items-center justify-end gap-1.5 ${className}`}>
      <button
        onClick={() => navigate(`/admin/products/${product.id}`)}
        className={`${btnBase} border border-admin-border bg-admin-card-elevated text-slate-600 hover:bg-admin-surface-subtle hover:text-slate-900`}
        title="View"
      >
        <Eye size={12} />
        View
      </button>
      <button
        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
        className={`${btnBase} bg-[#25A9EB] text-white hover:bg-[#2098D3]`}
        title="Edit"
      >
        <Pencil size={12} />
        Edit
      </button>
      <button
        onClick={() => onDelete(product)}
        className={`${btnBase} bg-[#EF4444] text-white hover:bg-[#DC2626]`}
        title="Delete"
      >
        <Trash2 size={12} />
        Delete
      </button>
    </div>
  );
}
