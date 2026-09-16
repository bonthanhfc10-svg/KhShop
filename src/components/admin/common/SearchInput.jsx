import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, onCommit, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative flex-1 ${className}`}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onCommit?.();
        }}
        onBlur={() => onCommit?.()}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-admin-card-elevated py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15"
      />
    </div>
  );
}
