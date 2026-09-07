import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { validateCheckout } from '../utils/validation';
import { calculateShipping } from '../utils/shipping';

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

export default function useCheckout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    ...emptyForm,
    email: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState({});
  const [delivery, setDelivery] = useState('standard');
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);

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

  return {
    cart,
    cartTotal,
    values,
    errors,
    delivery,
    method,
    card,
    step,
    placing,
    steps: STEPS,
    shippingCost,
    total,
    setField,
    setDelivery,
    setMethod,
    setCard: (k, v) => setCard((c) => ({ ...c, [k]: v })),
    next,
    back,
    placeOrder,
  };
}
