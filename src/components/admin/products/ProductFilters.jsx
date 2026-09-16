import SearchInput from '../common/SearchInput';
import { useEffect, useState } from 'react';
import { productService } from '../../../services/admin/productService';

export default function ProductFilters({ search, onSearch, onSearchCommit, category, onCategory, status, onStatus }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productService.getCategories({ per_page: 100 }).then((result) => {
      setCategories(result.items || []);
    }).catch(() => {});
  }, []);

  const selectCls =
    'rounded-lg border border-gray-300 bg-admin-card-elevated px-3 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15';

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-admin-border bg-admin-card p-4 shadow-sm sm:flex-row sm:items-center">
      <SearchInput value={search} onChange={onSearch} onCommit={onSearchCommit} placeholder="Search products..." />
      <div className="flex gap-2">
        <select value={category} onChange={(e) => onCategory(e.target.value)} className={selectCls} aria-label="Filter by category">
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
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
