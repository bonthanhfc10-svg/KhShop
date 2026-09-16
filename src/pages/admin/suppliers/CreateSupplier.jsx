import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '../../../components/admin/common/Card';
import AdminButton from '../../../components/admin/common/AdminButton';
import { supplierService } from '../../../services/admin/supplierService';

export default function CreateSupplier() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    contact_name: '',
    phone: '',
    email: '',
    address: '',
    is_active: true,
    notes: '',
  });

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrors({});
    try {
      const payload = {
        name: form.name,
        contact_name: form.contact_name || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        address: form.address || undefined,
        is_active: form.is_active,
        notes: form.notes || undefined,
      };
      await supplierService.create(payload);
      navigate('/admin/suppliers', { state: { toast: 'Created successfully' } });
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
            to="/admin/suppliers"
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft size={16} /> Back to suppliers
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Supplier</h1>
          <p className="mt-1 text-sm text-slate-500">Add a new product supplier.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Supplier Information" subtitle="Basic details about the supplier">
            <div className="space-y-4 p-5">
              <div>
                <label className={labelCls}>Supplier Name *</label>
                <input value={form.name} onChange={set('name')} className={inputCls} placeholder="Enter supplier name" />
                {errors.name && <p className={errorCls}>{errors.name[0]}</p>}
              </div>
              <div>
                <label className={labelCls}>Contact Person</label>
                <input value={form.contact_name} onChange={set('contact_name')} className={inputCls} placeholder="Sales representative name" />
                {errors.contact_name && <p className={errorCls}>{errors.contact_name[0]}</p>}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Phone</label>
                  <input value={form.phone} onChange={set('phone')} className={inputCls} placeholder="+1 555-0000" />
                  {errors.phone && <p className={errorCls}>{errors.phone[0]}</p>}
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={form.email} onChange={set('email')} className={inputCls} placeholder="supplier@example.com" />
                  {errors.email && <p className={errorCls}>{errors.email[0]}</p>}
                </div>
              </div>
              <div>
                <label className={labelCls}>Address</label>
                <input value={form.address} onChange={set('address')} className={inputCls} placeholder="Full address" />
                {errors.address && <p className={errorCls}>{errors.address[0]}</p>}
              </div>
              <div>
                <label className={labelCls}>Notes</label>
                <textarea value={form.notes} onChange={set('notes')} className={inputCls} rows={3} placeholder="Optional notes" />
                {errors.notes && <p className={errorCls}>{errors.notes[0]}</p>}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Settings" subtitle="Supplier configuration">
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
            <AdminButton variant="cancel" onClick={() => navigate('/admin/suppliers')}>Cancel</AdminButton>
            <AdminButton variant="success" onClick={handleSave} disabled={saving || !form.name}>
              {saving ? 'Saving...' : 'Create Supplier'}
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}
