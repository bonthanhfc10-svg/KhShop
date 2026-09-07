import { useId } from 'react';

const options = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'best-selling', label: 'Best Selling' },
];

export default function ProductSort({ value, onChange, count }) {
  const id = useId();
  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-sm font-bold uppercase tracking-widest text-neutral-900">
        {count} {count === 1 ? 'product' : 'products'}
      </span>
      <div className="flex items-center gap-2">
        <label
          htmlFor={id}
          className="text-sm font-bold uppercase tracking-widest text-neutral-900"
        >
          Sort by
        </label>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-black"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
