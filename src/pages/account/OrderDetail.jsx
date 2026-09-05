import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import AccountLayout from './AccountLayout';
import { getOrderById } from '../../data/orders';
import NotFound from '../error/NotFound';
import { orderSubtotal, orderTotal } from '../../utils/orderUtils';
import { formatPrice } from '../../utils/formatPrice';
import { formatDateTime } from '../../utils/formatDate';

const statusIcons = {
  'Order Placed': Package,
  Processing: Clock,
  Shipped: Truck,
  Delivered: CheckCircle2,
};

export default function OrderDetail() {
  const { id } = useParams();
  const order = getOrderById(id);

  if (!order) return <NotFound />;

  const subtotal = orderSubtotal(order);
  const total = orderTotal(order);

  return (
    <AccountLayout>
      <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500" aria-label="Breadcrumb">
        <Link to="/account/orders" className="hover:text-black">Orders</Link>
        <ChevronRight size={12} />
        <span className="text-neutral-900">{order.id}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-neutral-900">{order.id}</h2>
          <p className="mt-1 text-sm text-neutral-500">Placed on {formatDateTime(order.date)}</p>
        </div>
        <span
          className={`rounded-full px-4 py-1.5 text-xs font-bold ${
            order.status === 'Delivered'
              ? 'bg-green-100 text-green-700'
              : order.status === 'Shipped'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Timeline */}
      <div className="mt-8 border border-neutral-200 bg-white p-6 sm:p-8">
        <h3 className="mb-6 font-display text-sm font-bold uppercase tracking-widest text-neutral-900">
          Order Timeline
        </h3>
        <ol className="space-y-0">
          {order.timeline.map((t, i) => {
            const Icon = statusIcons[t.label] || Package;
            const isLast = i === order.timeline.length - 1;
            return (
              <li key={t.label} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    className={`absolute left-4 top-9 h-full w-0.5 ${
                      t.done ? 'bg-black' : 'bg-neutral-200'
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    t.done ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-400'
                  }`}
                >
                  <Icon size={15} />
                </span>
                <div className="pt-1">
                  <p className={`text-sm font-semibold ${t.done ? 'text-neutral-900' : 'text-neutral-400'}`}>
                    {t.label}
                  </p>
                  {t.date && (
                    <p className="text-xs text-neutral-500">{formatDateTime(t.date)}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* items */}
        <div className="border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-6 py-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-neutral-900">
              Items ({order.items.length})
            </h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {order.items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 px-6 py-4">
                <Link to={`/product/${item.id}`} className="block h-20 w-16 shrink-0 overflow-hidden bg-neutral-100">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 items-center justify-between gap-4">
                  <div>
                    <Link to={`/product/${item.id}`} className="font-display font-bold text-neutral-900 hover:underline">
                      {item.name}
                    </Link>
                    <p className="text-sm text-neutral-500">
                      {item.size && `Size: ${item.size}`}
                      {item.color && ` · ${item.color}`} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-neutral-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* summary + info */}
        <div className="space-y-6">
          <div className="border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-neutral-900">
              Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium text-neutral-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium text-neutral-900">
                  {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-bold text-neutral-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <div className="border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-neutral-900">
              Shipping Address
            </h3>
            <p className="text-sm text-neutral-700">
              {order.address.firstName} {order.address.lastName}
              <br />
              {order.address.address}
              <br />
              {order.address.city}, {order.address.postalCode}
              <br />
              {order.address.country}
              <br />
              {order.address.phone}
            </p>
          </div>

          <div className="border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-neutral-900">
              Payment
            </h3>
            <p className="text-sm text-neutral-700">{order.payment.method}</p>
            {order.payment.cardLast4 && (
              <p className="text-sm text-neutral-500">•••• {order.payment.cardLast4}</p>
            )}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
