import { Pencil, Trash2 } from 'lucide-react';

const btnBase =
  'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors';

export default function AdminActionButtons({
  onEdit,
  onDelete,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  className = '',
}) {
  return (
    <div className={`flex items-center justify-end gap-1.5 ${className}`}>
      {onEdit && (
        <button
          onClick={onEdit}
          className={`${btnBase} bg-[#25A9EB] text-white hover:bg-[#2098D3]`}
        >
          <Pencil size={12} />
          {editLabel}
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className={`${btnBase} bg-[#EF4444] text-white hover:bg-[#DC2626]`}
        >
          <Trash2 size={12} />
          {deleteLabel}
        </button>
      )}
    </div>
  );
}
