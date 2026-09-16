import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, Plus } from 'lucide-react';
import AdminButton from '../../../components/admin/common/AdminButton';
import AdminActionButtons from '../../../components/admin/common/AdminActionButtons';
import ConfirmModal from '../../../components/admin/common/ConfirmModal';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import Toast from '../../../components/admin/common/Toast';
import useToast from '../../../hooks/useToast';

const initial = [
  { id: 1, name: 'Bonthanh', email: 'bonthanhfc10@gmail.com', role: 'admin', status: 'Active', lastLogin: 'Sep 03, 2026' },
  { id: 2, name: 'Sarah Miller', email: 'sarah@khshop.com', role: 'admin', status: 'Active', lastLogin: 'Sep 02, 2026' },
  { id: 3, name: 'Mike Chen', email: 'mike@khshop.com', role: 'staff', status: 'Active', lastLogin: 'Aug 29, 2026' },
  { id: 4, name: 'Emma Wilson', email: 'emma@khshop.com', role: 'staff', status: 'Inactive', lastLogin: 'Jul 15, 2026' },
];

export default function AdminUsers() {
  const location = useLocation();
  const [users, setUsers] = useState(initial);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toasts, show, remove } = useToast();

  useEffect(() => {
    if (location.state?.toast) {
      show(location.state.toast);
      window.history.replaceState({}, '');
    }
  }, []);

  const roleStyle = (role) =>
    role === 'admin'
      ? 'inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs font-medium text-white'
      : 'inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600';

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((x) => x.id !== id));
    setDeleteTarget(null);
    show('Deleted successfully');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage administrator and staff accounts &middot; {users.length} users
          </p>
        </div>
        <AdminButton to="/admin/settings/admin-users/create" variant="success">
          <Plus size={16} /> Add User
        </AdminButton>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-admin-border bg-admin-table-header">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Last Login</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border-subtle">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-admin-primary-light/20">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                        {u.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={roleStyle(u.role)}>
                      {u.role === 'admin' && <Shield size={12} />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{u.lastLogin}</td>
                  <td className="px-5 py-3.5">
                    <AdminActionButtons
                      onDelete={() => setDeleteTarget(u)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-admin-border-subtle md:hidden">
          {users.map((u) => (
            <div key={u.id} className="p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                  {u.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{u.name}</p>
                  <p className="truncate text-xs text-slate-400">{u.email}</p>
                </div>
                <StatusBadge status={u.status} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-500">{u.role} &middot; Last login: {u.lastLogin}</span>
                <AdminActionButtons
                  onDelete={() => setDeleteTarget(u)}
                />
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-semibold text-slate-700">No admin users found</p>
            <p className="mt-1 text-sm text-slate-400">Get started by adding a user.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete User?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />

      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}
