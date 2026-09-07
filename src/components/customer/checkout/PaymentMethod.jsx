import { CreditCard, Landmark, Smartphone } from 'lucide-react';

const methods = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    icon: CreditCard,
  },
  {
    id: 'paypal',
    label: 'PayPal',
    icon: Landmark,
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    icon: Smartphone,
  },
];

export default function PaymentMethod({ method, onChange, card, onCardChange }) {
  return (
    <div>
      <div className="space-y-3">
        {methods.map((m) => {
          const selected = method === m.id;
          return (
            <label
              key={m.id}
              className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors ${
                selected ? 'border-black' : 'border-neutral-300 hover:border-neutral-400'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={m.id}
                checked={selected}
                onChange={() => onChange(m.id)}
                className="h-4 w-4 accent-black"
              />
              <m.icon size={20} className="text-neutral-600" />
              <span className="text-sm font-medium text-neutral-900">{m.label}</span>
            </label>
          );
        })}
      </div>

      {method === 'card' && (
        <div className="mt-5 border border-neutral-200 bg-neutral-50 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="cardNumber" className="label-kh">Card Number</label>
              <input
                id="cardNumber"
                className="input-kh"
                value={card.number}
                onChange={(e) => onCardChange('number', e.target.value)}
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
              />
            </div>
            <div>
              <label htmlFor="cardName" className="label-kh">Name on Card</label>
              <input
                id="cardName"
                className="input-kh"
                value={card.name}
                onChange={(e) => onCardChange('name', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="exp" className="label-kh">Expiry</label>
                <input
                  id="exp"
                  className="input-kh"
                  value={card.expiry}
                  onChange={(e) => onCardChange('expiry', e.target.value)}
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label htmlFor="cvv" className="label-kh">CVV</label>
                <input
                  id="cvv"
                  className="input-kh"
                  value={card.cvv}
                  onChange={(e) => onCardChange('cvv', e.target.value)}
                  placeholder="123"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
