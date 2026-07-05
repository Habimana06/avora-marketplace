import { motion } from 'framer-motion'

export default function DeliveryDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Delivery Dashboard</h1>
        <p className="text-gray-600">Manage assigned deliveries and update statuses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Assigned', value: '15' },
          { label: 'In Transit', value: '8' },
          { label: 'Delivered Today', value: '12' },
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
        <h2 className="font-heading font-semibold text-xl mb-4">Today's Deliveries</h2>
        <p className="text-gray-600">No deliveries assigned for today.</p>
      </div>
    </div>
  )
}