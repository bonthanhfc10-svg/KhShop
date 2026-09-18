import SearchInput from '../common/SearchInput';
import AdminButton from '../common/AdminButton';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { categoryService } from '../../../services/admin/categoryService';

export default function ProductFilters({ search, onSearch, onSearchCommit, category, onCategory, status, onStatus }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.getAll().then((cats) => {
      const entries = [];
      cats.forEach((cat) => {
        (cat.children || []).forEach((child) => {
          entries.push({ id: child.id, name: child.name, parentName: cat.name });
        });
      });

      const nameCount = {};
      entries.forEach((e) => {
        nameCount[e.name] = (nameCount[e.name] || 0) + 1;
      });

      const childCategories = entries.map((e) => ({
        id: e.id,
        label: nameCount[e.name] > 1 ? `${e.name} (${e.parentName})` : e.name,
      }));

      setCategories(childCategories);
    }).catch(() => {});
  }, []);

  const selectCls =
    'rounded-lg border border-gray-300 bg-admin-card-elevated px-3 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15';

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-admin-border bg-admin-card p-4 shadow-sm sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-2">
        <SearchInput value={search} onChange={onSearch} onCommit={onSearchCommit} placeholder="Search products..." />
        <AdminButton variant="primary" size="sm" onClick={onSearchCommit}>
          <Search size={14} /> Search
        </AdminButton>
      </div>
      <div className="flex gap-2">
        <select value={category} onChange={(e) => onCategory(e.target.value)} className={selectCls} aria-label="Filter by category">
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
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
