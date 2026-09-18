import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Card from '../../../components/admin/common/Card';
import AdminButton from '../../../components/admin/common/AdminButton';
import { collectionService } from '../../../services/admin/collectionService';

export default function CreateCollection() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    is_active: true,
    sort_order: 0,
  });

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    setSaving(true);
    setErrors({});
    try {
      await collectionService.create({
        name: form.name,
        description: form.description || undefined,
        imageFile,
        is_active: form.is_active,
        sort_order: form.sort_order,
      });
      navigate('/admin/store/collections', { state: { toast: 'Collection created successfully' } });
    } catch (err) {
      if (err?.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      }
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15';
  const labelCls = 'mb-1.5 block text-sm font-medium text-neutral-700';
  const errorCls = 'mt-1 text-xs text-red-500';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/store/collections"
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft size={16} /> Back to collections
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Collection</h1>
          <p className="mt-1 text-sm text-slate-500">Create a new product collection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Collection Information" subtitle="Basic details for the collection">
            <div className="p-5">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelCls}>Name *</label>
                  <input value={form.name} onChange={set('name')} className={inputCls} placeholder="e.g. Summer Collection" />
                  {errors.name && <p className={errorCls}>{errors.name[0]}</p>}
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea value={form.description} onChange={set('description')} className={inputCls} rows={3} placeholder="Optional description" />
                  {errors.description && <p className={errorCls}>{errors.description[0]}</p>}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Collection Image" subtitle="Upload the collection image">
            <div className="p-5">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="h-48 w-full rounded-lg border border-admin-border object-cover" />
                  <button
                    onClick={removeImage}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-admin-border bg-admin-card-elevated transition-colors hover:border-[#25A9EB]"
                >
                  <Upload className="h-8 w-8 text-neutral-400" />
                  <p className="mt-2 text-sm text-neutral-500">Click to upload collection image</p>
                  <p className="text-xs text-neutral-400">PNG, JPG, WEBP up to 2MB</p>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleImageSelect}
              />
              {errors.image && <p className={errorCls}>{errors.image[0]}</p>}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Settings" subtitle="Collection configuration">
            <div className="p-5 space-y-4">
              <div>
                <label className={labelCls}>Status</label>
                <select
                  value={form.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.value === 'active' }))}
                  className={inputCls}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Sort Order</label>
                <input
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={set('sort_order')}
                  className={inputCls}
                />
                {errors.sort_order && <p className={errorCls}>{errors.sort_order[0]}</p>}
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <AdminButton variant="cancel" onClick={() => navigate('/admin/store/collections')}>Cancel</AdminButton>
            <AdminButton variant="success" onClick={handleSave} disabled={saving || !form.name || !imageFile}>
              {saving ? 'Saving...' : 'Create Collection'}
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}
