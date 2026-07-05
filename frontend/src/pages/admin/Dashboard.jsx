import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/stats')
      return res.data.stats
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Administrator Dashboard</h1>
        <p className="text-gray-600">Full control over the AVORA platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Revenue', value: `₣ ${(data?.revenue || 0).toLocaleString()}`, color: 'text-gold' },
          { label: 'Orders', value: data?.orders || 0 },
          { label: 'Products', value: data?.products || 0 },
          { label: 'Customers', value: data?.users || 0 },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="card-premium p-6 text-center"
            whileHover={{ y: -2 }}
          >
            <p className={`text-3xl font-bold mb-1 ${stat.color || ''}`}>{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="card-premium">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-xl">Recent Orders</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600">No recent orders to display.</p>
        </div>
      </div>
    </div>
  )
}