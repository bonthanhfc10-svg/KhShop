import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/layout/AdminSidebar';
import AdminHeader from '../components/admin/layout/AdminHeader';
import MobileSidebar from '../components/admin/layout/MobileSidebar';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function AdminLayout({ crumbs = [] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AdminSidebar
        collapsed={collapsed}
        onNavigate={() => {}}
        onLogout={handleLogout}
      />
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <AdminHeader
          crumbs={crumbs}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          onToggleMobile={() => setMobileOpen((o) => !o)}
        />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl p-3 pt-3 lg:p-4 lg:pt-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
