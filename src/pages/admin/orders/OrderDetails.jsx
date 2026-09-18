import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Truck, User, Package } from 'lucide-react';
import AdminLoading from '../../../components/common/Loading';
import AdminButton from '../../../components/admin/common/AdminButton';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import { orderService } from '../../../services/admin/orderService';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDateTime } from '../../../utils/formatDate';

const steps = ['pending', 'processing', 'shipped', 'completed'];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    orderService.getById(id).then((data) => {
      if (!cancelled) setOrder(data);
    }).catch((err) => {
      if (!cancelled) setError(err?.response?.data?.message || 'Failed to load order.');
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id]);

  const handleStatus = useCallback(async (newStatus) => {
    setUpdating(true);
    try {
      const updated = await orderService.updateStatus(order.id, newStatus);
      setOrder(updated);
    } catch {
      // keep old state on failure
    } finally {
      setUpdating(false);
    }
  }, [order]);

  const handleCancel = useCallback(async () => {
    setUpdating(true);
    try {
      const updated = await orderService.cancel(order.id);
      setOrder(updated);
      setShowCancelModal(false);
    } catch {
      // keep old state on failure
    } finally {
      setUpdating(false);
    }
  }, [order]);

  if (loading) return <AdminLoading />;

  if (error || !order) {
    return (
      <div className="space-y-5">
        <Link to="/admin/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
          <ArrowLeft size={16} /> Back to orders
        </Link>
        <p className="text-sm text-red-600">{error || 'Order not found.'}</p>
      </div>
    );
  }

  const currentStep = steps.indexOf(order.status);
  const items = order.items || [];
  const shippingAddress = order.shipping_address || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/admin/orders"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft size={16} /> Back to orders
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-sans text-2xl font-bold text-neutral-900">Order #{order.id}</h1>
            <p className="mt-1 text-sm text-neutral-500">Placed on {formatDateTime(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status} />
            <select
              value={order.status}
              onChange={(e) => handleStatus(e.target.value)}
              disabled={updating || order.status === 'cancelled'}
              className="rounded-lg border border-gray-300 bg-admin-card-elevated px-3 py-2 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15 disabled:opacity-60"
              aria-label="Update order status"
            >
              {steps.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            {order.status !== 'cancelled' && order.status !== 'completed' && (
              <AdminButton
                variant="danger"
                size="sm"
                disabled={updating}
                onClick={() => setShowCancelModal(true)}
              >
                Cancel
              </AdminButton>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="border border-admin-border bg-admin-card p-6 shadow-sm">
        <h2 className="mb-5 font-sans text-base font-semibold text-neutral-900">Order Status</h2>
        <ol className="flex items-center">
          {steps.map((step, i) => {
            const done = i <= currentStep;
            const isCurrent = i === currentStep;
            return (
              <li key={step} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      done ? 'bg-[#25A9EB] text-white' : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`mt-2 text-xs font-medium capitalize ${isCurrent ? 'text-neutral-900' : 'text-neutral-400'}`}>
                    {step}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <span className={`mx-2 mb-6 h-0.5 flex-1 ${i < currentStep ? 'bg-[#25A9EB]' : 'bg-neutral-100'}`} />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="border border-admin-border bg-admin-card shadow-sm lg:col-span-2">
          <div className="border-b border-admin-border-subtle px-5 py-4">
            <h2 className="font-sans text-base font-semibold text-neutral-900">Items ({items.length})</h2>
          </div>
          <div className="divide-y divide-neutral-50">
            {items.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-neutral-400">No items found.</div>
            ) : (
              items.map((item, i) => (
                <div key={item.id || i} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-xs font-semibold text-neutral-500">
                    <Package size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {item.product_name || 'Product'}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {item.variant_name && <span>{item.variant_name} · </span>}
                      Qty: {item.qty} · Unit Price: {formatPrice(item.unit_price)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">{formatPrice(item.sub_total)}</span>
                </div>
              ))
            )}
          </div>
          <div className="space-y-2 border-t border-admin-border-subtle bg-admin-surface-subtle px-5 py-4">
            <div className="flex justify-between text-sm text-neutral-500">
              <span>Subtotal</span><span>{formatPrice(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-500">
              <span>Discount</span><span>-{formatPrice(order.discount_amount)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-500">
              <span>Tax</span><span>{formatPrice(order.tax_amount)}</span>
            </div>
            <div className="flex justify-between border-t border-admin-border pt-2 text-sm font-semibold text-neutral-900">
              <span>Net Total</span><span>{formatPrice(order.net_amount)}</span>
            </div>
          </div>
        </div>

        {/* Customer / shipping / payment */}
        <div className="space-y-6">
          <div className="border border-admin-border bg-admin-card p-5 shadow-sm">
            <div className="flex items-center gap-2 text-neutral-500">
              <User size={15} />
              <h3 className="text-sm font-semibold">Customer</h3>
            </div>
            <p className="mt-3 font-medium text-neutral-900">{order.user?.name || '—'}</p>
            <p className="text-sm text-neutral-500">{order.user?.email || '—'}</p>
            <p className="mt-1 text-sm text-neutral-500">Phone: {order.user?.phone || order.receiver_phone || '—'}</p>
          </div>

          <div className="border border-admin-border bg-admin-card p-5 shadow-sm">
            <div className="flex items-center gap-2 text-neutral-500">
              <MapPin size={15} />
              <h3 className="text-sm font-semibold">Shipping Address</h3>
            </div>
            <div className="mt-3 text-sm text-neutral-700">
              {shippingAddress.street && <p>{shippingAddress.street}</p>}
              {shippingAddress.ward && <p>Ward: {shippingAddress.ward}</p>}
              {shippingAddress.district && <p>{shippingAddress.district}</p>}
              {shippingAddress.city && <p>{shippingAddress.city}</p>}
              {shippingAddress.province && <p>{shippingAddress.province}</p>}
              {!shippingAddress.street && !shippingAddress.city && <p>No shipping address</p>}
            </div>
            {order.receiver_phone && (
              <p className="mt-2 text-sm text-neutral-500">Receiver Phone: {order.receiver_phone}</p>
            )}
          </div>

          <div className="border border-admin-border bg-admin-card p-5 shadow-sm">
            <div className="flex items-center gap-2 text-neutral-500">
              <CreditCard size={15} />
              <h3 className="text-sm font-semibold">Payment</h3>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Truck size={15} className="text-neutral-400" />
              <p className="text-sm capitalize text-neutral-700">{order.order_type || 'delivery'}</p>
            </div>
            <p className="mt-2 text-sm text-neutral-500">
              Payment status: <StatusBadge status={order.payment_status || 'unpaid'} />
            </p>
          </div>

          {order.note && (
            <div className="border border-admin-border bg-admin-card p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-900">Note</h3>
              <p className="mt-2 text-sm text-neutral-600">{order.note}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancel Order">
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Are you sure you want to cancel order #{order.id}? This will restore stock for all items.
          </p>
          <div className="flex justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setShowCancelModal(false)} disabled={updating}>
              No, keep order
            </AdminButton>
            <AdminButton variant="danger" onClick={handleCancel} disabled={updating}>
              {updating ? 'Cancelling...' : 'Yes, cancel order'}
            </AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
