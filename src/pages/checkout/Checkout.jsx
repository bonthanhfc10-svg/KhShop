import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import ShippingForm from '../../components/checkout/ShippingForm';
import PaymentMethod from '../../components/checkout/PaymentMethod';
import OrderSummary from '../../components/checkout/OrderSummary';
import Button from '../../components/common/Button';
import { validateCheckout } from '../../utils/validation';
import { SHIPPING_METHODS, calculateShipping } from '../../utils/shipping';

const emptyForm = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postalCode: '',
  phone: '',
  country: 'United States',
};

const STEPS = ['Contact', 'Shipping', 'Delivery', 'Payment'];

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    ...emptyForm,
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
  });
  const [errors, setErrors] = useState({});
  const [delivery, setDelivery] = useState('standard');
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);

  if (cart.length === 0) {
    return (
      <main className="container-kh py-20 text-center">
        <h1 className="heading-display text-3xl">Your bag is empty</h1>
        <p className="mt-3 text-neutral-500">Add some items before checking out.</p>
        <div className="mt-8">
          <Button to="/shop">Continue Shopping</Button>
        </div>
      </main>
    );
  }

  const setField = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
  };

  const shippingCost =
    cartTotal >= 50 ? 0 : calculateShipping(cartTotal, delivery);
  const total = cartTotal + shippingCost;

  const next = () => {
    if (step === 0) {
      const v = validateCheckout(values);
      setErrors(v);
      if (Object.keys(v).length > 0) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const placeOrder = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 900));
    const orderNumber = `KH-${Math.floor(100000 + Math.random() * 900000)}`;
    sessionStorage.setItem(
      'khshop_last_order',
      JSON.stringify({ number: orderNumber, total })
    );
    clearCart();
    navigate('/order-success');
  };

  return (
    <main>
      <div className="container-kh py-12 sm:py-16">
        <h1 className="heading-display text-4xl sm:text-5xl">Checkout</h1>

        {/* Steps nav */}
        <div className="mt-8 flex items-center gap-2 sm:gap-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 sm:gap-4">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  i <= step ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-widest ${
                  i <= step ? 'text-black' : 'text-neutral-400'
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <span className="hidden h-px w-6 bg-neutral-300 sm:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <div>
            {step === 0 && (
              <CheckoutForm values={values} errors={errors} onChange={setField} />
            )}

            {step === 1 && (
              <div>
                <h2 className="mb-5 font-display text-lg font-bold text-neutral-900">
                  Shipping Address
                </h2>
                <ShippingForm values={values} errors={errors} onChange={setField} />
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-neutral-900">
                  <Truck size={20} /> Delivery Method
                </h2>
                <div className="space-y-3">
                  {SHIPPING_METHODS.filter(
                    (m) => cartTotal >= 50 ? m.id !== 'standard' : m.id !== 'free-over-50'
                  ).map((m) => (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-center justify-between border p-5 transition-colors ${
                        delivery === m.id
                          ? 'border-black'
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="delivery"
                          checked={delivery === m.id}
                          onChange={() => setDelivery(m.id)}
                          className="h-4 w-4 accent-black"
                        />
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">
                            {m.label}
                          </p>
                          <p className="text-xs text-neutral-500">{m.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-neutral-900">
                        {m.cost === 0 ? 'FREE' : `$${m.cost.toFixed(2)}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-neutral-900">
                  <ShieldCheck size={20} /> Payment Method
                </h2>
                <PaymentMethod
                  method={method}
                  onChange={setMethod}
                  card={card}
                  onCardChange={(k, v) => setCard((c) => ({ ...c, [k]: v }))}
                />
              </div>
            )}

            {/* Nav buttons */}
            <div className="mt-8 flex items-center justify-between">
              {step > 0 ? (
                <button onClick={back} className="btn-secondary">
                  Back
                </button>
              ) : (
                <Link to="/cart" className="text-xs font-semibold uppercase tracking-widest text-neutral-500 hover:text-black">
                  Back to Bag
                </Link>
              )}
              {step < STEPS.length - 1 ? (
                <Button onClick={next}>Continue</Button>
              ) : (
                <Button onClick={placeOrder} disabled={placing}>
                  {placing ? 'Placing Order…' : 'Place Order'}
                </Button>
              )}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="lg:sticky lg:top-28">
              <OrderSummary
                items={cart}
                subtotal={cartTotal}
                shipping={shippingCost}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
