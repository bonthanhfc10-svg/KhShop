import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminButton from '../../../components/admin/common/AdminButton';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import ConfirmModal from '../../../components/admin/common/ConfirmModal';
import Toast from '../../../components/admin/common/Toast';
import useToast from '../../../hooks/useToast';
import AdminLoading from '../../../components/common/Loading';
import { categoryService } from '../../../services/admin/categoryService';

export default function Categories() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toasts, show, remove } = useToast();

  const load = () => categoryService.getAll().then(setCategories).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (location.state?.toast) {
      show(location.state.toast);
      window.history.replaceState({}, '');
    }
  }, []);

  const handleDelete = async () => {
    await categoryService.delete(deleteTarget.id);
    setDeleteTarget(null);
    show('Deleted successfully');
    load();
  };

  if (loading) return <AdminLoading />;

  const roots = categories.filter((c) => c.parent === null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-neutral-900">Categories</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage your product categories and hierarchy.</p>
        </div>
        <AdminButton to="/admin/categories/create" variant="success">
          <Plus size={16} /> Add Category
        </AdminButton>
      </div>

      <div className="overflow-hidden border border-admin-border bg-admin-card shadow-sm">
        <div className="grid grid-cols-1 gap-px bg-admin-border-subtle sm:grid-cols-2 lg:grid-cols-3">
          {roots.map((root) => {
            const children = categories.filter((c) => c.parent === root.id);
            return (
              <div key={root.id} className="bg-admin-card p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {root.image && (
                      <img src={root.image} alt={root.name} className="h-9 w-9 rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="font-sans font-semibold text-neutral-900">{root.name}</p>
                      <p className="text-xs text-neutral-400">{root.products} products</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => navigate(`/admin/categories/${root.id}/edit`)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900" aria-label="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(root)} className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge status={root.status === 'active' ? 'Active' : 'Draft'} />
                </div>
                {children.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {children.map((c) => (
                      <span key={c.id} className="rounded-full bg-admin-surface-subtle px-2.5 py-1 text-xs text-neutral-600">
                        {c.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
      />

      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}
