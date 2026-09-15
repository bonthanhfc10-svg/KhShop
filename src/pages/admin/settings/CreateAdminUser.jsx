import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminButton from '../../../components/admin/common/AdminButton';
import Card from '../../../components/admin/common/Card';

export default function CreateAdminUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', role: 'staff' });

  const handleSave = () => {
    navigate('/admin/settings/admin-users', { state: { toast: 'Created successfully' } });
  };

  const inputCls = 'w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15';
  const labelCls = 'mb-1.5 block text-sm font-medium text-neutral-700';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/settings/admin-users"
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft size={16} /> Back to admin users
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Admin User</h1>
          <p className="mt-1 text-sm text-slate-500">Create a new administrator or staff account.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="User Information" subtitle="Account details for the new user">
            <div className="p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. John Smith"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputCls}
                    placeholder="user@example.com"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card title="Role & Access" subtitle="Assign a role to this user">
            <div className="space-y-4 p-5">
              <div>
                <label className={labelCls}>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={inputCls}
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="rounded-lg border border-admin-border-subtle bg-admin-surface-subtle p-3">
                <p className="text-xs text-neutral-500">
                  {form.role === 'admin'
                    ? 'Admins have full access to all dashboard features and settings.'
                    : 'Staff members can manage products, orders, and customers but cannot access settings.'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-admin-border pt-6">
        <AdminButton variant="secondary" onClick={() => navigate('/admin/settings/admin-users')}>Cancel</AdminButton>
        <AdminButton variant="success" onClick={handleSave}>Create User</AdminButton>
      </div>
    </div>
  );
}
