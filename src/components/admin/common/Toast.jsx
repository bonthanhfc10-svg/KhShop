import { CheckCircle, X } from 'lucide-react';

export default function Toast({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 top-4 z-[200] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 rounded-lg bg-[#22C55E] px-4 py-3 shadow-lg animate-slide-in"
        >
          <CheckCircle size={18} className="shrink-0 text-white" />
          <span className="text-sm font-medium text-white">{t.message}</span>
          <button
            onClick={() => onRemove(t.id)}
            className="ml-2 shrink-0 rounded p-0.5 text-white/70 transition-colors hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
