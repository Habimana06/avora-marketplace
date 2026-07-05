import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function AdminOrders() {
  const { data } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/orders')
      return res.data.orders || []
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Orders</h1>
        <p className="text-gray-600">Manage all orders.</p>
      </div>

      <div className="card-premium">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-sm font-medium text-gray-600">
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 text-sm">
                  <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4">{order.user?.firstName} {order.user?.lastName}</td>
                  <td className="px-6 py-4">₣ {Number(order.total).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      order.status === 'DELIVERED' ? 'bg-emerald/20 text-emerald' :
                      order.status === 'CANCELLED' || order.status === 'FAILED' ? 'bg-error/20 text-error' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {(!data || data.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-600">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}