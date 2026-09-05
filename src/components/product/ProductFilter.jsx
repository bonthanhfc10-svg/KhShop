import { useState, useEffect } from 'react';
import { ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';

const DROPDOWN_BTN =
  'flex items-center gap-2 border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-900 transition-all duration-200 hover:border-black hover:bg-white';
const DROPDOWN_BTN_OPEN = ' border-black bg-white';
const DROPDOWN_PANEL =
  'absolute left-0 top-full z-30 mt-2 min-w-64 space-y-2 border border-neutral-200 bg-white p-5 shadow-2xl';

export default function ProductFilter({ facets, filters, onChange, onReset, onApply }) {
  return (
    <div className="space-y-8">
      <Facet
        title="Size"
        type="checkbox"
        options={facets.sizes}
        value={filters.sizes}
        onChange={(v) => onChange({ sizes: v })}
      />
      <Facet
        title="Color"
        type="color"
        options={facets.colors}
        value={filters.colors}
        onChange={(v) => onChange({ colors: v })}
      />
      <PriceFacet
        min={facets.price?.min || 0}
        max={facets.price?.max || 200}
        value={filters.price}
        onChange={(v) => onChange({ price: v })}
      />
      <Facet
        title="Brand"
        type="checkbox"
        options={facets.brands}
        value={filters.brands}
        onChange={(v) => onChange({ brands: v })}
      />

      <div className="space-y-3 border-t border-neutral-200 pt-6">
        <button
          onClick={onApply}
          className="btn-primary w-full"
        >
          Apply Filters
        </button>
        <button
          onClick={onReset}
          className="w-full text-center text-xs font-semibold uppercase tracking-widest text-neutral-500 transition-colors hover:text-black"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}

function Facet({
  title,
  type,
  options = [],
  value,
  onChange,
  variant = 'vertical',
  open: openProp,
  onToggle,
}) {
  const [localOpen, setLocalOpen] = useState(variant !== 'dropdown');
  const open = typeof onToggle === 'function' ? openProp : localOpen;
  const toggleOpen = () =>
    typeof onToggle === 'function'
      ? onToggle()
      : setLocalOpen((o) => !o);

  const isChecked = (opt) =>
    Array.isArray(value) ? value.includes(opt) : value === opt;

  const toggle = (opt) => {
    if (type === 'radio') {
      onChange(value === opt ? null : opt);
      return;
    }
    const arr = Array.isArray(value) ? [...value] : [];
    onChange(
      arr.includes(opt)
        ? arr.filter((v) => v !== opt)
        : [...arr, opt]
    );
  };

  return (
    <div className={variant === 'dropdown' ? 'relative' : ''}>
      <button
        onClick={toggleOpen}
        className={
          variant === 'dropdown'
            ? `${DROPDOWN_BTN}${open ? DROPDOWN_BTN_OPEN : ''}`
            : 'flex w-full items-center justify-between py-2'
        }
        aria-expanded={open}
      >
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
          {title}
        </h4>
        <span
          className={`flex h-6 w-6 items-center justify-center transition-colors ${
            open ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-600'
          }`}
        >
          <ChevronDown
            size={14}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {open && (
        <div
          className={
            variant === 'dropdown'
              ? DROPDOWN_PANEL
              : 'mt-2 space-y-2 border-t border-neutral-200 pt-3'
          }
        >
          {type === 'color' ? (
            <div className="flex flex-wrap gap-2">
              {options.map((opt) => {
                const selected = isChecked(opt.name);
                return (
                  <button
                    key={opt.name}
                    onClick={() => toggle(opt)}
                    aria-label={opt.name}
                    title={opt.name}
                    className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      selected ? 'border-black' : 'border-neutral-300'
                    }`}
                    style={{ backgroundColor: opt.hex }}
                  />
                );
              })}
            </div>
          ) : (
            options.map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-3">
                <input
                  type={type === 'radio' ? 'radio' : 'checkbox'}
                  checked={isChecked(opt)}
                  onChange={() => toggle(opt)}
                  className="h-4 w-4 accent-black"
                />
                <span className="text-sm text-neutral-700">{opt}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function PriceFacet({
  min,
  max,
  value,
  onChange,
  variant = 'vertical',
  open: openProp,
  onToggle,
}) {
  const [localOpen, setLocalOpen] = useState(variant !== 'dropdown');
  const open = typeof onToggle === 'function' ? openProp : localOpen;
  const toggleOpen = () =>
    typeof onToggle === 'function'
      ? onToggle()
      : setLocalOpen((o) => !o);
  const [localMin, setLocalMin] = useState(value?.min ?? min);
  const [localMax, setLocalMax] = useState(value?.max ?? max);

  useEffect(() => {
    setLocalMin(value?.min ?? min);
    setLocalMax(value?.max ?? max);
  }, [value, min, max]);

  const apply = () => {
    onChange({
      min: Math.min(localMin, localMax),
      max: Math.max(localMin, localMax),
    });
  };

  return (
    <div className={variant === 'dropdown' ? 'relative' : ''}>
      <button
        onClick={toggleOpen}
        className={
          variant === 'dropdown'
            ? `${DROPDOWN_BTN}${open ? DROPDOWN_BTN_OPEN : ''}`
            : 'flex w-full items-center justify-between py-2'
        }
        aria-expanded={open}
      >
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
          Price
        </h4>
        <span
          className={`flex h-6 w-6 items-center justify-center transition-colors ${
            open ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-600'
          }`}
        >
          <ChevronDown
            size={14}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>
      {open && (
        <div
          className={
            variant === 'dropdown'
              ? `${DROPDOWN_PANEL} w-64`
              : 'mt-2 space-y-3 border-t border-neutral-200 pt-3'
          }
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={localMin}
              onChange={(e) => setLocalMin(Number(e.target.value))}
              className="input-kh px-3 py-2"
              aria-label="Minimum price"
            />
            <span className="text-neutral-400">—</span>
            <input
              type="number"
              value={localMax}
              onChange={(e) => setLocalMax(Number(e.target.value))}
              className="input-kh px-3 py-2"
              aria-label="Maximum price"
            />
          </div>
          <button onClick={apply} className="btn-secondary w-full px-4 py-2 text-[11px]">
            Apply
          </button>
          <p className="text-xs text-neutral-500">
            {formatPrice(value?.min ?? min)} – {formatPrice(value?.max ?? max)}
          </p>
        </div>
      )}
    </div>
  );
}

export function FilterBar({ facets, filters, onChange, onReset, onApply }) {
  const [openFacet, setOpenFacet] = useState(null);
  const facetProps = (key) => ({
    variant: 'dropdown',
    open: openFacet === key,
    onToggle: () => setOpenFacet((cur) => (cur === key ? null : key)),
  });

  return (
    <div className="mb-8 hidden flex-wrap items-center gap-2.5 border-b border-neutral-200 pb-5 lg:flex">
      <span className="mr-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
        <SlidersHorizontal size={14} className="text-neutral-500" />
        Filters
      </span>
      <span className="mr-2 hidden h-6 w-px bg-neutral-200 sm:block" />

      <Facet
        title="Size"
        type="checkbox"
        options={facets.sizes}
        value={filters.sizes}
        onChange={(v) => onChange({ sizes: v })}
        {...facetProps('size')}
      />
      <Facet
        title="Color"
        type="color"
        options={facets.colors}
        value={filters.colors}
        onChange={(v) => onChange({ colors: v })}
        {...facetProps('color')}
      />
      <PriceFacet
        min={facets.price?.min || 0}
        max={facets.price?.max || 200}
        value={filters.price}
        onChange={(v) => onChange({ price: v })}
        {...facetProps('price')}
      />
      <Facet
        title="Brand"
        type="checkbox"
        options={facets.brands}
        value={filters.brands}
        onChange={(v) => onChange({ brands: v })}
        {...facetProps('brand')}
      />

      <div className="ml-auto flex items-center gap-4">
        <button onClick={onApply} className="btn-primary px-6 py-3 text-[11px]">
          Apply Filters
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:text-black"
        >
          <RotateCcw size={14} />
          Reset All
        </button>
      </div>
    </div>
  );
}
