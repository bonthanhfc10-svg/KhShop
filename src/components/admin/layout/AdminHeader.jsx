import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, ChevronDown, LogOut, Settings, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import Breadcrumbs from './Breadcrumbs';

export default function AdminHeader({
  crumbs,
  onToggleMobile,
  collapsed,
  onToggleCollapse,
  onLogout,
}) {
  const { admin } = useAdminAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = (admin?.name || 'A')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between bg-slate-100 px-4 [box-shadow:0_3px_8px_rgba(0,0,0,0.12)] lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          aria-label="Toggle mobile menu"
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-admin-border/40 hover:text-slate-900 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <button
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          className="hidden rounded-lg p-2 text-slate-500 transition-colors hover:bg-admin-border/40 hover:text-slate-900 lg:block"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <div className="hidden md:block">
          <Breadcrumbs items={crumbs} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-admin-border/40 hover:text-slate-900"
        >
          <Bell size={19} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-admin-danger ring-2 ring-white" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-2 transition-colors hover:bg-admin-border/40"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-xs font-bold text-white shadow-sm shadow-sky-500/25">
              {initials || 'A'}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold leading-tight text-slate-800">
                {admin?.name || 'Admin'}
              </span>
              <span className="block text-xs leading-tight text-slate-500">Administrator</span>
            </span>
            <ChevronDown size={14} className={`hidden text-slate-400 sm:block transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-admin-border bg-admin-card-elevated shadow-xl shadow-black/10"
            >
              <div className="border-b border-admin-border-subtle bg-admin-surface-subtle px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{admin?.name}</p>
                <p className="truncate text-xs text-slate-500">{admin?.email}</p>
              </div>
              <div className="py-1.5">
                <button
                  role="menuitem"
                  onClick={() => { setMenuOpen(false); navigate('/admin/account'); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-admin-surface-subtle"
                >
                  <User size={15} className="text-slate-400" /> Profile
                </button>
                <button
                  role="menuitem"
                  onClick={() => { setMenuOpen(false); navigate('/admin/settings'); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-admin-surface-subtle"
                >
                  <Settings size={15} className="text-slate-400" /> Settings
                </button>
              </div>
              <div className="border-t border-admin-border-subtle py-1.5">
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
