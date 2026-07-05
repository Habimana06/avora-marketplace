import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useCart } from '../context/CartContext';
import { formatRWF } from '../lib/currency';

const PAYMENT_OPTIONS = [
  { id: '', label: 'Select payment method' },
  { id: 'MTN_MOMO', label: 'MTN Mobile Money' },
  { id: 'AIRTEL_MONEY', label: 'Airtel Money' },
  { id: 'VISA', label: 'Visa Card' },
  { id: 'MASTERCARD', label: 'Mastercard' },
];

const inputClass = 'w-full border border-gray-200 px-4 py-3 text-sm focus:border-primary outline-none';

function isMobileMethod(method) {
  return method === 'MTN_MOMO' || method === 'AIRTEL_MONEY';
}

function isCardMethod(method) {
  return method === 'VISA' || method === 'MASTERCARD';
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { items, subtotal, itemCount, clearCart } = useCart();
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    phone: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [form, setForm] = useState({
    street: '',
    city: 'Kigali',
    state: 'Kigali City',
    postalCode: '',
    country: 'Rwanda',
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data?.user ?? null;
    },
    retry: false,
  });

  const addressComplete = useMemo(
    () => form.street.trim() && form.city.trim() && form.country.trim(),
    [form],
  );

  const paymentComplete = useMemo(() => {
    if (!paymentMethod) return false;
    if (isMobileMethod(paymentMethod)) {
      return paymentDetails.phone.replace(/\D/g, '').length >= 9;
    }
    if (isCardMethod(paymentMethod)) {
      const digits = paymentDetails.cardNumber.replace(/\s/g, '');
      return (
        digits.length >= 15
        && paymentDetails.cardName.trim().length >= 2
        && /^\d{2}\/\d{2}$/.test(paymentDetails.expiry.trim())
        && paymentDetails.cvv.trim().length >= 3
      );
    }
    return false;
  }, [paymentMethod, paymentDetails]);

  const canPay = addressComplete && paymentComplete;

  const placeOrder = useMutation({
    mutationFn: async () => {
      const res = await api.post('/orders', {
        address: form,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      });
      return res.data.order;
    },
    onSuccess: (order) => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      navigate(`/customer/orders?placed=${order.orderNumber}&tab=active`);
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Could not place order. Please try again.');
    },
  });

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
    setPaymentDetails({ phone: '', cardNumber: '', cardName: '', expiry: '', cvv: '' });
    setError('');
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  if (userLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
  }

  if (user.role !== 'CUSTOMER') {
    return <Navigate to="/cart" replace />;
  }

  if (itemCount === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!canPay) {
      setError('Please complete your address and payment details.');
      return;
    }

    placeOrder.mutate();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-heading font-bold text-4xl mb-2">Checkout</h1>
      <p className="text-gray-600 mb-10">Enter your address, choose payment, and track your order after checkout.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 p-8">
            <h2 className="font-heading font-semibold text-lg mb-6">Delivery Address</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="street" className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                  Street Address
                </label>
                <input
                  id="street"
                  type="text"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className={inputClass}
                  placeholder="KG 123 St, Kimihurura"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                    District
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="postalCode" className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-8">
            <h2 className="font-heading font-semibold text-lg mb-6">Payment Method</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="paymentMethod" className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                  Choose Payment
                </label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  className={`${inputClass} bg-white cursor-pointer`}
                >
                  {PAYMENT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {isMobileMethod(paymentMethod) && (
                <div>
                  <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                    {paymentMethod === 'MTN_MOMO' ? 'MTN MoMo Number' : 'Airtel Money Number'}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={paymentDetails.phone}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, phone: e.target.value })}
                    className={inputClass}
                    placeholder="+250 788 000 000"
                  />
                </div>
              )}

              {isCardMethod(paymentMethod) && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardName" className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Name on Card
                    </label>
                    <input
                      id="cardName"
                      type="text"
                      value={paymentDetails.cardName}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                      className={inputClass}
                      placeholder="Jean Mugisha"
                    />
                  </div>
                  <div>
                    <label htmlFor="cardNumber" className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      inputMode="numeric"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails({
                        ...paymentDetails,
                        cardNumber: formatCardNumber(e.target.value),
                      })}
                      className={inputClass}
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                        Expiry (MM/YY)
                      </label>
                      <input
                        id="expiry"
                        type="text"
                        inputMode="numeric"
                        value={paymentDetails.expiry}
                        onChange={(e) => setPaymentDetails({
                          ...paymentDetails,
                          expiry: formatExpiry(e.target.value),
                        })}
                        className={inputClass}
                        placeholder="12/28"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                        CVV
                      </label>
                      <input
                        id="cvv"
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={paymentDetails.cvv}
                        onChange={(e) => setPaymentDetails({
                          ...paymentDetails,
                          cvv: e.target.value.replace(/\D/g, '').slice(0, 4),
                        })}
                        className={inputClass}
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="text-error text-sm" role="alert">{error}</p>
          )}

          {!canPay && (
            <p className="text-sm text-gray-500 text-center">
              Complete your address and payment details to continue.
            </p>
          )}

          {canPay && (
            <button
              type="submit"
              disabled={placeOrder.isPending}
              className="w-full btn-gold disabled:opacity-60"
            >
              {placeOrder.isPending ? 'Processing Payment…' : 'Pay & Place Order'}
            </button>
          )}

          <Link to="/cart" className="block text-center text-sm text-gray-500 hover:text-gold">
            ← Back to Cart
          </Link>
        </form>

        <div className="border border-gray-100 bg-[#F7F5F2] p-8 h-fit">
          <h2 className="font-heading font-semibold text-lg mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.key} className="flex justify-between gap-3 text-sm">
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium shrink-0">{formatRWF(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <span className="font-heading font-semibold">Total</span>
            <span className="font-bold text-xl">{formatRWF(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
