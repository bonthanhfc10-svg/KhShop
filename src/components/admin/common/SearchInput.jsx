import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative flex-1 ${className}`}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-4 text-sm text-neutral-900 outline-none transition-all focus:border-neutral-400 focus:bg-white"
      />
    </div>
  );
}
