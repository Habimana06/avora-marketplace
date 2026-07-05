import { motion } from 'framer-motion'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Administrator Dashboard</h1>
        <p className="text-gray-600">Full control over the AVORA platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Revenue', value: '₣ 12.5M', color: 'text-gold' },
          { label: 'Orders', value: '156' },
          { label: 'Products', value: '89' },
          { label: 'Customers', value: '1,240' },
        ].map((stat) => (
          <motion.div 
            key={stat.label}
            className="card-premium p-6"
            whileHover={{ y: -2 }}
          >
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className={`font-heading font-bold text-3xl mt-2 ${stat.color || ''}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="card-premium p-6">
        <h2 className="font-heading font-semibold text-xl mb-4">Recent Orders</h2>
        <p className="text-gray-600">No recent orders to display.</p>
      </div>
    </div>
  )
}