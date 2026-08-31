import InfoPage from '../../components/info/InfoPage';

const ROWS = [
  ['Standard Delivery', '3–5 business days', 'Free over $50, otherwise $6'],
  ['Express Delivery', '1–2 business days', '$12'],
  ['Next-Day', 'Delivery by end of next day', '$18'],
  ['Returns', 'Return within 30 days of delivery', 'Free'],
];

export default function Shipping() {
  return (
    <InfoPage
      title="Shipping & Delivery"
      crumb="Shipping"
      intro="We ship worldwide from our warehouse. Standard, express and next-day options are available at checkout."
    >
      <div className="overflow-hidden border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-neutral-50 text-xs font-bold uppercase tracking-widest text-neutral-600">
              <th className="px-4 py-3">Option</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3">Cost</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r[0]} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-semibold text-neutral-900">{r[0]}</td>
                <td className="px-4 py-3 text-neutral-600">{r[1]}</td>
                <td className="px-4 py-3 text-neutral-600">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="heading-display mt-12 text-2xl">Order Tracking</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-neutral-700">
        As soon as your order ships, you'll receive a confirmation email with a
        tracking number. You can follow your parcel's journey in your account
        under Orders.
      </p>
    </InfoPage>
  );
}
