import { useId } from 'react';

export default function ProductSort({ value, options = [], onChange, count }) {
  const id = useId();
  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-sm font-bold uppercase tracking-widest text-neutral-900">
        {count} {count === 1 ? 'product' : 'products'}
      </span>
      {options.length > 0 && (
        <div className="flex items-center gap-2">
          <label
            htmlFor={id}
            className="text-sm font-bold uppercase tracking-widest text-neutral-900"
          >
            Sort by
          </label>
          <select
            id={id}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value || null)}
            className="border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-black"
          >
            <option value="">Featured</option>
            {options.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
