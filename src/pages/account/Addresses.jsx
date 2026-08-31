import { useState } from 'react';
import { Plus, Pencil, Trash2, Home } from 'lucide-react';
import AccountLayout from './AccountLayout';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { addresses as initialAddresses } from '../../data/addresses';

const emptyAddress = {
  type: 'Home',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'United States',
  phone: '',
};

export default function Addresses() {
  const [list, setList] = useState(initialAddresses);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyAddress);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyAddress);
    setModalOpen(true);
  };

  const openEdit = (addr) => {
    setEditing(addr);
    setForm({ ...addr });
    setModalOpen(true);
  };

  const handleChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      setList((l) => l.map((a) => (a.id === editing.id ? { ...editing, ...form } : a)));
    } else {
      setList((l) => [...l, { ...form, id: Date.now(), isDefault: l.length === 0 }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setList((l) => l.filter((a) => a.id !== id));
  };

  return (
    <AccountLayout>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-neutral-900">Addresses</h2>
        <Button onClick={openAdd} size="sm">
          <Plus size={15} /> Add Address
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {list.length === 0 && (
          <p className="text-sm text-neutral-500">No addresses yet. Add one to speed up checkout.</p>
        )}
        {list.map((addr) => (
          <div key={addr.id} className="relative border border-neutral-200 bg-white p-6">
            {addr.isDefault && (
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                <Home size={11} /> Default
              </span>
            )}
            <p className="font-display font-bold text-neutral-900">
              {addr.type}
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              {addr.firstName} {addr.lastName}
            </p>
            <p className="text-sm text-neutral-600">{addr.address}</p>
            <p className="text-sm text-neutral-600">
              {addr.city}, {addr.postalCode}
            </p>
            <p className="text-sm text-neutral-600">{addr.country}</p>
            <p className="mt-1 text-sm text-neutral-500">{addr.phone}</p>
            <div className="mt-4 flex gap-2">
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
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-kh">First Name</label>
            <input
              className="input-kh"
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-kh">Last Name</label>
            <input
              className="input-kh"
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-kh">Street Address</label>
            <input
              className="input-kh"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-kh">City</label>
            <input
              className="input-kh"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-kh">Postal Code</label>
            <input
              className="input-kh"
              value={form.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-kh">Country</label>
            <input
              className="input-kh"
              value={form.country}
              onChange={(e) => handleChange('country', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-kh">Phone</label>
            <input
              className="input-kh"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Address
            </button>
          </div>
        </form>
      </Modal>
    </AccountLayout>
  );
}
