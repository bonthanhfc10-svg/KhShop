import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { navGroups } from './navConfig';

export function AdminSidebarContent({ onNavigate, onLogout, collapsed = false }) {
  return (
    <div className="flex h-full flex-col bg-neutral-950">
      <div
        className={`flex h-16 shrink-0 items-center border-b border-white/10 px-5 ${
          collapsed ? 'justify-center px-0' : ''
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-950">
          <span className="text-sm font-black tracking-tight">K</span>
        </span>
        {!collapsed && (
          <div className="ml-3 min-w-0">
            <p className="truncate font-display text-sm font-bold uppercase leading-tight tracking-widest text-white">
              KHShop
            </p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
              Admin
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        collapsed ? 'justify-center px-0' : ''
                      } ${
                        isActive
                          ? 'bg-neutral-700 text-white'
                          : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                      }`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={18} className="shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <button
          onClick={onLogout}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-white ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({ collapsed = false, onNavigate, onLogout }) {
  return (
    <aside
      className={`hidden h-full flex-col transition-all duration-300 lg:flex ${
        collapsed ? 'w-[72px]' : 'w-60'
      }`}
      aria-label="Sidebar"
    >
      <AdminSidebarContent
        collapsed={collapsed}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
    </aside>
  );
}
