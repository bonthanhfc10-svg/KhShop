import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Power, Plus } from 'lucide-react';
import AdminButton from '../../../components/admin/common/AdminButton';
import AdminActionButtons from '../../../components/admin/common/AdminActionButtons';
import Modal from '../../../components/common/Modal';
import ConfirmModal from '../../../components/admin/common/ConfirmModal';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import Toast from '../../../components/admin/common/Toast';
import useToast from '../../../hooks/useToast';
import { formatDate } from '../../../utils/formatDate';

const initial = [
  { id: 1, image: '/images/banners/Hero.png', title: 'Women Collection', subtitle: 'New season styles', buttonText: 'Shop Women', link: '/products/men', status: 'Active', start: '2026-08-01', end: '2026-09-30' },
  { id: 2, image: '/images/banners/men.svg', title: 'Men Essentials', subtitle: 'Everyday comfort', buttonText: 'Shop Men', link: '/products/women', status: 'Active', start: '2026-08-01', end: '2026-09-15' },
  { id: 3, image: '/images/banners/promo.svg', title: 'Kids Sale', subtitle: 'Up to 40% off', buttonText: 'Shop Kids', link: '/products/kids', status: 'Inactive', start: '2026-07-01', end: '2026-07-31' },
  { id: 4, image: '/images/banners/Hero.png', title: 'Sport Performance', subtitle: 'Gear up for the season', buttonText: 'Shop Sport', link: '/products/sport', status: 'Active', start: '2026-09-01', end: '2026-12-31' },
  { id: 5, image: '/images/banners/promo.svg', title: 'Flash Sale', subtitle: 'Limited time only', buttonText: 'View Sale', link: '/products/sale', status: 'Active', start: '2026-09-05', end: '2026-09-12' },
];

export default function Banners() {
  const location = useLocation();
  const [banners, setBanners] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', subtitle: '', buttonText: '', link: '', status: 'Active', start: '', end: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toasts, show, remove } = useToast();

  useEffect(() => {
    if (location.state?.toast) {
      show(location.state.toast);
      window.history.replaceState({}, '');
    }
  }, []);

  const openEdit = (b) => {
    setEditing(b);
    setForm({ title: b.title, subtitle: b.subtitle, buttonText: b.buttonText, link: b.link, status: b.status, start: b.start, end: b.end });
    setOpen(true);
  };

  const toggleStatus = (b) => {
    setBanners((prev) =>
      prev.map((x) =>
        x.id === b.id ? { ...x, status: x.status === 'Active' ? 'Inactive' : 'Active' } : x
      )
    );
  };

  const handleDelete = (id) => {
    setBanners((prev) => prev.filter((x) => x.id !== id));
    setDeleteTarget(null);
    show('Deleted successfully');
  };

  const save = () => {
    setBanners((prev) =>
      prev.map((x) => (x.id === editing.id ? { ...x, ...form, image: x.image } : x))
    );
    setOpen(false);
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

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

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card shadow-sm">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-admin-border bg-admin-table-header">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Image</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Title</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Button Text</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Link</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Start</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">End</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border-subtle">
              {banners.map((b) => (
                <tr key={b.id} className="transition-colors hover:bg-admin-primary-light/20">
                  <td className="px-5 py-3.5">
                    <img src={b.image} alt={b.title} className="h-12 w-24 shrink-0 rounded-lg border border-admin-border-subtle object-cover" />
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-slate-900">{b.title}</p>
                    <p className="text-xs text-slate-400">{b.subtitle}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{b.buttonText}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{b.link}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{formatDate(b.start)}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{formatDate(b.end)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => toggleStatus(b)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-admin-border bg-admin-card-elevated px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-admin-surface-subtle hover:text-slate-900"
                      >
                        <Power size={12} />
                        {b.status === 'Active' ? 'Disable' : 'Enable'}
                      </button>
                      <AdminActionButtons
                        onEdit={() => openEdit(b)}
                        onDelete={() => setDeleteTarget(b)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-admin-border-subtle md:hidden">
          {banners.map((b) => (
            <div key={b.id} className="p-4">
              <div className="flex items-center gap-3">
                <img src={b.image} alt={b.title} className="h-12 w-24 shrink-0 rounded-lg border border-admin-border-subtle object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{b.title}</p>
                  <p className="truncate text-xs text-slate-400">{b.buttonText}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-500">{formatDate(b.start)} &middot; {formatDate(b.end)}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleStatus(b)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-admin-border bg-admin-card-elevated px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-admin-surface-subtle hover:text-slate-900"
                  >
                    <Power size={12} />
                    {b.status === 'Active' ? 'Disable' : 'Enable'}
                  </button>
                  <AdminActionButtons
                    onEdit={() => openEdit(b)}
                    onDelete={() => setDeleteTarget(b)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {banners.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-semibold text-slate-700">No banners found</p>
            <p className="mt-1 text-sm text-slate-400">Get started by adding a banner.</p>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Edit Banner" size="lg">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Banner Image</label>
            <img src={editing?.image || '/images/banners/Hero.png'} alt="Preview" className="h-24 w-full rounded-lg border border-dashed border-slate-300 object-cover" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Title</label>
            <input value={form.title} onChange={set('title')} className="w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Subtitle</label>
            <input value={form.subtitle} onChange={set('subtitle')} className="w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Button Text</label>
            <input value={form.buttonText} onChange={set('buttonText')} className="w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Link</label>
            <input value={form.link} onChange={set('link')} className="w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
            <select value={form.status} onChange={set('status')} className="w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Start Date</label>
            <input type="date" value={form.start} onChange={set('start')} className="w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">End Date</label>
            <input type="date" value={form.end} onChange={set('end')} className="w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15" />
          </div>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <AdminButton variant="cancel" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={save}>Save Changes</AdminButton>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete Banner?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />

      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}
