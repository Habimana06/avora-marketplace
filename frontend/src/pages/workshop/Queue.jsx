import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

export default function WorkshopQueue() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data: queue, isLoading } = useQuery({
    queryKey: ['workshop-queue', search, status],
    queryFn: async () => {
      const res = await api.get('/workshop/queue', { params: { search, status } });
      return res.data.orders;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Production Queue</h1>
        <p className="text-gray-600">Click an order to view full details and update status.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search order number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 px-4 py-2 text-sm flex-1 min-w-[200px] focus:border-primary outline-none"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-200 px-4 py-2 text-sm focus:border-primary outline-none"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="QUALITY_CHECK">Quality Check</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-gray-100 divide-y divide-gray-50">
          {(queue || []).map((order) => (
            <Link
              key={order.id}
              to={`/workshop/orders/${order.id}`}
              className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {order.items?.[0]?.product?.images?.[0] && (
                  <img
                    src={order.items[0].product.images[0]}
                    alt=""
                    className="w-14 h-14 object-cover bg-gray-100"
                  />
                )}
                <div>
                  <p className="font-heading font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.items?.[0]?.product?.name}</p>
                  <p className="text-xs text-gray-400">{order.user?.firstName} {order.user?.lastName}</p>
                </div>
              </div>
              <span className="text-xs uppercase tracking-wider px-3 py-1 bg-gold/10 text-gold">
                {order.production?.status?.replace(/_/g, ' ') || 'Pending'}
              </span>
            </Link>
          ))}
          {(!queue || queue.length === 0) && (
            <p className="px-6 py-12 text-center text-gray-500">Production queue is empty</p>
          )}
        </div>
      )}
    </div>
  );
}
