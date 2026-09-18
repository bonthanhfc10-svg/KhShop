import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminButton from '../../../components/admin/common/AdminButton';
import Card from '../../../components/admin/common/Card';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import AdminLoading from '../../../components/common/Loading';
import { adminUserService } from '../../../services/admin/adminUserService';
import { formatDate } from '../../../utils/formatDate';

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await adminUserService.getById(id);
        setUser(data);
      } catch {
        setError('Failed to load user details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <AdminLoading />;

  if (error || !user) {
    return (
      <div className="space-y-5">
        <Link
          to="/admin/settings/admin-users"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft size={16} /> Back to admin users
        </Link>
        <div className="flex flex-col items-center py-16">
          <p className="text-sm text-red-600">{error || 'User not found'}</p>
          <AdminButton variant="secondary" className="mt-4" onClick={() => navigate('/admin/settings/admin-users')}>
            Go Back
          </AdminButton>
        </div>
      </div>
    );
  }

  const initials = user.name.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Details</h1>
          <p className="mt-1 text-sm text-slate-500">View and manage this user account.</p>
        </div>
        <div className="flex gap-2">
          <AdminButton
            variant="secondary"
            onClick={() => navigate(`/admin/settings/admin-users/${id}/edit`)}
          >
            Edit
          </AdminButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="User Profile" subtitle="Basic account information">
            <div className="p-5">
              <div className="flex items-center gap-4 mb-6">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 text-lg font-bold text-white">
                  {initials}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-500">Phone</p>
                  <p className="mt-1 text-sm text-slate-900">{user.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Email Verified</p>
                  <p className="mt-1 text-sm text-slate-900">{user.email_verified_at ? formatDate(user.email_verified_at) : 'Not verified'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={user.is_active ? 'Active' : 'Inactive'} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Joined</p>
                  <p className="mt-1 text-sm text-slate-900">{formatDate(user.created_at)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card title="Role & Access" subtitle="Assigned role and permissions">
            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs font-medium text-slate-500">Role</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{user.role?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Role ID</p>
                <p className="mt-1 text-sm text-slate-900">{user.role_id}</p>
              </div>
              <div className="rounded-lg border border-admin-border-subtle bg-admin-surface-subtle p-3">
                <p className="text-xs text-neutral-500">
                  {user.role?.name === 'Admin' || user.role?.name === 'SuperAdmin'
                    ? 'This user has full access to all dashboard features and settings.'
                    : 'This user can manage products, orders, and customers.'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
