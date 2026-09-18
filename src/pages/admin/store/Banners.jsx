import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Power, Plus, Eye, Search } from 'lucide-react';
import AdminButton from '../../../components/admin/common/AdminButton';
import AdminActionButtons from '../../../components/admin/common/AdminActionButtons';
import ConfirmModal from '../../../components/admin/common/ConfirmModal';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import Toast from '../../../components/admin/common/Toast';
import SearchInput from '../../../components/admin/common/SearchInput';
import useToast from '../../../hooks/useToast';
import AdminLoading from '../../../components/common/Loading';
import { bannerService } from '../../../services/admin/bannerService';

export default function Banners() {
  const location = useLocation();
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toasts, show, remove } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bannerService.getAll();
      setBanners(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load banners.');
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
      await bannerService.delete(deleteTarget.id);
      show('Deleted successfully');
      load();
    } catch (err) {
      show(err?.response?.data?.message || 'Failed to delete banner');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const toggleStatus = async (b) => {
    try {
      await bannerService.updateStatus(b.id, !b.is_active);
      setBanners((prev) =>
        prev.map((x) => (x.id === b.id ? { ...x, is_active: !x.is_active } : x))
      );
      show(`Banner ${b.is_active ? 'disabled' : 'enabled'} successfully`);
    } catch (err) {
      show(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const handleSearchCommit = useCallback(() => {
    setSearch(searchInput);
  }, [searchInput]);

  const filtered = banners.filter((b) =>
    !search ||
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <AdminLoading />;

  if (error) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Banners</h1>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Banners</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage homepage and promotional banners &middot; {banners.length} banners
          </p>
        </div>
        <AdminButton to="/admin/store/banners/create" variant="success">
          <Plus size={16} /> Add Banner
        </AdminButton>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-xl border border-admin-border bg-admin-card p-4 shadow-sm">
        <div className="flex flex-1 items-center gap-2">
          <SearchInput value={searchInput} onChange={setSearchInput} onCommit={handleSearchCommit} placeholder="Search banners..." />
          <AdminButton variant="primary" size="sm" onClick={handleSearchCommit}>
            <Search size={14} /> Search
          </AdminButton>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card shadow-sm">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-admin-border bg-admin-table-header">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Image</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Title</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Description</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border-subtle">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <p className="text-sm font-semibold text-slate-700">No banners found</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {search ? 'Try adjusting your search.' : 'Get started by adding a banner.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="transition-colors hover:bg-admin-primary-light/20">
                    <td className="px-5 py-3.5">
                      <img src={b.image_path} alt={b.title} className="h-12 w-24 shrink-0 rounded-lg border border-admin-border-subtle object-cover" />
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{b.title}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 max-w-xs truncate">{b.description || <span className="text-slate-300">&mdash;</span>}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{b.category?.name || <span className="text-slate-300">Homepage</span>}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={b.is_active ? 'Active' : 'Inactive'} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => toggleStatus(b)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-admin-border bg-admin-card-elevated px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-admin-surface-subtle hover:text-slate-900"
                        >
                          <Power size={12} />
                          {b.is_active ? 'Disable' : 'Enable'}
                        </button>
                        <AdminActionButtons
                          onEdit={() => navigate(`/admin/store/banners/${b.id}/edit`)}
                          onDelete={() => setDeleteTarget(b)}
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
              <p className="text-sm font-semibold text-slate-700">No banners found</p>
              <p className="mt-1 text-sm text-slate-400">
                {search ? 'Try adjusting your search.' : 'Get started by adding a banner.'}
              </p>
            </div>
          ) : (
            filtered.map((b) => (
              <div key={b.id} className="p-4">
                <div className="flex items-center gap-3">
                  <img src={b.image_path} alt={b.title} className="h-12 w-24 shrink-0 rounded-lg border border-admin-border-subtle object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{b.title}</p>
                    <p className="truncate text-xs text-slate-400">{b.category?.name || 'Homepage'}</p>
                  </div>
                  <StatusBadge status={b.is_active ? 'Active' : 'Inactive'} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="truncate text-xs text-slate-500">{b.description || 'No description'}</p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleStatus(b)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-admin-border bg-admin-card-elevated px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-admin-surface-subtle hover:text-slate-900"
                    >
                      <Power size={12} />
                      {b.is_active ? 'Disable' : 'Enable'}
                    </button>
                    <AdminActionButtons
                      onEdit={() => navigate(`/admin/store/banners/${b.id}/edit`)}
                      onDelete={() => setDeleteTarget(b)}
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
        title="Delete Banner?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleting}
      />

      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}
