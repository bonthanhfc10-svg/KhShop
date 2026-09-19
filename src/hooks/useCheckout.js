import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useWishlist } from '../store/WishlistContext';
import { orderService } from '../services/orderService';
import { addressService } from '../services/addressService';

export default function useCheckout() {
  const { cart, cartTotal, cartLoaded, loading, fetchAuthCart } = useCart();
  const { loadAuthWishlist } = useWishlist();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    receiverPhone: '',
    shippingAddress: '',
    orderType: 'delivery',
    note: '',
  });
  const [addressPrefilled, setAddressPrefilled] = useState(false);

  useEffect(() => {
    if (addressPrefilled) return;
    addressService.getAll().then((res) => {
      const addresses = res?.data?.addresses || [];
      const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
      if (defaultAddr) {
        setValues((v) => ({
          ...v,
          receiverPhone: v.receiverPhone || defaultAddr.receiver_phone || '',
          shippingAddress: v.shippingAddress || [defaultAddr.address_line, defaultAddr.city_province].filter(Boolean).join(', ') || '',
        }));
      }
      setAddressPrefilled(true);
    }).catch(() => {
      setAddressPrefilled(true);
    });
  }, [addressPrefilled]);
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

      navigate(`/order-success/${order.id}`, { replace: true });

      fetchAuthCart();
      loadAuthWishlist();
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
    cartLoaded,
    loading,
    values,
    errors,
    placing,
    apiError,
    setField,
    placeOrder,
  };
}
