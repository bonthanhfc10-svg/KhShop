import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in-overlay"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${sizes[size]} bg-white shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-neutral-900">
            {title}
          </h2>
          {showClose && (
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1 text-neutral-500 transition-colors hover:text-black"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
