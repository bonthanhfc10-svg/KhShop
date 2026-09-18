import { useState, useEffect, useCallback } from 'react';
import { useSettings } from '../../../hooks/useSettings';
import AdminLoading from '../../../components/common/Loading';

const sectionList = [
  { key: 'general', label: 'General' },
  { key: 'store', label: 'Store' },
  { key: 'checkout', label: 'Checkout' },
  { key: 'order', label: 'Order' },
];

const inputCls =
  'w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15';
const labelCls = 'mb-1.5 block text-sm font-medium text-neutral-700';
const toggleCls = 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-300 transition-colors duration-200 ease-in-out focus:outline-none';
const toggleActiveCls = 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#25A9EB] transition-colors duration-200 ease-in-out focus:outline-none';

function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!value}
      onClick={() => onChange(!value)}
      className={value ? toggleActiveCls : toggleCls}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          value ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const { settings, loading, saving, error, savedMsg, updateSettings } = useSettings();
  const [active, setActive] = useState('general');
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const update = useCallback((key, value) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const updateGroup = useCallback((group, key, value) => {
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [group]: { ...prev[group], [key]: value },
      };
    });
  }, []);

  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      if (!form) return;
      try {
        await updateSettings(form);
      } catch {
        // error handled by hook
      }
    },
    [form, updateSettings],
  );

  if (loading) return <AdminLoading />;

  if (error && !form) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="mt-1 text-sm text-neutral-500">Configure your store settings.</p>
        </div>
        {savedMsg && (
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            Changes saved
          </span>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Section Nav */}
        <nav className="lg:w-56 lg:shrink-0" aria-label="Settings sections">
          <div className="flex gap-2 overflow-x-auto rounded-lg border border-admin-border bg-admin-card p-2 lg:flex-col">
            {sectionList.map((s) => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`rounded-lg px-3.5 py-2 text-left text-sm font-medium transition-colors ${
                  active === s.key ? 'bg-[#25A9EB] text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Form */}
        <form onSubmit={handleSave} className="min-w-0 flex-1 space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ============ GENERAL ============ */}
          {active === 'general' && (
            <div className="border border-admin-border bg-admin-card p-6 shadow-sm">
              <h2 className="mb-4 font-sans text-lg font-semibold text-neutral-900">General</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Store Name</label>
                  <input
                    value={form.general?.store_name ?? ''}
                    onChange={(e) => updateGroup('general', 'store_name', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Store Email</label>
                  <input
                    type="email"
                    value={form.general?.store_email ?? ''}
                    onChange={(e) => updateGroup('general', 'store_email', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Store Phone</label>
                  <input
                    value={form.general?.store_phone ?? ''}
                    onChange={(e) => updateGroup('general', 'store_phone', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Store Address</label>
                  <input
                    value={form.general?.store_address ?? ''}
                    onChange={(e) => updateGroup('general', 'store_address', e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============ STORE ============ */}
          {active === 'store' && (
            <div className="border border-admin-border bg-admin-card p-6 shadow-sm">
              <h2 className="mb-4 font-sans text-lg font-semibold text-neutral-900">Store</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Currency</label>
                  <select
                    value={form.store?.currency ?? 'USD'}
                    onChange={(e) => updateGroup('store', 'currency', e.target.value)}
                    className={inputCls}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="KHR">KHR - Cambodian Riel</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Tax Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.store?.tax_rate ?? 0}
                    onChange={(e) => updateGroup('store', 'tax_rate', parseFloat(e.target.value) || 0)}
                    className={inputCls}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-admin-border px-4 py-3 md:col-span-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Maintenance Mode</p>
                    <p className="text-xs text-neutral-400">Temporarily disable public access to the store.</p>
                  </div>
                  <Toggle
                    value={form.store?.maintenance_mode ?? false}
                    onChange={(v) => updateGroup('store', 'maintenance_mode', v)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============ CHECKOUT ============ */}
          {active === 'checkout' && (
            <div className="border border-admin-border bg-admin-card p-6 shadow-sm">
              <h2 className="mb-4 font-sans text-lg font-semibold text-neutral-900">Checkout</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Shipping Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.checkout?.shipping_fee ?? 0}
                    onChange={(e) => updateGroup('checkout', 'shipping_fee', parseFloat(e.target.value) || 0)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Free Shipping Threshold ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.checkout?.free_shipping_threshold ?? 0}
                    onChange={(e) => updateGroup('checkout', 'free_shipping_threshold', parseFloat(e.target.value) || 0)}
                    className={inputCls}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-admin-border px-4 py-3 md:col-span-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Guest Checkout</p>
                    <p className="text-xs text-neutral-400">Allow customers to place orders without creating an account.</p>
                  </div>
                  <Toggle
                    value={form.checkout?.guest_checkout ?? false}
                    onChange={(v) => updateGroup('checkout', 'guest_checkout', v)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============ ORDER ============ */}
          {active === 'order' && (
            <div className="border border-admin-border bg-admin-card p-6 shadow-sm">
              <h2 className="mb-4 font-sans text-lg font-semibold text-neutral-900">Order</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Default Order Status</label>
                  <select
                    value={form.order?.default_order_status ?? 'pending'}
                    onChange={(e) => updateGroup('order', 'default_order_status', e.target.value)}
                    className={inputCls}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-admin-border px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Allow Cancellation</p>
                    <p className="text-xs text-neutral-400">Allow customers to cancel their orders.</p>
                  </div>
                  <Toggle
                    value={form.order?.allow_cancellation ?? true}
                    onChange={(v) => updateGroup('order', 'allow_cancellation', v)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-admin-border px-4 py-3 md:col-span-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Auto Cancel Pending Orders</p>
                    <p className="text-xs text-neutral-400">Automatically cancel orders that remain pending.</p>
                  </div>
                  <Toggle
                    value={form.order?.auto_cancel_pending ?? false}
                    onChange={(v) => updateGroup('order', 'auto_cancel_pending', v)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
