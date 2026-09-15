import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import AdminButton from '../../../components/admin/common/AdminButton';
import Card from '../../../components/admin/common/Card';

const emptyForm = {
  title: '',
  subtitle: '',
  buttonText: '',
  link: '',
  status: 'Active',
  start: '',
  end: '',
};

export default function CreateBanner() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    navigate('/admin/store/banners', { state: { toast: 'Created successfully' } });
  };

  const inputCls = 'w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15';
  const labelCls = 'mb-1.5 block text-sm font-medium text-neutral-700';

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Banner</h1>
          <p className="mt-1 text-sm text-slate-500">Create a new homepage or promotional banner.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Banner Content" subtitle="Text and link information for the banner">
            <div className="p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Title</label>
                  <input value={form.title} onChange={set('title')} className={inputCls} placeholder="e.g. Summer Sale" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Subtitle</label>
                  <input value={form.subtitle} onChange={set('subtitle')} className={inputCls} placeholder="e.g. Up to 50% off" />
                </div>
                <div>
                  <label className={labelCls}>Button Text</label>
                  <input value={form.buttonText} onChange={set('buttonText')} className={inputCls} placeholder="Shop Now" />
                </div>
                <div>
                  <label className={labelCls}>Link</label>
                  <input value={form.link} onChange={set('link')} className={inputCls} placeholder="/products/sale" />
                </div>
              </div>
            </div>
          </Card>

          <Card title="Banner Image" subtitle="Upload or preview the banner image">
            <div className="p-5">
              <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-admin-border bg-admin-card-elevated">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-neutral-400" />
                  <p className="mt-2 text-sm text-neutral-500">Image upload area</p>
                  <p className="text-xs text-neutral-400">Drag and drop or click to upload</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card title="Settings" subtitle="Banner configuration">
            <div className="space-y-4 p-5">
              <div>
                <label className={labelCls}>Status</label>
                <select value={form.status} onChange={set('status')} className={inputCls}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Start Date</label>
                <input type="date" value={form.start} onChange={set('start')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>End Date</label>
                <input type="date" value={form.end} onChange={set('end')} className={inputCls} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-admin-border pt-6">
        <AdminButton variant="secondary" onClick={() => navigate('/admin/store/banners')}>Cancel</AdminButton>
        <AdminButton variant="success" onClick={handleSave}>Create Banner</AdminButton>
      </div>
    </div>
  );
}
