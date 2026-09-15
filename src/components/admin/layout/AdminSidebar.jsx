import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
import { navGroups } from './navConfig';

export function AdminSidebarContent({ onNavigate, onLogout, collapsed = false }) {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState(() => {
    const initial = {};
    navGroups.forEach((group) => {
      if (group.expandable && group.children) {
        const isChildActive = group.children.some((child) =>
          child.end
            ? location.pathname === child.path
            : location.pathname.startsWith(child.path)
        );
        if (isChildActive) initial[group.label] = true;
      }
    });
    return initial;
  });

  const toggleGroup = (label) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex h-full flex-col bg-gray-700">
      {/* Logo / Brand */}
      <div
        className={`flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.08] px-5 ${
          collapsed ? 'justify-center px-0' : ''
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-600 text-sm font-black text-white shadow-lg shadow-gray-700/30">
          K
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-wide text-white">
              KHShop
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
              Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-5" aria-label="Admin navigation">
        {navGroups.map((group, gi) => {
          const isExpanded = expandedGroups[group.label] || false;
          return (
            <div key={group.label} className={gi > 0 ? 'mt-6' : ''}>
              {/* Group label */}
              {!collapsed && group.expandable ? (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="mb-2 flex w-full items-center justify-between px-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-400 transition-colors hover:text-slate-200"
                  aria-expanded={isExpanded}
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
              ) : !collapsed ? (
                <p className="mb-2 px-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                  {group.label}
                </p>
              ) : null}

              {/* Nav items */}
              {(!group.expandable || isExpanded || collapsed) && (
                <ul className="space-y-1">
                  {(group.expandable ? group.children : group.items).map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.end}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                            collapsed ? 'justify-center px-0' : ''
                          } ${
                            isActive
                              ? 'bg-[#25A9EB] text-white shadow-md shadow-[#25A9EB]/30'
                              : 'text-gray-300 hover:bg-white/[0.07] hover:text-white'
                          }`
                        }
                        title={collapsed ? item.label : undefined}
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon
                              size={18}
                              className={`shrink-0 ${isActive ? 'text-white' : ''}`}
                            />
                            {!collapsed && <span>{item.label}</span>}
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="shrink-0 border-t border-white/[0.08] p-3">
        <button
          onClick={onLogout}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400 ${
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
