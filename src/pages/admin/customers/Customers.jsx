import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../../../components/admin/common/SearchInput';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import AdminLoading from '../../../components/common/Loading';
import { useCustomers } from '../../../hooks/useCustomers';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';

export default function Customers() {
  const { customers, loading } = useCustomers();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const navigate = useNavigate();

  const filtered = useMemo(
    () =>
      customers.filter((c) => {
        const matchSearch =
          !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus = status === 'All' || c.status === status;
        return matchSearch && matchStatus;
      }),
    [customers, search, status]
  );

  if (loading) return <AdminLoading />;

  const initials = (n) =>
    n.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customers</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your customer base &middot; {filtered.length} customers</p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-admin-border bg-admin-card p-3 shadow-sm sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email..." />
        <div className="flex gap-1.5">
          {['All', 'active', 'inactive'].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s === 'All' ? 'All' : s)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                status === s ? 'bg-[#25A9EB] text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-card shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-admin-border bg-admin-table-header">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Customer</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Phone</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Orders</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Total Spent</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border-subtle">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/admin/customers/${c.id}`)}
                  className="cursor-pointer transition-colors hover:bg-admin-primary-light/20"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                        {initials(c.name)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{c.phone}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{c.orders}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{formatPrice(c.totalSpent)}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={c.status === 'active' ? 'Active' : 'Inactive'} />
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{formatDate(c.joined)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-admin-border-subtle md:hidden">
          {filtered.map((c) => (
            <div key={c.id} className="cursor-pointer p-4" onClick={() => navigate(`/admin/customers/${c.id}`)}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                  {initials(c.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{c.name}</p>
                  <p className="truncate text-xs text-slate-400">{c.email}</p>
                </div>
                <StatusBadge status={c.status === 'active' ? 'Active' : 'Inactive'} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900">{formatPrice(c.totalSpent)}</span>
                <span className="text-slate-500">{c.orders} orders</span>
              </div>
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-semibold text-slate-700">No customers found</p>
            <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
