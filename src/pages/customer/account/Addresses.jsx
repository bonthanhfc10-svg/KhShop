import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Pencil, Trash2, Home } from 'lucide-react';
import AccountLayout from './AccountLayout';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Loading from '../../../components/common/Loading';
import Toast from '../../../components/admin/common/Toast';
import useToast from '../../../hooks/useToast';
import { useAuth } from '../../../store/AuthContext';
import { addressService } from '../../../services/addressService';

const emptyForm = {
  receiver_name: '',
  receiver_phone: '',
  address_line: '',
  city_province: '',
  is_default: false,
};

export default function Addresses() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { toasts, show: showToast, remove } = useToast();
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await addressService.getAll();
      setList(res?.data?.addresses || []);
    } catch {
      showToastRef.current('Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchAddresses();
  }, [user, fetchAddresses]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (addr) => {
    setEditing(addr);
    setForm({
      receiver_name: addr.receiver_name,
      receiver_phone: addr.receiver_phone,
      address_line: addr.address_line,
      city_province: addr.city_province || '',
      is_default: addr.is_default,
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleChange = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      if (editing) {
        await addressService.update(editing.id, form);
        showToast('Address updated.');
      } else {
        await addressService.create(form);
        showToast('Address added.');
      }
      setModalOpen(false);
      await fetchAddresses();
    } catch (err) {
      const fieldErrors = err?.response?.data?.errors;
      if (fieldErrors) {
        const mapped = {};
        Object.keys(fieldErrors).forEach((k) => {
          mapped[k] = fieldErrors[k][0];
        });
        setErrors(mapped);
      } else {
        showToast(err?.response?.data?.message || 'Something went wrong.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await addressService.remove(id);
      showToast('Address deleted.');
      await fetchAddresses();
    } catch {
      showToast('Failed to delete address.');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addressService.setDefault(id);
      showToast('Default address updated.');
      await fetchAddresses();
    } catch {
      showToast('Failed to update default address.');
    }
  };

  if (loading) {
    return (
      <AccountLayout>
        <Loading />
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div className="mt-4 flex items-center justify-between">
        <div />
        <Button onClick={openAdd} size="sm">
          <Plus size={15} /> Add Address
        </Button>
      </div>

      <Toast toasts={toasts} onRemove={remove} />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {list.length === 0 && (
          <p className="text-sm text-neutral-500">No addresses yet. Add one to speed up checkout.</p>
        )}
        {list.map((addr) => (
          <div key={addr.id} className="relative border border-neutral-200 bg-white p-6">
            {addr.is_default && (
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                <Home size={11} /> Default
              </span>
            )}
            <p className="font-sans font-bold text-neutral-900">
              {addr.receiver_name}
            </p>
            <p className="mt-2 text-sm text-neutral-600">{addr.address_line}</p>
            <p className="text-sm text-neutral-600">
              {addr.city_province || '—'}
            </p>
            <p className="mt-1 text-sm text-neutral-500">{addr.receiver_phone}</p>
            <div className="mt-4 flex gap-2">
              {!addr.is_default && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black"
                >
                  <Home size={14} /> Set Default
                </button>
              )}
              <button
                onClick={() => openEdit(addr)}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-accent"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Address' : 'Add Address'}
      >
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="label-kh">Receiver Name</label>
            <input
              className="input-kh"
              value={form.receiver_name}
              onChange={(e) => handleChange('receiver_name', e.target.value)}
              required
            />
            {errors.receiver_name && <p className="mt-1 text-xs text-accent">{errors.receiver_name}</p>}
          </div>
          <div>
            <label className="label-kh">Phone</label>
            <input
              className="input-kh"
              value={form.receiver_phone}
              onChange={(e) => handleChange('receiver_phone', e.target.value)}
              required
            />
            {errors.receiver_phone && <p className="mt-1 text-xs text-accent">{errors.receiver_phone}</p>}
          </div>
          <div>
            <label className="label-kh">Address</label>
            <input
              className="input-kh"
              value={form.address_line}
              onChange={(e) => handleChange('address_line', e.target.value)}
              required
            />
            {errors.address_line && <p className="mt-1 text-xs text-accent">{errors.address_line}</p>}
          </div>
          <div>
            <label className="label-kh">City / Province</label>
            <input
              className="input-kh"
              value={form.city_province}
              onChange={(e) => handleChange('city_province', e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_default"
              checked={form.is_default}
              onChange={(e) => handleChange('is_default', e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="is_default" className="text-sm text-neutral-700">Set as default address</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </Modal>
    </AccountLayout>
  );
}
