import { useState } from 'react';
import { Check } from 'lucide-react';
import InfoPage from '../../components/info/InfoPage';

const DETAILS = [
  { label: 'Email', value: 'support@khshop.com' },
  { label: 'Phone', value: '+1 (555) 013-4280' },
  { label: 'Hours', value: 'Mon–Fri, 9am–6pm' },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <InfoPage
      title="Contact Us"
      crumb="Contact"
      intro="Questions about an order, sizing or a product? Our team is here to help."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_240px]">
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-neutral-600">
                Name
              </label>
              <input
                required
                type="text"
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-neutral-600">
                Email
              </label>
              <input
                required
                type="email"
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-neutral-600">
              Subject
            </label>
            <input
              required
              type="text"
              className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
              placeholder="How can we help?"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-neutral-600">
              Message
            </label>
            <textarea
              required
              rows={5}
              className="w-full resize-none border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
              placeholder="Write your message…"
            />
          </div>
          <button type="submit" className="btn-primary px-8 py-3.5">
            {sent ? (
              <>
                <Check size={16} /> Message Sent
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>

        <aside className="space-y-6 border-t border-neutral-200 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          {DETAILS.map((d) => (
            <div key={d.label}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                {d.label}
              </h3>
              <p className="mt-1.5 text-sm font-medium text-neutral-900">
                {d.value}
              </p>
            </div>
          ))}
        </aside>
      </div>
    </InfoPage>
  );
}
