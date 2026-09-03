import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import SalesChart from '../components/dashboard/SalesChart';
import RecentOrders from '../components/dashboard/RecentOrders';
import TopProducts from '../components/dashboard/TopProducts';
import LowStockProducts from '../components/dashboard/LowStockProducts';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { formatPrice } from '../../utils/formatPrice';
import AdminLoading from '../components/common/Loading';

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
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="mt-1.5 text-base text-neutral-500">Welcome back, Admin 👋</p>
        </div>
        <span className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-base text-neutral-600 shadow-sm">
          Sep 01, 2026 - Sep 07, 2026
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Sales" value={formatPrice(24580)} change={12.5} icon={DollarSign} />
        <StatCard label="Total Orders" value="1,248" change={8.2} icon={ShoppingCart} />
        <StatCard label="Total Customers" value="5,432" change={14.3} icon={Users} />
        <StatCard label="Total Products" value="328" change={5.4} icon={Package} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart />
        </div>
        <div className="xl:col-span-1">
          <TopProducts products={products} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
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
