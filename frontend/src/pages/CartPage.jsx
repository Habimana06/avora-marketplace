import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useCart } from '../context/CartContext';
import { formatRWF } from '../lib/currency';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, removeItem, updateQuantity } = useCart();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await api.get('/auth/me');
        return res.data?.user ?? null;
      } catch {
        return null;
      }
    },
  });

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (user.role !== 'CUSTOMER') {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (itemCount === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-heading font-bold text-4xl mb-2">Cart</h1>
        <p className="text-gray-600 mb-12">Your selected items.</p>
        <div className="text-center py-20 border border-gray-100 bg-[#F7F5F2]">
          <p className="text-gray-600 mb-6">Your cart is empty.</p>
          <Link to="/shop" className="btn-primary inline-block">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-heading font-bold text-4xl mb-2">Cart</h1>
      <p className="text-gray-600 mb-10">{itemCount} item{itemCount !== 1 ? 's' : ''} in your bag</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex gap-4 p-4 border border-gray-100 bg-white"
            >
              <Link to={`/product/${item.slug}`} className="shrink-0 w-24 h-32 bg-gray-100 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : null}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.slug}`} className="font-heading font-semibold hover:text-gold transition-colors">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  Size {item.size} • Color {item.color}
                </p>
                <p className="font-bold mt-2">{formatRWF(item.price)}</p>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    className="w-8 h-8 border border-gray-200 hover:border-primary"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    className="w-8 h-8 border border-gray-200 hover:border-primary"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="ml-auto text-xs uppercase tracking-wider text-gray-400 hover:text-error"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-gray-100 bg-[#F7F5F2] p-8 h-fit">
          <h2 className="font-heading font-semibold text-lg mb-6">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-bold">{formatRWF(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-6 pb-6 border-b border-gray-200">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-600">Calculated at checkout</span>
          </div>
          <div className="flex justify-between mb-8">
            <span className="font-heading font-semibold">Total</span>
            <span className="font-bold text-xl">{formatRWF(subtotal)}</span>
          </div>
          <button type="button" onClick={handleCheckout} className="w-full btn-gold mb-3">
            Proceed to Checkout
          </button>
          <Link to="/shop" className="block text-center text-sm text-gray-500 hover:text-gold">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
