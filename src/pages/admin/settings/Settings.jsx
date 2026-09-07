import { useState } from 'react';

const sectionList = [
  { key: 'general', label: 'General' },
  { key: 'store', label: 'Store Settings' },
  { key: 'payment', label: 'Payment' },
  { key: 'shipping', label: 'Shipping' },
];

const inputCls =
  'w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-neutral-400';
const labelCls = 'mb-1.5 block text-sm font-medium text-neutral-700';

export default function Settings() {
  const [active, setActive] = useState('general');
  const [savedMsg, setSavedMsg] = useState(false);

  const [form, setForm] = useState({
    storeName: 'KHShop',
    storeEmail: 'admin@khshop.com',
    phone: '+1 555 010 0000',
    address: '221 Springfield Lane, Denver, CO 80210',
    currency: 'USD',
    timezone: 'UTC-7',
    tax: '8.25',
    freeShippingThreshold: '75',
    shippingFee: '5.99',
    paymentMethods: ['Credit Card', 'PayPal', 'Cash on Delivery'],
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="mt-1 text-sm text-neutral-500">Configure your store.</p>
        </div>
        {savedMsg && (
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            Changes saved
          </span>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Nav */}
        <nav className="lg:w-56 lg:shrink-0" aria-label="Settings sections">
          <div className="flex gap-2 overflow-x-auto rounded-lg border border-neutral-200 bg-white p-2 lg:flex-col">
            {sectionList.map((s) => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`rounded-lg px-3.5 py-2 text-left text-sm font-medium transition-colors ${
                  active === s.key ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <form onSubmit={handleSave} className="min-w-0 flex-1 space-y-6">
          {active === 'general' && (
            <div className="border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-display text-lg font-semibold text-neutral-900">General</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Store Name</label>
                  <input value={form.storeName} onChange={(e) => update('storeName', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Store Email</label>
                  <input type="email" value={form.storeEmail} onChange={(e) => update('storeEmail', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputCls} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Address</label>
                  <input value={form.address} onChange={(e) => update('address', e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {active === 'store' && (
            <div className="border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-display text-lg font-semibold text-neutral-900">Store Settings</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Currency</label>
                  <select value={form.currency} onChange={(e) => update('currency', e.target.value)} className={inputCls}>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Timezone</label>
                  <select value={form.timezone} onChange={(e) => update('timezone', e.target.value)} className={inputCls}>
                    <option value="UTC-7">UTC-7 (Denver)</option>
                    <option value="UTC-5">UTC-5 (New York)</option>
                    <option value="UTC+0">UTC+0 (London)</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Tax Rate (%)</label>
                  <input type="number" value={form.tax} onChange={(e) => update('tax', e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {active === 'payment' && (
            <div className="border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-display text-lg font-semibold text-neutral-900">Payment Methods</h2>
              <div className="space-y-3">
                {['Credit Card', 'PayPal', 'Cash on Delivery', 'Bank Transfer'].map((m) => (
                  <label key={m} className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
                    <span className="text-sm font-medium text-neutral-700">{m}</span>
                    <input
                      type="checkbox"
                      checked={form.paymentMethods.includes(m)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...form.paymentMethods, m]
                          : form.paymentMethods.filter((x) => x !== m);
                        update('paymentMethods', next);
                      }}
                      className="h-4 w-4 accent-neutral-900"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {active === 'shipping' && (
            <div className="border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-display text-lg font-semibold text-neutral-900">Shipping</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Shipping Fee ($)</label>
                  <input type="number" value={form.shippingFee} onChange={(e) => update('shippingFee', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Free Shipping Threshold ($)</label>
                  <input type="number" value={form.freeShippingThreshold} onChange={(e) => update('freeShippingThreshold', e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Standard', 'Express'].map((m) => (
                  <span key={m} className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">{m}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
