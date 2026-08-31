import { useAuth } from '../../context/AuthContext';
import ShippingForm from './ShippingForm';

export default function CheckoutForm({ values, errors, onChange }) {
  const { user } = useAuth();

  const setField = (name, value) => onChange(name, value);

  return (
    <div>
      <div>
        <label htmlFor="email" className="label-kh">Email Address</label>
        <input
          id="email"
          className="input-kh"
          type="email"
          defaultValue={user?.email || ''}
          value={values.email || ''}
          onChange={(e) => setField('email', e.target.value)}
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-accent">{errors.email}</p>}
      </div>

      <div className="mt-8">
        <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-neutral-900">
          Shipping Address
        </h3>
        <ShippingForm values={values} errors={errors} onChange={setField} />
      </div>
    </div>
  );
}
