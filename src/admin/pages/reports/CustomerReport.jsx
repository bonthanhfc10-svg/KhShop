import { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Users } from 'lucide-react';
import Card from '../../components/common/Card';
import AdminLoading from '../../components/common/Loading';
import { reportService } from '../../services/reportService';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';

export default function CustomerReport() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    reportService.getTopCustomers().then((data) => {
      if (mounted) setCustomers(data);
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <AdminLoading />;

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const returnRate = 32;

  const kpis = [
    { label: 'New Customers', value: '1,204', icon: UserPlus },
    { label: 'Returning Customers', value: '4,228', icon: UserCheck },
    { label: 'Return Rate', value: `${returnRate}%`, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Customer Report</h1>
        <p className="mt-1 text-sm text-neutral-500">Customer acquisition and spending insights.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
              <k.icon size={18} className="text-neutral-700" />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-neutral-900">{k.value}</p>
            <p className="mt-1 text-sm text-neutral-500">{k.label}</p>
          </div>
        ))}
      </div>

      <Card title="Top Customers" subtitle={`By total spending · ${formatPrice(totalRevenue)} combined`} bodyClassName="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-xs uppercase tracking-wider text-neutral-500">
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Joined</th>
              <th className="px-5 py-3 text-right font-semibold">Orders</th>
              <th className="px-5 py-3 text-right font-semibold">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                      {c.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-neutral-900">{c.name}</p>
                      <p className="text-xs text-neutral-400">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-neutral-500">{formatDate(c.joined)}</td>
                <td className="px-5 py-3 text-right font-semibold text-neutral-900">{c.orders}</td>
                <td className="px-5 py-3 text-right text-neutral-700">{formatPrice(c.totalSpent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
