import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminButton from '../../../components/admin/common/AdminButton';
import Card from '../../../components/admin/common/Card';
import { categoryService } from '../../../services/admin/categoryService';

export default function CreateCategory() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [roots, setRoots] = useState([]);
  const [form, setForm] = useState({ name: '', slug: '', parent: '', status: 'active' });

  useEffect(() => {
    categoryService.getAll().then((cats) => setRoots(cats.filter((c) => c.parent === null)));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, parent: form.parent ? Number(form.parent) : null };
      await categoryService.create(payload);
      navigate('/admin/categories', { state: { toast: 'Created successfully' } });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15';
  const labelCls = 'mb-1.5 block text-sm font-medium text-neutral-700';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/categories"
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft size={16} /> Back to categories
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Category</h1>
          <p className="mt-1 text-sm text-slate-500">Create a new product category.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Category Information" subtitle="Basic details for the new category">
            <div className="p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Category Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. Summer Collection"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className={inputCls}
                    placeholder="summer-collection"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card title="Settings" subtitle="Category configuration">
            <div className="space-y-4 p-5">
              <div>
                <label className={labelCls}>Parent Category</label>
                <select
                  value={form.parent}
                  onChange={(e) => setForm({ ...form, parent: e.target.value })}
                  className={inputCls}
                >
                  <option value="">Root (none)</option>
                  {roots.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className={inputCls}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-admin-border pt-6">
        <AdminButton variant="secondary" onClick={() => navigate('/admin/categories')}>Cancel</AdminButton>
        <AdminButton variant="success" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Create Category'}</AdminButton>
      </div>
    </div>
  );
}
