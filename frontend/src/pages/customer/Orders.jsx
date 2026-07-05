import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { formatRWF } from '../../lib/currency';
import api from '../../lib/api';

const TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'active', label: 'In Progress' },
  { id: 'delivered', label: 'Delivered' },
];

const TRACK_STEPS = [
  'PENDING',
  'CONFIRMED',
  'IN_PRODUCTION',
  'QUALITY_CHECK',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

const PAYMENT_LABELS = {
  MTN_MOMO: 'MTN Mobile Money',
  AIRTEL_MONEY: 'Airtel Money',
  VISA: 'Visa',
  MASTERCARD: 'Mastercard',
  STRIPE: 'Stripe',
};

function OrderTracker({ status }) {
  const currentIndex = TRACK_STEPS.indexOf(status);

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Order Tracking</p>
      <div className="flex flex-wrap gap-2">
        {TRACK_STEPS.map((step, i) => {
          const done = currentIndex >= i;
          const active = status === step;
          return (
            <span
              key={step}
              className={`text-[10px] uppercase tracking-wide px-2 py-1 ${
                active
                  ? 'bg-gold text-primary font-semibold'
                  : done
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step.replace(/_/g, ' ')}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function CustomerOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'all';
  const placedOrder = searchParams.get('placed');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await api.get('/orders/my-orders');
      return res.data.orders;
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (tab === 'active') {
      return data.filter((o) => !['DELIVERED', 'CANCELLED', 'FAILED'].includes(o.status));
    }
    if (tab === 'delivered') {
      return data.filter((o) => o.status === 'DELIVERED');
    }
    return data;
  }, [data, tab]);

  const setTab = (id) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', id);
    next.delete('placed');
    setSearchParams(next);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-heading font-bold text-4xl mb-2">Order History</h1>
      <p className="text-gray-600 mb-8">Track and review your purchases.</p>

      {placedOrder && (
        <div className="mb-8 p-4 border border-gold bg-gold/10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm">
            Order <strong>{placedOrder}</strong> placed successfully. Payment received — track progress below.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs uppercase tracking-wider text-gold hover:underline"
          >
            Refresh
          </button>
        </div>
      )}

      <div className="flex gap-1 mb-8 border-b border-gray-100">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? 'border-gold text-primary'
                : 'border-transparent text-gray-500 hover:text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : filtered.length ? (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="border border-gray-100 p-6 bg-white">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <p className="font-heading font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-RW', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {order.address && (
                    <p className="text-xs text-gray-400 mt-1">
                      {order.address.street}, {order.address.city}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatRWF(order.total)}</p>
                  <p className="text-sm text-gold uppercase tracking-wider">
                    {order.status.replace(/_/g, ' ')}
                  </p>
                  {order.payment && (
                    <p className="text-xs text-gray-400 mt-1">
                      {PAYMENT_LABELS[order.payment.method] || order.payment.method}
                    </p>
                  )}
                </div>
              </div>

              {order.items?.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <li key={item.id} className="text-sm text-gray-600 flex justify-between gap-4">
                      <span>
                        {item.product?.name || 'Product'} × {item.quantity}
                        <span className="text-gray-400"> · {item.size} · {item.color}</span>
                      </span>
                      <span className="shrink-0">{formatRWF(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              )}

              <OrderTracker status={order.status} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-gray-100 bg-[#F7F5F2]">
          <p className="text-gray-600 mb-6">
            {tab === 'all' ? 'No orders yet.' : `No ${tab === 'active' ? 'active' : 'delivered'} orders.`}
          </p>
          <Link to="/shop" className="btn-primary inline-block">Start Shopping</Link>
        </div>
      )}
    </div>
  );
}
