import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import AdminButton from './AdminButton';

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle size={20} className="text-red-600" />
        </span>
        <div>
          <p className="text-sm text-neutral-600">{message}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <AdminButton variant="secondary" onClick={onClose}>
          Cancel
        </AdminButton>
        <AdminButton
          variant="danger"
          onClick={() => onConfirm()}
          disabled={loading}
        >
          {loading ? 'Please wait...' : confirmLabel}
        </AdminButton>
      </div>
    </Modal>
  );
}
