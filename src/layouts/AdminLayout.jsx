import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/layout/AdminSidebar';
import AdminHeader from '../components/admin/layout/AdminHeader';
import MobileSidebar from '../components/admin/layout/MobileSidebar';
import ConfirmModal from '../components/admin/common/ConfirmModal';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function AdminLayout({ crumbs = [] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { logout, loggingOut } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setConfirmOpen(true);
  };

  const handleConfirmLogout = async () => {
    await logout();
    setConfirmOpen(false);
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AdminSidebar
        collapsed={collapsed}
        onNavigate={() => {}}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <AdminHeader
          crumbs={crumbs}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          onToggleMobile={() => setMobileOpen((o) => !o)}
          onLogout={handleLogout}
        />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl p-3 pt-3 lg:p-4 lg:pt-4">
            <Outlet />
          </div>
        </main>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        loading={loggingOut}
      />
    </div>
  );
}
