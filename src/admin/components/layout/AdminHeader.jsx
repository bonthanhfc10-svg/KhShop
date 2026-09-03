import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, ChevronDown, LogOut, Settings, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import Breadcrumbs from './Breadcrumbs';

export default function AdminHeader({
  crumbs,
  onToggleMobile,
  collapsed,
  onToggleCollapse,
  onSearch,
}) {
  const { admin, logout } = useAdminAuth();
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
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          aria-label="Toggle mobile menu"
          className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <button
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          className="hidden rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:block"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <div className="hidden md:block">
          <Breadcrumbs items={crumbs} />
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search..."
            aria-label="Global search"
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-64 rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:w-72 focus:border-neutral-300 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 rounded-lg p-1.5 pl-2 transition-colors hover:bg-neutral-100"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
              {initials || 'A'}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold leading-tight text-neutral-900">
                {admin?.name || 'Admin'}
              </span>
              <span className="block text-xs leading-tight text-neutral-400">Administrator</span>
            </span>
            <ChevronDown size={16} className="hidden text-neutral-400 sm:block" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
            >
              <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3">
                <p className="text-sm font-semibold text-neutral-900">{admin?.name}</p>
                <p className="truncate text-xs text-neutral-500">{admin?.email}</p>
              </div>
              <button
                role="menuitem"
                onClick={() => { setMenuOpen(false); navigate('/admin/customers'); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                <User size={16} /> Profile
              </button>
              <button
                role="menuitem"
                onClick={() => { setMenuOpen(false); navigate('/admin/settings'); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                <Settings size={16} /> Settings
              </button>
              <button
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 border-t border-neutral-100 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
