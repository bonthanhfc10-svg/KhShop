import { Link } from 'react-router-dom';
import { AlertCircle, Loader2, ShoppingBag } from 'lucide-react';
import useCheckout from '../../../hooks/useCheckout';
import OrderSummary from '../../../components/customer/checkout/OrderSummary';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

export default function Checkout() {
  const {
    cart,
    cartTotal,
    cartLoaded,
    loading,
    values,
    errors,
    placing,
    apiError,
    setField,
    placeOrder,
  } = useCheckout();

  if (loading) {
    return (
      <main className="container-kh py-4">
        <Loading full />
      </main>
    );
  }

  if (cart.length === 0 && !placing) {
    return (
      <main className="container-kh py-20 text-center">
        <h1 className="heading-display text-3xl">Your bag is empty</h1>
        <p className="mt-3 text-neutral-500">Add some items before checking out.</p>
        <div className="mt-8">
          <Button to="/products/women">Continue Shopping</Button>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container-kh py-12 sm:py-16">
        <h1 className="heading-display text-4xl sm:text-5xl">Checkout</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <div>
            {apiError && (
              <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 px-5 py-4">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            )}

            {/* Order Type */}
            <div className="mb-8">
              <h2 className="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-neutral-900">
                Order Type
              </h2>
              <div className="flex gap-3">
                {[
                  { value: 'delivery', label: 'Delivery' },
                  { value: 'pickup', label: 'Pickup' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setField('orderType', opt.value)}
                    className={`flex-1 border px-5 py-3.5 text-sm font-semibold transition-colors ${
                      values.orderType === opt.value
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-300 text-neutral-700 hover:border-black'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-8">
              <h2 className="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-neutral-900">
                Shipping Address
              </h2>
              <div>
                <label htmlFor="shippingAddress" className="label-kh">
                  Address
                </label>
                <textarea
                  id="shippingAddress"
                  rows={3}
                  value={values.shippingAddress}
                  onChange={(e) => setField('shippingAddress', e.target.value)}
                  className="input-kh"
                  placeholder="Street address, city, postal code"
                />
                {errors.shippingAddress && (
                  <p className="mt-1 text-xs text-accent">{errors.shippingAddress}</p>
                )}
              </div>
            </div>

            {/* Receiver Phone */}
            <div className="mb-8">
              <h2 className="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-neutral-900">
                Contact
              </h2>
              <div>
                <label htmlFor="receiverPhone" className="label-kh">
                  Receiver Phone
                </label>
                <input
                  id="receiverPhone"
                  type="tel"
                  value={values.receiverPhone}
                  onChange={(e) => setField('receiverPhone', e.target.value)}
                  className="input-kh"
                  placeholder="+1 555 000 0000"
                />
                {errors.receiverPhone && (
                  <p className="mt-1 text-xs text-accent">{errors.receiverPhone}</p>
                )}
              </div>
            </div>

            {/* Note */}
            <div className="mb-8">
              <h2 className="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-neutral-900">
                Note <span className="font-normal normal-case text-neutral-400">(optional)</span>
              </h2>
              <div>
                <label htmlFor="note" className="label-kh">
                  Order Note
                </label>
                <textarea
                  id="note"
                  rows={2}
                  value={values.note}
                  onChange={(e) => setField('note', e.target.value)}
                  className="input-kh"
                  placeholder="Any special instructions for your order"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Link
                to="/cart"
                className="text-xs font-semibold uppercase tracking-widest text-neutral-500 hover:text-black"
              >
                Back to Bag
              </Link>
              <Button onClick={placeOrder} disabled={placing}>
                {placing ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Placing Order…
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="lg:sticky lg:top-28">
              <OrderSummary items={cart} subtotal={cartTotal} shipping={0} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
