import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function AdminPayments() {
  const { data } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/orders')
      return res.data.orders || []
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Payments</h1>
        <p className="text-gray-600">Payment transactions and status.</p>
      </div>

      <div className="card-premium">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-sm font-medium text-gray-600">
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 text-sm">
                  <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4">{order.payment?.method?.replace('_', ' ') || '—'}</td>
                  <td className="px-6 py-4">₣ {Number(order.total).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      order.payment?.status === 'COMPLETED' ? 'bg-emerald/20 text-emerald' :
                      order.payment?.status === 'FAILED' ? 'bg-error/20 text-error' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.payment?.status || '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}