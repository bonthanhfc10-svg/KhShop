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
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold text-neutral-900">Customers</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your customer base · {filtered.length} customers</p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-admin-border bg-admin-card p-3 shadow-sm sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email..." />
        <div className="flex gap-1.5">
          {['All', 'active', 'inactive'].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s === 'All' ? 'All' : s)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                status === s ? 'bg-[#25A9EB] text-white' : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden border border-admin-border bg-admin-card shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-admin-border-subtle bg-admin-table-header text-xs uppercase tracking-wider text-neutral-500">
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Phone</th>
                <th className="px-5 py-3 font-semibold">Orders</th>
                <th className="px-5 py-3 font-semibold">Total Spent</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/admin/customers/${c.id}`)}
                  className="cursor-pointer border-b border-neutral-50 transition-colors last:border-0 hover:bg-neutral-50/60"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                        {initials(c.name)}
                      </span>
                      <div>
                        <p className="font-medium text-neutral-900">{c.name}</p>
                        <p className="text-xs text-neutral-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">{c.phone}</td>
                  <td className="px-5 py-3 text-neutral-700">{c.orders}</td>
                  <td className="px-5 py-3 font-semibold text-neutral-900">{formatPrice(c.totalSpent)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={c.status === 'active' ? 'Active' : 'Inactive'} />
                  </td>
                  <td className="px-5 py-3 text-neutral-500">{formatDate(c.joined)}</td>
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
                  <p className="truncate font-medium text-neutral-900">{c.name}</p>
                  <p className="truncate text-xs text-neutral-400">{c.email}</p>
                </div>
                <StatusBadge status={c.status === 'active' ? 'Active' : 'Inactive'} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-neutral-900">{formatPrice(c.totalSpent)}</span>
                <span className="text-neutral-500">{c.orders} orders</span>
              </div>
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="font-medium text-neutral-700">No customers found</p>
            <p className="text-sm text-neutral-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
