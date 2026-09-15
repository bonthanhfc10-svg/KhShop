import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import StatCard from '../../components/admin/dashboard/StatCard';
import SalesChart from '../../components/admin/dashboard/SalesChart';
import RecentOrders from '../../components/admin/dashboard/RecentOrders';
import TopProducts from '../../components/admin/dashboard/TopProducts';
import LowStockProducts from '../../components/admin/dashboard/LowStockProducts';
import { productService } from '../../services/admin/productService';
import { orderService } from '../../services/admin/orderService';
import { formatPrice } from '../../utils/formatPrice';
import AdminLoading from '../../components/common/Loading';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([productService.getAll(), orderService.getAll()])
      .then(([p, o]) => {
        if (!mounted) return;
        setProducts(p);
        setOrders(o);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back, Admin</p>
        </div>
        <span className="inline-flex items-center rounded-lg border border-admin-border bg-admin-card px-3.5 py-2 text-sm font-medium text-slate-600">
          Sep 01, 2026 - Sep 07, 2026
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Sales" value={formatPrice(24580)} change={12.5} icon={DollarSign} theme="green" />
        <StatCard label="Total Orders" value="1,248" change={8.2} icon={ShoppingCart} theme="blue" />
        <StatCard label="Total Customers" value="5,432" change={14.3} icon={Users} theme="violet" />
        <StatCard label="Total Products" value="328" change={5.4} icon={Package} theme="amber" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart />
        </div>
        <div className="xl:col-span-1">
          <TopProducts products={products} />
        </div>
      </div>

      {/* Orders row */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentOrders orders={orders} />
        </div>
        <div className="xl:col-span-1">
          <LowStockProducts products={products} />
        </div>
      </div>
    </div>
  );
}
