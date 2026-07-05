import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function AdminSales() {
  const { data } = useQuery({
    queryKey: ['admin-sales'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/stats')
      return res.data
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Sales</h1>
        <p className="text-gray-600">Revenue and sales metrics.</p>
      </div>

      <div className="card-premium p-8">
        <p className="text-4xl font-bold text-gold mb-2">₣ {data?.stats?.revenue?.toLocaleString() || 0}</p>
        <p className="text-sm text-gray-600">Total Revenue</p>
      </div>
    </div>
  )
}