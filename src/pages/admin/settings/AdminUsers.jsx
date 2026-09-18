import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, Shield } from 'lucide-react';
import SearchInput from '../../../components/admin/common/SearchInput';
import AdminButton from '../../../components/admin/common/AdminButton';
import AdminActionButtons from '../../../components/admin/common/AdminActionButtons';
import ConfirmModal from '../../../components/admin/common/ConfirmModal';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import Toast from '../../../components/admin/common/Toast';
import AdminLoading from '../../../components/common/Loading';
import Pagination from '../../../components/common/Pagination';
import useToast from '../../../hooks/useToast';
import { useAdminUsers } from '../../../hooks/useAdminUsers';
import { adminUserService } from '../../../services/admin/adminUserService';
import { useAdminAuth } from '../../../store/AdminAuthContext';
import { formatDate } from '../../../utils/formatDate';

const STATUS_FILTERS = ['all', 'active', 'inactive'];

export default function AdminUsers() {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin } = useAdminAuth();
  const {
    users,
    loading,
    error,
    pagination,
    filters,
    goToPage,
    changePerPage,
    applyFilters,
    reload,
  } = useAdminUsers();

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [statusFilter, setStatusFilter] = useState(filters.is_active || 'all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toasts, show, remove } = useToast();

  useEffect(() => {
    if (location.state?.toast) {
      show(location.state.toast);
      window.history.replaceState({}, '');
    }
  }, []);

  const handleSearchCommit = useCallback(() => {
    applyFilters({
      ...filters,
      search: localSearch,
      is_active: statusFilter,
    });
  }, [localSearch, statusFilter, filters, applyFilters]);

  const handleStatusChange = useCallback((key) => {
    setStatusFilter(key);
    applyFilters({ ...filters, is_active: key, search: localSearch });
  }, [filters, localSearch, applyFilters]);

  const handlePerPageChange = useCallback((e) => {
    changePerPage(Number(e.target.value));
  }, [changePerPage]);

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await adminUserService.remove(deleteTarget.id);
      setDeleteTarget(null);
      show('User deleted successfully');
      reload();
    } catch (err) {
      show(err?.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const roleStyle = (roleName) => {
    if (!roleName) return 'bg-slate-100 text-slate-600';
    const name = roleName.toLowerCase();
    if (name === 'admin' || name === 'superadmin') {
      return 'bg-neutral-900 text-white';
    }
    return 'bg-neutral-100 text-neutral-600';
  };

  const initials = (n) =>
    n.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();

  if (loading) return <AdminLoading />;

  if (error) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Users</h1>
          <p className="mt-1 text-sm text-slate-500">Manage administrator and staff accounts</p>
        </div>
        <div className="flex flex-col items-center py-16">
          <p className="text-sm text-red-600">{error}</p>
          <AdminButton variant="secondary" className="mt-4" onClick={() => applyFilters(filters)}>
            Retry
          </AdminButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage administrator and staff accounts &middot; {pagination.total} users
          </p>
        </div>
        <AdminButton to="/admin/settings/admin-users/create" variant="success">
          <Plus size={16} /> Add User
        </AdminButton>
      </div>

      {/* Search + Status Filters */}
      <div className="flex flex-col gap-3 rounded-lg border border-admin-border bg-admin-card p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2">
          <SearchInput
            value={localSearch}
            onChange={setLocalSearch}
            onCommit={handleSearchCommit}
            placeholder="Search by name, email, or phone..."
          />
          <AdminButton variant="primary" size="sm" onClick={handleSearchCommit}>
            <Search size={14} /> Search
          </AdminButton>
        </div>
        <div className="flex gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                statusFilter === s ? 'bg-[#25A9EB] text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-admin-border bg-admin-table-header">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Phone</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Joined</th>
                <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border-subtle">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <p className="text-sm font-semibold text-slate-700">No admin users found</p>
                    <p className="mt-1 text-sm text-slate-400">Get started by adding a user.</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                          {initials(u.name)}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{u.phone || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyle(u.role?.name)}`}>
                        {(u.role?.name?.toLowerCase() === 'admin' || u.role?.name?.toLowerCase() === 'superadmin') && <Shield size={12} />}
                        {u.role?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={u.is_active ? 'Active' : 'Inactive'} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{formatDate(u.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <AdminButton variant="ghost" size="sm" to={`/admin/settings/admin-users/${u.id}`}>View</AdminButton>
                        <AdminActionButtons
                          onEdit={() => navigate(`/admin/settings/admin-users/${u.id}/edit`)}
                          onDelete={() => setDeleteTarget(u)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-admin-border-subtle md:hidden">
          {users.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <p className="text-sm font-semibold text-slate-700">No admin users found</p>
              <p className="mt-1 text-sm text-slate-400">Get started by adding a user.</p>
            </div>
          ) : (
            users.map((u) => (
              <div key={u.id} className="p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                    {initials(u.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{u.name}</p>
                    <p className="truncate text-xs text-slate-400">{u.email}</p>
                  </div>
                  <StatusBadge status={u.is_active ? 'Active' : 'Inactive'} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">{u.role?.name || 'Unknown'} &middot; {formatDate(u.created_at)}</span>
                  <div className="flex items-center gap-1.5">
                    <AdminButton variant="ghost" size="sm" to={`/admin/settings/admin-users/${u.id}`}>View</AdminButton>
                    <AdminActionButtons
                      onEdit={() => navigate(`/admin/settings/admin-users/${u.id}/edit`)}
                      onDelete={() => setDeleteTarget(u)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Per Page + Pagination below table */}
      <div className="flex flex-col gap-3 rounded-xl border border-admin-border bg-admin-card px-5 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Per Page:</span>
          <select
            value={pagination.perPage}
            onChange={handlePerPageChange}
            className="rounded border border-gray-300 bg-admin-card-elevated px-2 py-1 text-sm text-slate-700 outline-none focus:border-[#25A9EB]"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        {pagination.lastPage > 1 && (
          <Pagination page={pagination.currentPage} totalPages={pagination.lastPage} onChange={goToPage} />
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />

      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}
