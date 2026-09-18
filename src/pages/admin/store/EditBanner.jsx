import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Card from '../../../components/admin/common/Card';
import AdminButton from '../../../components/admin/common/AdminButton';
import AdminLoading from '../../../components/common/Loading';
import { bannerService } from '../../../services/admin/bannerService';

export default function EditBanner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    bannerService.getById(id).then((banner) => {
      if (!banner) {
        setError('Banner not found');
        return;
      }
      setForm({
        title: banner.title || '',
        description: banner.description || '',
        is_active: banner.is_active ?? true,
      });
      setImagePreview(banner.image_path || null);
    }).catch((err) => {
      setError(err?.response?.data?.message || 'Failed to load banner.');
    });
  }, [id]);

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
      await bannerService.update(id, {
        title: form.title,
        description: form.description || '',
        imageFile: imageFile || undefined,
        is_active: form.is_active,
      });
      navigate('/admin/store/banners', { state: { toast: 'Banner updated successfully' } });
    } catch (err) {
      if (err?.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      }
    } finally {
      setSaving(false);
    }
  };

  if (error && !form) {
    return (
      <div className="space-y-5">
        <Link to="/admin/store/banners" className="mb-2 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
          <ArrowLeft size={16} /> Back to banners
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Banner</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <AdminButton variant="primary" onClick={() => navigate('/admin/store/banners')} className="mt-3">Go Back</AdminButton>
        </div>
      </div>
    );
  }

  if (!form) return <AdminLoading />;

  const inputCls = 'w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15';
  const labelCls = 'mb-1.5 block text-sm font-medium text-neutral-700';
  const errorCls = 'mt-1 text-xs text-red-500';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/store/banners"
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft size={16} /> Back to banners
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Banner</h1>
          <p className="mt-1 text-sm text-slate-500">Update banner information.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Banner Content" subtitle="Text information for the banner">
            <div className="p-5">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelCls}>Title *</label>
                  <input value={form.title} onChange={set('title')} className={inputCls} placeholder="e.g. Summer Sale" />
                  {errors.title && <p className={errorCls}>{errors.title[0]}</p>}
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea value={form.description} onChange={set('description')} className={inputCls} rows={3} placeholder="Optional description text" />
                  {errors.description && <p className={errorCls}>{errors.description[0]}</p>}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Banner Image" subtitle="Upload or replace the banner image">
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
                  <p className="mt-2 text-sm text-neutral-500">Click to upload banner image</p>
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
          <Card title="Settings" subtitle="Banner configuration">
            <div className="p-5">
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
          </Card>

          <div className="flex justify-end gap-2">
            <AdminButton variant="cancel" onClick={() => navigate('/admin/store/banners')}>Cancel</AdminButton>
            <AdminButton variant="success" onClick={handleSave} disabled={saving || !form.title}>
              {saving ? 'Saving...' : 'Update Banner'}
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}
