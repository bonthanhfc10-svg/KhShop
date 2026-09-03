import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Truck, User } from 'lucide-react';
import AdminLoading from '../../components/common/Loading';
import StatusBadge from '../../components/common/StatusBadge';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDateTime } from '../../../utils/formatDate';

const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    orderService.getById(id).then(setOrder).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <AdminLoading />;
  if (!order) return <p className="text-sm text-neutral-500">Order not found.</p>;

  const currentStep = steps.indexOf(order.status === 'Completed' ? 'Delivered' : order.status);

  const handleStatus = async (newStatus) => {
    setUpdating(true);
    await orderService.updateStatus(order.id, newStatus);
    setOrder({ ...order, status: newStatus });
    setUpdating(false);
  };

  // Build mock line items for display
  const items = Array.from({ length: order.items }).map((_, i) => ({
    name: ['Kh Runner Pro', 'Urban Classic Hoodie', 'Essential Logo Tee', 'Performance Cap', 'Kh Street Low'][i % 5],
    color: ['Black', 'Grey', 'White', 'Navy', 'Red'][i % 5],
    size: ['M', 'L', '9', 'One Size', 'XL'][i % 5],
    qty: 1,
    price: order.total / order.items,
  }));

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/orders"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft size={16} /> Back to orders
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900">Order {order.id}</h1>
            <p className="mt-1 text-sm text-neutral-500">Placed on {formatDateTime(order.date)}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status} />
            <select
              value={order.status}
              onChange={(e) => handleStatus(e.target.value)}
              disabled={updating}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400 disabled:opacity-60"
              aria-label="Update order status"
            >
              {steps.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 font-display text-base font-semibold text-neutral-900">Order Status</h2>
        <ol className="flex items-center">
          {steps.map((step, i) => {
            const done = i <= currentStep;
            const isCurrent = i === currentStep;
            return (
              <li key={step} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      done ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-neutral-900' : 'text-neutral-400'}`}>
                    {step}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <span className={`mx-2 mb-6 h-0.5 flex-1 ${i < currentStep ? 'bg-neutral-900' : 'bg-neutral-100'}`} />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="border border-neutral-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-neutral-100 px-5 py-4">
            <h2 className="font-display text-base font-semibold text-neutral-900">Items</h2>
          </div>
          <div className="divide-y divide-neutral-50">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-xs font-semibold text-neutral-500">
                  {item.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">{item.name}</p>
                  <p className="text-xs text-neutral-400">
                    Color: {item.color} · Size: {item.size} · Qty: {item.qty}
                  </p>
                </div>
                <span className="text-sm font-semibold text-neutral-900">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-neutral-100 bg-neutral-50/60 px-5 py-4">
            <div className="flex justify-between text-sm text-neutral-500">
              <span>Subtotal</span><span>{formatPrice(order.total * 0.85)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-500">
              <span>Shipping</span><span>{formatPrice(5.99)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-500">
              <span>Tax</span><span>{formatPrice(order.total * 0.1)}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-2 text-sm font-semibold text-neutral-900">
              <span>Total</span><span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Customer / shipping / payment */}
        <div className="space-y-6">
          <div className="border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-neutral-500">
              <User size={15} />
              <h3 className="text-sm font-semibold">Customer</h3>
            </div>
            <p className="mt-3 font-medium text-neutral-900">{order.customer}</p>
            <p className="text-sm text-neutral-500">{order.email}</p>
            <p className="mt-1 text-sm text-neutral-500">Email</p>
          </div>

          <div className="border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-neutral-500">
              <MapPin size={15} />
              <h3 className="text-sm font-semibold">Shipping Address</h3>
            </div>
            <p className="mt-3 text-sm text-neutral-700">
              221 Springfield Lane<br />
              Denver, CO 80210<br />
              United States
            </p>
            <p className="mt-2 text-sm text-neutral-500">Standard shipping</p>
          </div>

          <div className="border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-neutral-500">
              <CreditCard size={15} />
              <h3 className="text-sm font-semibold">Payment</h3>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Truck size={15} className="text-neutral-400" />
              <p className="text-sm text-neutral-700">{order.paymentMethod}</p>
            </div>
            <p className="mt-2 text-sm text-neutral-500">
              Payment status: <StatusBadge status={order.payment} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
