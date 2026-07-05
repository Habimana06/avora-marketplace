import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

export default function WorkshopCalendar() {
  const { data: orders } = useQuery({
    queryKey: ['workshop-calendar'],
    queryFn: async () => (await api.get('/workshop/queue')).data.orders || [],
  });

  const today = new Date().toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Production Calendar</h1>
        <p className="text-gray-600">{today}</p>
      </div>
      <div className="bg-white border border-gray-100 divide-y divide-gray-50">
        {(orders || []).map((order) => (
          <Link
            key={order.id}
            to={`/workshop/orders/${order.id}`}
            className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div>
              <p className="font-medium">{order.items?.[0]?.product?.name}</p>
              <p className="text-sm text-gray-500">Order: {order.orderNumber}</p>
            </div>
            <span className="text-xs uppercase tracking-wider px-3 py-1 bg-gold/10 text-gold">
              {order.production?.status?.replace(/_/g, ' ') || 'Pending'}
            </span>
          </Link>
        ))}
        {(!orders || orders.length === 0) && (
          <p className="text-center text-gray-500 py-8">No scheduled items.</p>
        )}
      </div>
    </div>
  );
}
