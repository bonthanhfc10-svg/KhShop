import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '../../../components/admin/common/Card';
import AdminButton from '../../../components/admin/common/AdminButton';
import AdminLoading from '../../../components/common/Loading';
import { categoryService } from '../../../services/admin/categoryService';

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [roots, setRoots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      categoryService.getById(id),
      categoryService.getAll(),
    ]).then(([cat, allCats]) => {
      if (!cat) {
        setError('Category not found');
        return;
      }
      setForm({
        name: cat.name || '',
        slug: cat.slug || '',
        description: cat.description || '',
        parent_id: cat.parent_id || '',
        is_active: cat.is_active ?? true,
      });
      setRoots(allCats.filter((c) => c.id !== Number(id)));
    }).catch((err) => {
      setError(err?.response?.data?.message || 'Failed to load category.');
    });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await categoryService.update(id, {
        name: form.name,
        description: form.description || undefined,
        parent_id: form.parent_id ? Number(form.parent_id) : null,
        is_active: form.is_active,
      });
      navigate('/admin/categories', { state: { toast: 'Updated successfully' } });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update category.');
    } finally {
      setSaving(false);
    }
  };

  if (error && !form) {
    return (
      <div className="space-y-5">
        <Link to="/admin/categories" className="mb-2 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
          <ArrowLeft size={16} /> Back to categories
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Category</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <AdminButton variant="primary" onClick={() => navigate('/admin/categories')} className="mt-3">Go Back</AdminButton>
        </div>
      </div>
    );
  }

  if (!form) return <AdminLoading />;

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Category</h1>
          <p className="mt-1 text-sm text-slate-500">Update category information.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Category Information" subtitle="Basic details for the category">
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
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={inputCls}
                    rows={3}
                    placeholder="Optional description"
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
                  value={form.parent_id}
                  onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
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
                  value={form.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setForm({ ...form, is_active: e.target.value === 'active' })}
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
        <AdminButton variant="cancel" onClick={() => navigate('/admin/categories')}>Cancel</AdminButton>
        <AdminButton variant="success" onClick={handleSave} disabled={saving || !form.name}>{saving ? 'Saving...' : 'Update Category'}</AdminButton>
      </div>
    </div>
  );
}
