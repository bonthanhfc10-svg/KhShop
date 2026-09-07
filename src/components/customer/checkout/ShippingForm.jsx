export default function ShippingForm({ values, errors, onChange }) {
  const field = (name) => ({
    value: values[name] || '',
    error: errors[name],
    onChange: (e) => onChange(name, e.target.value),
  });

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="label-kh">First Name</label>
          <input id="firstName" className="input-kh" {...field('firstName')} />
          {errors.firstName && <p className="mt-1 text-xs text-accent">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="label-kh">Last Name</label>
          <input id="lastName" className="input-kh" {...field('lastName')} />
          {errors.lastName && <p className="mt-1 text-xs text-accent">{errors.lastName}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="address" className="label-kh">Street Address</label>
        <input id="address" className="input-kh" {...field('address')} placeholder="House number and street" />
        {errors.address && <p className="mt-1 text-xs text-accent">{errors.address}</p>}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="label-kh">City</label>
          <input id="city" className="input-kh" {...field('city')} />
          {errors.city && <p className="mt-1 text-xs text-accent">{errors.city}</p>}
        </div>
        <div>
          <label htmlFor="postalCode" className="label-kh">Postal Code</label>
          <input id="postalCode" className="input-kh" {...field('postalCode')} />
          {errors.postalCode && <p className="mt-1 text-xs text-accent">{errors.postalCode}</p>}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="country" className="label-kh">Country</label>
          <select
            id="country"
            value={values.country || 'United States'}
            onChange={(e) => onChange('country', e.target.value)}
            className="input-kh"
          >
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Canada</option>
            <option>Australia</option>
            <option>Germany</option>
          </select>
        </div>
        <div>
          <label htmlFor="phone" className="label-kh">Phone</label>
          <input id="phone" className="input-kh" {...field('phone')} placeholder="+1 555 000 0000" />
          {errors.phone && <p className="mt-1 text-xs text-accent">{errors.phone}</p>}
        </div>
      </div>
    </div>
  );
}
