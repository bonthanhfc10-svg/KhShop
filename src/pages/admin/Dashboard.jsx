import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import StatCard from '../../components/admin/dashboard/StatCard';
import SalesChart from '../../components/admin/dashboard/SalesChart';
import RecentOrders from '../../components/admin/dashboard/RecentOrders';
import TopProducts from '../../components/admin/dashboard/TopProducts';
import LowStockProducts from '../../components/admin/dashboard/LowStockProducts';
import { dashboardService } from '../../services/admin/dashboardService';
import { formatPrice } from '../../utils/formatPrice';
import AdminLoading from '../../components/common/Loading';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    dashboardService
      .getDashboard()
      .then((res) => {
        if (!mounted) return;
        setData(res);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <AdminLoading />;

  const summary = data?.summary ?? {};
  const recentOrders = data?.recent_orders ?? [];
  const topProducts = data?.top_products ?? [];
  const lowStock = data?.low_stock ?? [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back, Admin</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Sales" value={formatPrice(summary.total_sales ?? 0)} icon={DollarSign} theme="green" />
        <StatCard label="Total Orders" value={(summary.total_orders ?? 0).toLocaleString()} icon={ShoppingCart} theme="blue" />
        <StatCard label="Total Customers" value={(summary.total_customers ?? 0).toLocaleString()} icon={Users} theme="violet" />
        <StatCard label="Total Products" value={(summary.total_products ?? 0).toLocaleString()} icon={Package} theme="amber" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart />
        </div>
        <div className="xl:col-span-1">
          <TopProducts products={topProducts} />
        </div>
      </div>

      {/* Orders row */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentOrders orders={recentOrders} />
        </div>
        <div className="xl:col-span-1">
          <LowStockProducts products={lowStock} />
        </div>
      </div>
    </div>
  );
}
