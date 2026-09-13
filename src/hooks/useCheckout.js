import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useWishlist } from '../store/WishlistContext';
import { orderService } from '../services/orderService';

export default function useCheckout() {
  const { cart, cartTotal, clearCart, fetchAuthCart } = useCart();
  const { loadAuthWishlist } = useWishlist();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    receiverPhone: '',
    shippingAddress: '',
    orderType: 'delivery',
    note: '',
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [apiError, setApiError] = useState(null);

  const setField = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
    setApiError(null);
  };

  const validate = () => {
    const errs = {};
    if (!values.receiverPhone.trim()) errs.receiverPhone = 'Phone number is required.';
    if (!values.shippingAddress.trim()) errs.shippingAddress = 'Shipping address is required.';
    return errs;
  };

  const placeOrder = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setPlacing(true);
    setApiError(null);

    try {
      const payload = {
        shipping_address: values.shippingAddress.trim(),
        receiver_phone: values.receiverPhone.trim(),
        order_type: values.orderType,
        note: values.note.trim() || undefined,
      };

      const res = await orderService.createOrder(payload);
      const order = res?.data;

      // Clear cart after successful order
      clearCart();

      // Refresh cart and wishlist to reflect post-order server state
      await Promise.all([fetchAuthCart(), loadAuthWishlist()]);

      navigate(`/order-success/${order.id}`, { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Failed to place order. Please try again.';
      setApiError(message);
    } finally {
      setPlacing(false);
    }
  };

  return {
    cart,
    cartTotal,
    values,
    errors,
    placing,
    apiError,
    setField,
    placeOrder,
  };
}
