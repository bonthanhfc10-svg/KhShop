import { Link } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle2,
  Heart,
  ArrowRight,
} from 'lucide-react';
import AccountLayout from './AccountLayout';
import { orders } from '../../data/orders';
import { orderTotal } from '../../utils/orderUtils';
import { formatPrice } from '../../utils/formatPrice';
import { useWishlist } from '../../context/WishlistContext';

export default function Account() {
  const { wishlistCount } = useWishlist();

  const completed = orders.filter((o) => o.status === 'Delivered').length;
  const pending = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Shipped'
  ).length;

  const cards = [
    { label: 'Total Orders', value: orders.length, icon: Package },
    { label: 'Pending Orders', value: pending, icon: Clock },
    { label: 'Completed Orders', value: completed, icon: CheckCircle2 },
    { label: 'Wishlist Items', value: wishlistCount, icon: Heart },
  ];

  return (
    <AccountLayout>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-4 border border-neutral-200 bg-white p-6"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100">
              <c.icon size={22} className="text-neutral-700" />
            </span>
            <div>
              <p className="font-display text-3xl font-extrabold text-neutral-900">
                {c.value}
              </p>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                {c.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mt-10 border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <Link to="/account/orders" className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-neutral-900 hover:underline">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-neutral-100">
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="font-semibold text-neutral-900">{order.id}</p>
                <p className="text-sm text-neutral-500">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  order.status === 'Delivered'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'Shipped'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {order.status}
              </span>
              <span className="font-bold text-neutral-900">
                {formatPrice(orderTotal(order))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}
