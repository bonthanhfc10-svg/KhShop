import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, DollarSign } from 'lucide-react';
import AdminLoading from '../../components/common/Loading';
import StatusBadge from '../../components/common/StatusBadge';
import { customerService } from '../../services/customerService';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../../utils/formatPrice';
import { formatDate } from '../../../utils/formatDate';

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([customerService.getById(id), orderService.getAll()])
      .then(([c, o]) => {
        setCustomer(c);
        setOrders(o.filter((ord) => ord.customer === c?.name));
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <AdminLoading />;
  if (!customer) return <p className="text-sm text-neutral-500">Customer not found.</p>;

  const initials = customer.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/customers"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft size={16} /> Back to customers
        </Link>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Customer Profile</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="border border-neutral-200 bg-white p-6 text-center shadow-sm">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 text-xl font-bold text-white">
            {initials}
          </span>
          <h2 className="mt-3 font-display text-lg font-semibold text-neutral-900">{customer.name}</h2>
          <p className="text-sm text-neutral-500">{customer.email}</p>
          <div className="mt-3 flex justify-center">
            <StatusBadge status={customer.status === 'active' ? 'Active' : 'Inactive'} />
          </div>

          <div className="mt-6 space-y-3 border-t border-neutral-100 pt-4 text-left text-sm">
            <p className="flex items-center gap-2.5 text-neutral-600">
              <Mail size={15} className="text-neutral-400" /> {customer.email}
            </p>
            <p className="flex items-center gap-2.5 text-neutral-600">
              <Phone size={15} className="text-neutral-400" /> {customer.phone}
            </p>
            <p className="flex items-center gap-2.5 text-neutral-600">
              <MapPin size={15} className="text-neutral-400" /> 221 Springfield Lane, Denver
            </p>
          </div>
        </div>

        {/* Stats + orders */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-neutral-500">
                <ShoppingBag size={15} />
                <span className="text-sm font-medium">Total Orders</span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-neutral-900">{customer.orders}</p>
            </div>
            <div className="border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-neutral-500">
                <DollarSign size={15} />
                <span className="text-sm font-medium">Total Spent</span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-neutral-900">{formatPrice(customer.totalSpent)}</p>
            </div>
          </div>

          <div className="border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-100 px-5 py-4">
              <h3 className="font-display text-base font-semibold text-neutral-900">Order History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 text-xs uppercase text-neutral-500">
                    <th className="px-5 py-3 font-semibold">Order</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-neutral-50 last:border-0">
                      <td className="px-5 py-3">
                        <Link to={`/admin/orders/${o.id}`} className="font-semibold text-neutral-900 hover:underline">
                          {o.id}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-neutral-500">{formatDate(o.date)}</td>
                      <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-5 py-3 text-right font-semibold text-neutral-900">{formatPrice(o.total)}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-5 py-8 text-center text-sm text-neutral-500">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-100 px-5 py-4">
              <h3 className="font-display text-base font-semibold text-neutral-900">Shipping Addresses</h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-neutral-700">
                221 Springfield Lane<br />
                Denver, CO 80210<br />
                United States
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
