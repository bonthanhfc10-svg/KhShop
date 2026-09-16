import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import AdminButton from '../../../components/admin/common/AdminButton';
import AdminActionButtons from '../../../components/admin/common/AdminActionButtons';
import ConfirmModal from '../../../components/admin/common/ConfirmModal';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import Toast from '../../../components/admin/common/Toast';
import useToast from '../../../hooks/useToast';
import AdminLoading from '../../../components/common/Loading';
import { supplierService } from '../../../services/admin/supplierService';

export default function Suppliers() {
  const location = useLocation();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toasts, show, remove } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load suppliers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (location.state?.toast) {
      show(location.state.toast);
      window.history.replaceState({}, '');
    }
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await supplierService.delete(deleteTarget.id);
      show('Deleted successfully');
      load();
    } catch (err) {
      show(err?.response?.data?.message || 'Failed to delete supplier');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = suppliers.filter((s) =>
    !search ||
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.phone?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <AdminLoading />;

  if (error) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Suppliers</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <AdminButton variant="primary" onClick={load} className="mt-3">Retry</AdminButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Suppliers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your product suppliers &middot; {suppliers.length} suppliers
          </p>
        </div>
        <AdminButton to="/admin/suppliers/create" variant="success">
          <Plus size={16} /> Add Supplier
        </AdminButton>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-xl border border-admin-border bg-admin-card p-4 shadow-sm">
        <div className="relative flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search suppliers..."
            className="w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-admin-border bg-admin-table-header">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Supplier Name</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Contact</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Phone</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border-subtle">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <p className="text-sm font-semibold text-slate-700">No suppliers found</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {search ? 'Try adjusting your search.' : 'Get started by adding a supplier.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-admin-primary-light/20">
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{s.name}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{s.contact_name || <span className="text-slate-300">&mdash;</span>}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{s.phone || <span className="text-slate-300">&mdash;</span>}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{s.email || <span className="text-slate-300">&mdash;</span>}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={s.is_active ? 'Active' : 'Inactive'} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/suppliers/${s.id}`)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200"
                        >
                          <Eye size={12} /> View
                        </button>
                        <AdminActionButtons
                          onEdit={() => navigate(`/admin/suppliers/${s.id}/edit`)}
                          onDelete={() => setDeleteTarget(s)}
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
          {filtered.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <p className="text-sm font-semibold text-slate-700">No suppliers found</p>
              <p className="mt-1 text-sm text-slate-400">
                {search ? 'Try adjusting your search.' : 'Get started by adding a supplier.'}
              </p>
            </div>
          ) : (
            filtered.map((s) => (
              <div key={s.id} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-semibold text-slate-900">{s.name}</p>
                  <StatusBadge status={s.is_active ? 'Active' : 'Inactive'} />
                </div>
                <p className="mt-1 truncate text-xs text-slate-400">{s.email || 'No email'} &middot; {s.phone || 'No phone'}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="truncate text-xs text-slate-500">{s.address || 'No address'}</p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => navigate(`/admin/suppliers/${s.id}`)}
                      className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200"
                    >
                      <Eye size={12} /> View
                    </button>
                    <AdminActionButtons
                      onEdit={() => navigate(`/admin/suppliers/${s.id}/edit`)}
                      onDelete={() => setDeleteTarget(s)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Supplier?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />

      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}
