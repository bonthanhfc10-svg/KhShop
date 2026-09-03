import SearchInput from '../common/SearchInput';

export default function ProductFilters({ search, onSearch, category, onCategory, status, onStatus }) {
  const selectCls =
    'rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none transition-colors focus:border-neutral-400';

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
      <SearchInput value={search} onChange={onSearch} placeholder="Search products..." />
      <div className="flex gap-2">
        <select value={category} onChange={(e) => onCategory(e.target.value)} className={selectCls} aria-label="Filter by category">
          <option value="all">All Categories</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
          <option value="sport">Sport</option>
        </select>
        <select value={status} onChange={(e) => onStatus(e.target.value)} className={selectCls} aria-label="Filter by status">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>
  );
}
