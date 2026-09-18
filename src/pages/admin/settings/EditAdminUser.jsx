import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminButton from '../../../components/admin/common/AdminButton';
import Card from '../../../components/admin/common/Card';
import Toast from '../../../components/admin/common/Toast';
import AdminLoading from '../../../components/common/Loading';
import useToast from '../../../hooks/useToast';
import { adminUserService } from '../../../services/admin/adminUserService';

export default function EditAdminUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, show } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role_id: '',
    is_active: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const user = await adminUserService.getById(id);
        if (user) {
          setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            password: '',
            role_id: user.role_id?.toString() || '',
            is_active: user.is_active,
          });
        }
      } catch {
        show('Failed to load user', 'error');
        navigate('/admin/settings/admin-users');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setErrors({});
    try {
      const payload = {};
      if (form.name) payload.name = form.name;
      if (form.email) payload.email = form.email;
      if (form.phone !== undefined) payload.phone = form.phone || null;
      if (form.password) payload.password = form.password;
      if (form.role_id) payload.role_id = Number(form.role_id);
      payload.is_active = form.is_active;

      await adminUserService.update(id, payload);
      show('User updated successfully');
      setTimeout(() => navigate('/admin/settings/admin-users', { state: { toast: 'User updated successfully' } }), 500);
    } catch (err) {
      const responseErrors = err?.response?.data?.errors;
      if (responseErrors) {
        const flat = {};
        Object.keys(responseErrors).forEach((k) => {
          flat[k] = responseErrors[k][0];
        });
        setErrors(flat);
      } else {
        show(err?.response?.data?.message || 'Failed to update user', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15';
  const labelCls = 'mb-1.5 block text-sm font-medium text-neutral-700';
  const errorCls = 'mt-1 text-xs text-red-500';

  if (loading) return <AdminLoading />;

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit User</h1>
          <p className="mt-1 text-sm text-slate-500">Update user account details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="User Information" subtitle="Account details">
            <div className="p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="e.g. John Smith"
                  />
                  {errors.name && <p className={errorCls}>{errors.name}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="user@example.com"
                  />
                  {errors.email && <p className={errorCls}>{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Phone (optional)</label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="012 345 6789"
                  />
                  {errors.phone && <p className={errorCls}>{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Password (leave blank to keep current)</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Min 8 characters"
                  />
                  {errors.password && <p className={errorCls}>{errors.password}</p>}
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
                  name="role_id"
                  value={form.role_id}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="">Select a role</option>
                  <option value="2">Admin</option>
                  <option value="3">Staff</option>
                </select>
                {errors.role_id && <p className={errorCls}>{errors.role_id}</p>}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 accent-[#25A9EB]"
                />
                <label className="text-sm font-medium text-neutral-700">Active</label>
              </div>
              <div className="rounded-lg border border-admin-border-subtle bg-admin-surface-subtle p-3">
                <p className="text-xs text-neutral-500">
                  {form.role_id === '2'
                    ? 'Admins have full access to all dashboard features and settings.'
                    : form.role_id === '3'
                    ? 'Staff members can manage products, orders, and customers but cannot access settings.'
                    : 'Select a role to see what this user can access.'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-admin-border pt-6">
        <AdminButton variant="cancel" onClick={() => navigate('/admin/settings/admin-users')}>Cancel</AdminButton>
        <AdminButton variant="success" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </AdminButton>
      </div>

      <Toast toasts={toasts} onRemove={(id) => {}} />
    </div>
  );
}
