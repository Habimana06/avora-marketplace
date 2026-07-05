import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { formatRWF } from '../../lib/currency';

export default function WorkshopReports() {
  const { data, isLoading } = useQuery({
    queryKey: ['workshop-reports'],
    queryFn: async () => (await api.get('/workshop/reports')).data,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Workshop Reports</h1>
        <p className="text-gray-600">Product approval and production performance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="font-heading font-semibold mb-4">Products by Approval Status</h2>
          <div className="space-y-3">
            {(data?.products || []).map((row) => (
              <div key={row.approvalStatus} className="flex justify-between text-sm">
                <span className="text-gray-600">{row.approvalStatus}</span>
                <span className="font-bold">{row._count}</span>
              </div>
            ))}
            {(!data?.products || data.products.length === 0) && (
              <p className="text-gray-500 text-sm">No product data yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6">
          <h2 className="font-heading font-semibold mb-4">Production by Status</h2>
          <div className="space-y-3">
            {(data?.productions || []).map((row) => (
              <div key={row.status} className="flex justify-between text-sm">
                <span className="text-gray-600">{row.status?.replace(/_/g, ' ')}</span>
                <span className="font-bold">{row._count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading font-semibold">Recent Orders</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {(data?.recentOrders || []).map((order) => (
            <div key={order.orderNumber} className="flex justify-between px-6 py-4 text-sm">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatRWF(order.total)}</p>
                <p className="text-xs text-gold uppercase">{order.status?.replace(/_/g, ' ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
