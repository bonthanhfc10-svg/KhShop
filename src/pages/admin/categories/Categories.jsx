import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, ChevronRight, ChevronDown, Search } from 'lucide-react';
import AdminButton from '../../../components/admin/common/AdminButton';
import AdminActionButtons from '../../../components/admin/common/AdminActionButtons';
import ConfirmModal from '../../../components/admin/common/ConfirmModal';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import Toast from '../../../components/admin/common/Toast';
import SearchInput from '../../../components/admin/common/SearchInput';
import useToast from '../../../hooks/useToast';
import AdminLoading from '../../../components/common/Loading';
import { categoryService } from '../../../services/admin/categoryService';

export default function Categories() {
  const location = useLocation();
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [expandedRoots, setExpandedRoots] = useState({});
  const { toasts, show, remove } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cats = await categoryService.getAll();
      setAllCategories(cats);
      const init = {};
      cats.forEach((c) => { init[c.id] = true; });
      setExpandedRoots(init);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load categories.');
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
      await categoryService.delete(deleteTarget.id);
      show('Deleted successfully');
      load();
    } catch (err) {
      show(err?.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const toggleRoot = (id) => {
    setExpandedRoots((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearchCommit = useCallback(() => {
    setSearch(searchInput);
  }, [searchInput]);

  const categories = allCategories.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    if (c.name?.toLowerCase().includes(q) || c.slug?.toLowerCase().includes(q)) return true;
    return (c.children || []).some(
      (child) => child.name?.toLowerCase().includes(q) || child.slug?.toLowerCase().includes(q)
    );
  });

  const rows = [];
  categories.forEach((root) => {
    const childMatch = !search
      ? true
      : (root.children || []).some(
          (c) => c.name?.toLowerCase().includes(search.toLowerCase()) || c.slug?.toLowerCase().includes(search.toLowerCase())
        );
    const rootMatch = !search || root.name?.toLowerCase().includes(search.toLowerCase()) || root.slug?.toLowerCase().includes(search.toLowerCase());
    if (rootMatch || childMatch) {
      rows.push({ ...root, parentName: null, isRoot: true, childCount: (root.children || []).length });
      if (expandedRoots[root.id]) {
        (root.children || []).forEach((c) => {
          if (!search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.slug?.toLowerCase().includes(search.toLowerCase())) {
            rows.push({ ...c, parentName: root.name, isRoot: false, childCount: 0 });
          }
        });
      }
    }
  });

  if (loading) return <AdminLoading />;

  if (error) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Categories</h1>
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Categories</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your product categories &middot; {allCategories.length} categories
          </p>
        </div>
        <AdminButton to="/admin/categories/create" variant="success">
          <Plus size={16} /> Add Category
        </AdminButton>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-xl border border-admin-border bg-admin-card p-4 shadow-sm">
        <div className="flex flex-1 items-center gap-2">
          <SearchInput value={searchInput} onChange={setSearchInput} onCommit={handleSearchCommit} placeholder="Search categories..." />
          <AdminButton variant="primary" size="sm" onClick={handleSearchCommit}>
            <Search size={14} /> Search
          </AdminButton>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-admin-border bg-admin-table-header">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Slug</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Parent</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border-subtle">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <p className="text-sm font-semibold text-slate-700">No categories found</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {search ? 'Try adjusting your search.' : 'Get started by adding a category.'}
                    </p>
                  </td>
                </tr>
              ) : (
                rows.map((cat) => (
                  <tr
                    key={cat.id}
                    className="transition-colors hover:bg-admin-primary-light/20"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {cat.isRoot && cat.childCount > 0 ? (
                          <button
                            onClick={() => toggleRoot(cat.id)}
                            className="shrink-0 rounded p-0.5 text-slate-400 hover:text-slate-700"
                            aria-label={expandedRoots[cat.id] ? 'Collapse' : 'Expand'}
                          >
                            {expandedRoots[cat.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        ) : cat.isRoot ? (
                          <span className="w-[14px] shrink-0" />
                        ) : (
                          <span className="w-[14px] shrink-0 pl-1 text-slate-300">
                            <ChevronRight size={12} />
                          </span>
                        )}
                        <span className={`text-sm ${cat.isRoot ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-mono text-slate-500">{cat.slug}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{cat.parentName || <span className="text-slate-300">—</span>}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={cat.is_active ? 'Active' : 'Inactive'} />
                    </td>
                    <td className="px-5 py-3.5">
                      <AdminActionButtons
                        onEdit={() => navigate(`/admin/categories/${cat.id}/edit`)}
                        onDelete={() => setDeleteTarget(cat)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-admin-border-subtle md:hidden">
          {rows.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <p className="text-sm font-semibold text-slate-700">No categories found</p>
              <p className="mt-1 text-sm text-slate-400">
                {search ? 'Try adjusting your search.' : 'Get started by adding a category.'}
              </p>
            </div>
          ) : (
            rows.map((cat) => (
              <div key={cat.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {cat.isRoot && cat.childCount > 0 ? (
                      <button
                        onClick={() => toggleRoot(cat.id)}
                        className="shrink-0 rounded p-0.5 text-slate-400 hover:text-slate-700"
                      >
                        {expandedRoots[cat.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    ) : cat.isRoot ? (
                      <span className="w-[14px] shrink-0" />
                    ) : (
                      <span className="w-[14px] shrink-0 pl-1 text-slate-300">
                        <ChevronRight size={12} />
                      </span>
                    )}
                    <div>
                      <p className={`text-sm ${cat.isRoot ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{cat.name}</p>
                      <p className="text-xs text-slate-400">{cat.slug}</p>
                    </div>
                  </div>
                  <StatusBadge status={cat.is_active ? 'Active' : 'Inactive'} />
                </div>
                <div className="mt-3 flex items-center justify-end">
                  <AdminActionButtons
                    onEdit={() => navigate(`/admin/categories/${cat.id}/edit`)}
                    onDelete={() => setDeleteTarget(cat)}
                  />
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
        title="Delete Category?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />

      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}
