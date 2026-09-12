import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import AccountLayout from './AccountLayout';
import { orderService } from '../../../services/orderService';
import OrderStatusBadge from '../../../components/customer/account/OrderStatusBadge';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';
import Loading from '../../../components/common/Loading';
import NotFound from '../error/NotFound';

const PLACEHOLDER = '/images/placeholder.svg';

function getOrderItems(order) {
  if (order.items && Array.isArray(order.items)) return order.items;
  if (order.order_items && Array.isArray(order.order_items)) return order.order_items;
  return [];
}

function getItemImage(item) {
  return (
    item.variant?.image?.image_path ||
    item.variant?.product?.images?.[0]?.image_path ||
    item.image ||
    PLACEHOLDER
  );
}

function getItemName(item) {
  return item.variant?.product?.name || item.name || 'Product';
}

function getItemSlug(item) {
  return item.variant?.product?.slug || item.slug || item.id;
}

function getItemColor(item) {
  return item.variant?.color?.name || item.color || null;
}

function getItemSize(item) {
  return item.variant?.size?.name || item.size || null;
}

function getItemPrice(item) {
  return Number(item.unit_price) || Number(item.price) || 0;
}

function getItemQty(item) {
  return Number(item.qty) || Number(item.quantity) || 0;
}

function getItemSubtotal(item) {
  return getItemPrice(item) * getItemQty(item);
}

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderService.getOrder(id);
      setOrder(res?.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await orderService.cancelOrder(id);
      await fetchOrder();
    } catch (err) {
      setCancelError(err?.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <AccountLayout>
        <Loading />
      </AccountLayout>
    );
  }

  if (error && !order) {
    return (
      <AccountLayout>
        <div className="mt-8 text-center">
          <AlertCircle size={48} className="mx-auto text-neutral-300" />
          <h2 className="mt-4 font-sans text-xl font-bold text-neutral-900">
            Failed to load order
          </h2>
          <p className="mt-2 text-sm text-neutral-500">{error}</p>
          <Link
            to="/account/orders"
            className="mt-6 inline-block text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-500"
          >
            ← Back to Orders
          </Link>
        </div>
      </AccountLayout>
    );
  }

  if (!order) return <NotFound />;

  const items = getOrderItems(order);
  const canCancel = normalizeStatus(order.status) === 'pending';

  return (
    <AccountLayout>
      <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500" aria-label="Breadcrumb">
        <Link to="/account/orders" className="hover:text-black">Orders</Link>
        <ChevronRight size={12} />
        <span className="text-neutral-900">#{order.id}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-bold text-neutral-900">#{order.id}</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          {order.payment_status && (
            <span className="text-xs text-neutral-500">
              Payment: {order.payment_status}
            </span>
          )}
        </div>
      </div>

      {cancelError && (
        <div className="mt-4 flex items-start gap-3 border border-red-200 bg-red-50 px-5 py-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{cancelError}</p>
        </div>
      )}

      {/* Order Info */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="border border-neutral-200 bg-white p-6">
          <h3 className="mb-3 font-sans text-xs font-bold uppercase tracking-widest text-neutral-900">
            Order Type
          </h3>
          <p className="text-sm text-neutral-700 capitalize">{order.order_type || '—'}</p>
        </div>
        <div className="border border-neutral-200 bg-white p-6">
          <h3 className="mb-3 font-sans text-xs font-bold uppercase tracking-widest text-neutral-900">
            Payment Status
          </h3>
          <p className="text-sm text-neutral-700 capitalize">{order.payment_status || '—'}</p>
        </div>
      </div>

      {/* Shipping */}
      <div className="mt-6 border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-neutral-900">
          Shipping
        </h3>
        <div className="space-y-2 text-sm text-neutral-700">
          {order.receiver_phone && (
            <p><span className="font-medium">Phone:</span> {order.receiver_phone}</p>
          )}
          {order.shipping_address && (
            <p><span className="font-medium">Address:</span> {order.shipping_address}</p>
          )}
          {order.note && (
            <p><span className="font-medium">Note:</span> {order.note}</p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-6 py-4">
          <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-neutral-900">
            Items ({items.length})
          </h3>
        </div>
        <div className="divide-y divide-neutral-100">
          {items.map((item, idx) => {
            const slug = getItemSlug(item);
            const productLink = slug ? `/product/${slug}` : '#';

            return (
              <div key={item.id || idx} className="flex gap-4 px-6 py-4">
                <Link to={productLink} className="block h-20 w-16 shrink-0 overflow-hidden bg-neutral-100">
                  <img
                    src={getItemImage(item)}
                    alt={getItemName(item)}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex flex-1 items-center justify-between gap-4">
                  <div>
                    <Link to={productLink} className="font-sans font-bold text-neutral-900 hover:underline">
                      {getItemName(item)}
                    </Link>
                    <p className="text-sm text-neutral-500">
                      {getItemSize(item) && `Size: ${getItemSize(item)}`}
                      {getItemColor(item) && ` · ${getItemColor(item)}`}
                      {' × '}
                      {getItemQty(item)}
                    </p>
                  </div>
                  <p className="font-bold text-neutral-900">
                    {formatPrice(getItemSubtotal(item))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-neutral-900">
          Summary
        </h3>
        <div className="space-y-3 text-sm">
          {order.total_amount != null && (
            <div className="flex justify-between">
              <span className="text-neutral-600">Total</span>
              <span className="font-medium text-neutral-900">{formatPrice(order.total_amount)}</span>
            </div>
          )}
          {order.discount_amount != null && Number(order.discount_amount) > 0 && (
            <div className="flex justify-between">
              <span className="text-neutral-600">Discount</span>
              <span className="font-medium text-accent">-{formatPrice(order.discount_amount)}</span>
            </div>
          )}
          {order.tax_amount != null && (
            <div className="flex justify-between">
              <span className="text-neutral-600">Tax</span>
              <span className="font-medium text-neutral-900">{formatPrice(order.tax_amount)}</span>
            </div>
          )}
          {order.net_amount != null && (
            <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-bold text-neutral-900">
              <span>Net Amount</span>
              <span>{formatPrice(order.net_amount)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cancel */}
      {canCancel && (
        <div className="mt-6">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="inline-flex items-center gap-2 border border-red-300 px-6 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:pointer-events-none disabled:opacity-50"
          >
            {cancelling ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Cancelling…
              </>
            ) : (
              'Cancel Order'
            )}
          </button>
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/account/orders"
          className="text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-500"
        >
          ← Back to Orders
        </Link>
      </div>
    </AccountLayout>
  );
}

function normalizeStatus(status) {
  return (status || '').toLowerCase();
}
