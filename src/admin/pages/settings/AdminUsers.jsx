import { useState } from 'react';
import { Plus, Pencil, Trash2, Shield } from 'lucide-react';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import AdminButton from '../../components/common/AdminButton';

const initial = [
  { id: 1, name: 'Bonthanh', email: 'bonthanhfc10@gmail.com', role: 'admin', status: 'Active', lastLogin: 'Sep 03, 2026' },
  { id: 2, name: 'Sarah Miller', email: 'sarah@khshop.com', role: 'admin', status: 'Active', lastLogin: 'Sep 02, 2026' },
  { id: 3, name: 'Mike Chen', email: 'mike@khshop.com', role: 'staff', status: 'Active', lastLogin: 'Aug 29, 2026' },
  { id: 4, name: 'Emma Wilson', email: 'emma@khshop.com', role: 'staff', status: 'Inactive', lastLogin: 'Jul 15, 2026' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(initial);
  const [open, setOpen] = useState(false);

  const roleStyle = (role) =>
    role === 'admin'
      ? 'inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs font-medium text-white'
      : 'inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600';

  const remove = (id) => setUsers((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Admin Users</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage administrator and staff accounts.</p>
        </div>
        <AdminButton onClick={() => setOpen(true)}><Plus size={16} /> Add User</AdminButton>
      </div>

      <Card bodyClassName="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/60 text-xs uppercase tracking-wider text-neutral-500">
              <th className="px-5 py-3 font-semibold">User</th>
              <th className="px-5 py-3 font-semibold">Email</th>
              <th className="px-5 py-3 font-semibold">Role</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Last Login</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                      {u.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                    <span className="font-medium text-neutral-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-neutral-500">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={roleStyle(u.role)}>
                    {u.role === 'admin' && <Shield size={12} />}
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3"><StatusBadge status={u.status} /></td>
                <td className="px-5 py-3 text-neutral-500">{u.lastLogin}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <button aria-label="Edit user" className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => remove(u.id)} aria-label="Delete user" className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Admin User">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Name</label>
            <input className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Email</label>
            <input type="email" className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Role</label>
            <select className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400">
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <AdminButton variant="secondary" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={() => setOpen(false)}>Create User</AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
