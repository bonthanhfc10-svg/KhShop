import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, ShoppingBag, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import AdminLoading from '../../../components/common/Loading';
import AdminButton from '../../../components/admin/common/AdminButton';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import { customerService } from '../../../services/admin/customerService';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';

export default function CustomerDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    customerService.getById(id).then((result) => {
      if (!cancelled) setData(result);
    }).catch((err) => {
      if (!cancelled) setError(err?.response?.data?.message || 'Failed to load customer.');
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id]);

  const handleStatusToggle = useCallback(async () => {
    if (!data) return;
    setUpdating(true);
    try {
      const newActive = !data.customer.is_active;
      const updated = await customerService.updateStatus(data.customer.id, newActive);
      if (updated) {
        setData((prev) => ({
          ...prev,
          customer: { ...prev.customer, is_active: updated.is_active },
        }));
      }
      setShowStatusModal(false);
    } catch {
      // keep old state on failure
    } finally {
      setUpdating(false);
    }
  }, [data]);

  if (loading) return <AdminLoading />;

  if (error || !data) {
    return (
      <div className="space-y-5">
        <Link to="/admin/customers" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
          <ArrowLeft size={16} /> Back to customers
        </Link>
        <p className="text-sm text-red-600">{error || 'Customer not found.'}</p>
      </div>
    );
  }

  const { customer, summary, orders } = data;
  const initials = customer.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/admin/customers"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft size={16} /> Back to customers
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-sans text-2xl font-bold text-neutral-900">Customer Profile</h1>
            <p className="mt-1 text-sm text-neutral-500">Customer #{customer.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={customer.is_active ? 'Active' : 'Inactive'} />
            <AdminButton
              variant={customer.is_active ? 'danger' : 'success'}
              size="sm"
              disabled={updating}
              onClick={() => setShowStatusModal(true)}
            >
              {customer.is_active ? 'Deactivate' : 'Activate'}
            </AdminButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="border border-admin-border bg-admin-card p-6 text-center shadow-sm">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 text-xl font-bold text-white">
            {initials}
          </span>
          <h2 className="mt-3 font-sans text-lg font-semibold text-neutral-900">{customer.name}</h2>
          <p className="text-sm text-neutral-500">{customer.email}</p>
          <div className="mt-3 flex justify-center">
            <StatusBadge status={customer.is_active ? 'Active' : 'Inactive'} />
          </div>

          <div className="mt-6 space-y-3 border-t border-admin-border-subtle pt-4 text-left text-sm">
            <p className="flex items-center gap-2.5 text-neutral-600">
              <Mail size={15} className="text-neutral-400" /> {customer.email}
            </p>
            <p className="flex items-center gap-2.5 text-neutral-600">
              <Phone size={15} className="text-neutral-400" /> {customer.phone || '—'}
            </p>
            <p className="text-xs text-neutral-400">
              Joined: {formatDate(customer.created_at)}
            </p>
          </div>
        </div>

        {/* Stats + orders */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="border border-admin-border bg-admin-card p-5 shadow-sm">
              <div className="flex items-center gap-2 text-neutral-500">
                <ShoppingBag size={15} />
                <span className="text-sm font-medium">Total Orders</span>
              </div>
              <p className="mt-3 font-sans text-2xl font-bold text-neutral-900">{summary.total_orders}</p>
            </div>
            <div className="border border-admin-border bg-admin-card p-5 shadow-sm">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={15} />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <p className="mt-3 font-sans text-2xl font-bold text-neutral-900">{summary.completed_orders}</p>
            </div>
            <div className="border border-admin-border bg-admin-card p-5 shadow-sm">
              <div className="flex items-center gap-2 text-red-500">
                <XCircle size={15} />
                <span className="text-sm font-medium">Cancelled</span>
              </div>
              <p className="mt-3 font-sans text-2xl font-bold text-neutral-900">{summary.cancelled_orders}</p>
            </div>
            <div className="border border-admin-border bg-admin-card p-5 shadow-sm">
              <div className="flex items-center gap-2 text-neutral-500">
                <DollarSign size={15} />
                <span className="text-sm font-medium">Total Spent</span>
              </div>
              <p className="mt-3 font-sans text-2xl font-bold text-neutral-900">{formatPrice(summary.total_spent)}</p>
            </div>
          </div>

          {/* Order History */}
          <div className="border border-admin-border bg-admin-card shadow-sm">
            <div className="border-b border-admin-border-subtle px-5 py-4">
              <h3 className="font-sans text-base font-semibold text-neutral-900">
                Order History ({orders.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-admin-border-subtle text-xs uppercase text-neutral-500">
                    <th className="px-5 py-3 font-semibold">Order</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Items</th>
                    <th className="px-5 py-3 font-semibold">Payment</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-5 py-8 text-center text-sm text-neutral-500">
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} className="border-b border-neutral-50 last:border-0">
                        <td className="px-5 py-3">
                          <Link to={`/admin/orders/${o.id}`} className="font-semibold text-neutral-900 hover:underline">
                            #{o.id}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-neutral-500">{formatDate(o.created_at)}</td>
                        <td className="px-5 py-3 text-neutral-600">{o.items_count} items</td>
                        <td className="px-5 py-3"><StatusBadge status={o.payment_status} /></td>
                        <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                        <td className="px-5 py-3 text-right font-semibold text-neutral-900">{formatPrice(o.net_amount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Status Toggle Modal */}
      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title={customer.is_active ? 'Deactivate Customer' : 'Activate Customer'}>
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            {customer.is_active
              ? `Are you sure you want to deactivate ${customer.name}? They will lose access to their account.`
              : `Are you sure you want to activate ${customer.name}? They will regain access to their account.`}
          </p>
          <div className="flex justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setShowStatusModal(false)} disabled={updating}>
              Cancel
            </AdminButton>
            <AdminButton
              variant={customer.is_active ? 'danger' : 'success'}
              onClick={handleStatusToggle}
              disabled={updating}
            >
              {updating ? 'Updating...' : customer.is_active ? 'Yes, deactivate' : 'Yes, activate'}
            </AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
