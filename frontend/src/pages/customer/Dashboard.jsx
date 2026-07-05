import { motion } from 'framer-motion'

export default function CustomerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back to your AVORA account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Orders', value: '12', link: '/customer/orders' },
          { label: 'Wishlist', value: '5', link: '/customer/wishlist' },
          { label: 'Loyalty Points', value: '1,250', link: '/customer/rewards' },
        ].map((stat) => (
          <motion.div 
            key={stat.label}
            className="card-premium p-6"
            whileHover={{ y: -2 }}
          >
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="font-heading font-bold text-3xl mt-2">{stat.value}</p>
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