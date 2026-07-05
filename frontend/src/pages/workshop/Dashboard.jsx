import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const statCards = [
  { key: 'pending', label: 'Pending', color: 'border-gray-300' },
  { key: 'inProgress', label: 'In Progress', color: 'border-gold' },
  { key: 'qualityCheck', label: 'Quality Check', color: 'border-blue-400' },
  { key: 'completed', label: 'Completed', color: 'border-emerald-500' },
  { key: 'myProducts', label: 'My Products', color: 'border-primary' },
  { key: 'pendingApproval', label: 'Awaiting Approval', color: 'border-orange-400' },
  { key: 'approvedProducts', label: 'Published', color: 'border-gold' },
  { key: 'totalOrders', label: 'Active Orders', color: 'border-primary' },
];

const quickLinks = [
  { to: '/workshop/queue', label: 'Production Queue', desc: 'Manage orders in production' },
  { to: '/workshop/products/new', label: 'Add Product', desc: 'Submit new design for approval' },
  { to: '/workshop/products', label: 'My Products', desc: 'View, edit, search products' },
  { to: '/workshop/reports', label: 'Reports', desc: 'Production & product analytics' },
  { to: '/workshop/completed', label: 'Completed', desc: 'Finished production items' },
  { to: '/workshop/calendar', label: 'Calendar', desc: 'Production schedule' },
];

export default function WorkshopDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['workshop-stats'],
    queryFn: async () => (await api.get('/workshop/stats')).data.stats,
  });

  const { data: queue } = useQuery({
    queryKey: ['workshop-queue'],
    queryFn: async () => (await api.get('/workshop/queue')).data.orders,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Workshop Dashboard</h1>
        <p className="text-gray-600">Manage production, products, and atelier operations.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.key} className={`bg-white border border-gray-100 border-t-4 ${card.color} p-5`}>
            <p className="text-2xl font-bold mb-1">{stats?.[card.key] ?? 0}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="font-heading font-semibold text-lg mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex justify-between items-center p-3 border border-gray-50 hover:border-gold transition-colors group"
              >
                <span className="font-medium text-sm group-hover:text-gold">{link.label}</span>
                <span className="text-xs text-gray-400">{link.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-heading font-semibold text-lg">Recent Queue</h2>
            <Link to="/workshop/queue" className="text-xs text-gold uppercase tracking-wider">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(queue || []).slice(0, 5).map((order) => (
              <Link
                key={order.id}
                to={`/workshop/orders/${order.id}`}
                className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.items?.[0]?.product?.name}</p>
                </div>
                <span className="text-xs uppercase tracking-wider text-gold">
                  {order.production?.status?.replace(/_/g, ' ') || 'Pending'}
                </span>
              </Link>
            ))}
            {(!queue || queue.length === 0) && (
              <p className="px-6 py-8 text-center text-gray-500 text-sm">No orders in queue</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
