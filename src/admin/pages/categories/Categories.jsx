import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminButton from '../../components/common/AdminButton';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import Modal from '../../components/common/Modal';
import AdminLoading from '../../components/common/Loading';
import { categoryService } from '../../services/categoryService';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', parent: '', status: 'active' });
  const [saving, setSaving] = useState(false);

  const load = () => categoryService.getAll().then(setCategories).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ name: '', slug: '', parent: '', status: 'active' });
    setEditTarget(null);
    setFormOpen(true);
  };
  const openEdit = (c) => {
    setForm({ name: c.name, slug: c.slug, parent: c.parent || '', status: c.status });
    setEditTarget(c);
    setFormOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, parent: form.parent ? Number(form.parent) : null };
    if (editTarget) {
      await categoryService.update(editTarget.id, payload);
    } else {
      await categoryService.create(payload);
    }
    setSaving(false);
    setFormOpen(false);
    setEditTarget(null);
    load();
  };

  const handleDelete = async () => {
    await categoryService.remove(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  if (loading) return <AdminLoading />;

  const roots = categories.filter((c) => c.parent === null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Categories</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage your product categories and hierarchy.</p>
        </div>
        <AdminButton onClick={openCreate}>
          <Plus size={16} /> Add Category
        </AdminButton>
      </div>

      <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-px bg-neutral-100 sm:grid-cols-2 lg:grid-cols-3">
          {roots.map((root) => {
            const children = categories.filter((c) => c.parent === root.id);
            return (
              <div key={root.id} className="bg-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {root.image && (
                      <img src={root.image} alt={root.name} className="h-9 w-9 rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="font-display font-semibold text-neutral-900">{root.name}</p>
                      <p className="text-xs text-neutral-400">{root.products} products</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(root)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900" aria-label="Edit">
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
                      <span key={c.id} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600">
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

      {/* Category form modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editTarget ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Category Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Parent Category</label>
            <select
              value={form.parent}
              onChange={(e) => setForm({ ...form, parent: e.target.value })}
              className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
            >
              <option value="">Root (none)</option>
              {roots.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <AdminButton variant="secondary" onClick={() => setFormOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</AdminButton>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
