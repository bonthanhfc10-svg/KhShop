import { X } from 'lucide-react';
import { AdminSidebarContent } from './AdminSidebar';

export default function MobileSidebar({ open, onClose, onLogout }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile sidebar"
      >
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-3 top-2 z-10 rounded-lg p-1.5 text-neutral-400 hover:bg-white/10"
        >
          <X size={18} />
        </button>
        <AdminSidebarContent onNavigate={onClose} onLogout={onLogout} />
      </aside>
    </>
  );
}
