import { useState } from 'react';
import { Power, Pencil, Trash2, Plus } from 'lucide-react';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import AdminButton from '../../components/common/AdminButton';
import { formatDate } from '../../../utils/formatDate';

const initial = [
  { id: 1, image: '/images/banners/Hero.png', title: 'Women Collection', subtitle: 'New season styles', buttonText: 'Shop Women', link: '/shop/men', status: 'Active', start: '2026-08-01', end: '2026-09-30' },
  { id: 2, image: '/images/banners/men.svg', title: 'Men Essentials', subtitle: 'Everyday comfort', buttonText: 'Shop Men', link: '/shop/women', status: 'Active', start: '2026-08-01', end: '2026-09-15' },
  { id: 3, image: '/images/banners/promo.svg', title: 'Kids Sale', subtitle: 'Up to 40% off', buttonText: 'Shop Kids', link: '/shop/kids', status: 'Inactive', start: '2026-07-01', end: '2026-07-31' },
  { id: 4, image: '/images/banners/Hero.png', title: 'Sport Performance', subtitle: 'Gear up for the season', buttonText: 'Shop Sport', link: '/shop/sport', status: 'Active', start: '2026-09-01', end: '2026-12-31' },
  { id: 5, image: '/images/banners/promo.svg', title: 'Flash Sale', subtitle: 'Limited time only', buttonText: 'View Sale', link: '/shop/sale', status: 'Active', start: '2026-09-05', end: '2026-09-12' },
];

const emptyForm = {
  title: '',
  subtitle: '',
  buttonText: '',
  link: '',
  status: 'Active',
  start: '',
  end: '',
};

export default function Banners() {
  const [banners, setBanners] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

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

  const remove = (id) => setBanners((prev) => prev.filter((x) => x.id !== id));

  const save = () => {
    if (editing) {
      setBanners((prev) =>
        prev.map((x) => (x.id === editing.id ? { ...x, ...form, image: x.image } : x))
      );
    } else {
      setBanners((prev) => [...prev, { id: Date.now(), image: '/images/banners/Hero.png', ...form }]);
    }
    setOpen(false);
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Banners</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage homepage and promotional banners.</p>
        </div>
        <AdminButton onClick={openCreate}><Plus size={16} /> Add Banner</AdminButton>
      </div>

      <Card bodyClassName="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/60 text-xs uppercase tracking-wider text-neutral-500">
              <th className="px-5 py-3 font-semibold">Image</th>
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold">Button Text</th>
              <th className="px-5 py-3 font-semibold">Link</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Start</th>
              <th className="px-5 py-3 font-semibold">End</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60">
                <td className="px-5 py-3">
                  <img src={b.image} alt={b.title} className="h-12 w-24 shrink-0 rounded-lg border border-neutral-100 object-cover" />
                </td>
                <td className="px-5 py-3">
                  <p className="font-medium text-neutral-900">{b.title}</p>
                  <p className="text-xs text-neutral-400">{b.subtitle}</p>
                </td>
                <td className="px-5 py-3 text-neutral-700">{b.buttonText}</td>
                <td className="px-5 py-3 text-neutral-500">{b.link}</td>
                <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-5 py-3 text-neutral-500">{formatDate(b.start)}</td>
                <td className="px-5 py-3 text-neutral-500">{formatDate(b.end)}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => toggleStatus(b)} aria-label="Toggle status" className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900">
                      <Power size={16} />
                    </button>
                    <button onClick={() => openEdit(b)} aria-label="Edit banner" className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => remove(b.id)} aria-label="Delete banner" className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Banner' : 'Add Banner'} size="lg">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Banner Image</label>
            <img src={editing ? initial.find((x) => x.id === editing.id)?.image : '/images/banners/Hero.png'} alt="Preview" className="h-24 w-full rounded-lg border border-dashed border-neutral-300 object-cover" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Title</label>
            <input value={form.title} onChange={set('title')} className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Subtitle</label>
            <input value={form.subtitle} onChange={set('subtitle')} className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Button Text</label>
            <input value={form.buttonText} onChange={set('buttonText')} className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Link</label>
            <input value={form.link} onChange={set('link')} className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Status</label>
            <select value={form.status} onChange={set('status')} className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Start Date</label>
            <input type="date" value={form.start} onChange={set('start')} className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">End Date</label>
            <input type="date" value={form.end} onChange={set('end')} className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400" />
          </div>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <AdminButton variant="secondary" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={save}>{editing ? 'Save Changes' : 'Create Banner'}</AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
