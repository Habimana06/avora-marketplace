import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export default function WorkshopCompleted() {
  const { data } = useQuery({
    queryKey: ['workshop-completed'],
    queryFn: async () => {
      const res = await api.get('/workshop/queue');
      return res.data.orders?.filter((o) => o.production?.status === 'COMPLETED') || [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Completed Production</h1>
        <p className="text-gray-600">Finished items ready for pickup. Click to view order details.</p>
      </div>
      <div className="bg-white border border-gray-100 divide-y divide-gray-50">
        {(data || []).map((order) => (
          <Link
            key={order.id}
            to={`/workshop/orders/${order.id}`}
            className="flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              {order.items?.[0]?.product?.images?.[0] && (
                <img src={order.items[0].product.images[0]} alt="" className="w-12 h-12 object-cover" />
              )}
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-gray-500">{order.items?.[0]?.product?.name}</p>
              </div>
            </div>
            <span className="text-xs uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1">
              Ready for Delivery
            </span>
          </Link>
        ))}
        {(!data || data.length === 0) && (
          <p className="px-6 py-12 text-center text-gray-500">No completed items yet</p>
        )}
      </div>
    </div>
  );
}
