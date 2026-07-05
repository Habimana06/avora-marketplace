import { motion } from 'framer-motion'

export default function WorkshopDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Workshop Dashboard</h1>
        <p className="text-gray-600">Manage production requests and track progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending', value: '8', color: 'border-gray-300' },
          { label: 'In Progress', value: '12', color: 'border-gold' },
          { label: 'Quality Check', value: '5', color: 'border-royal' },
          { label: 'Completed', value: '24', color: 'border-emerald' },
        ].map((stat) => (
          <motion.div 
            key={stat.label}
            className="card-premium p-6 border-t-4"
            style={{ borderColor: stat.color.replace('border-', '') }}
            whileHover={{ y: -2 }}
          >
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="font-heading font-bold text-3xl mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="card-premium p-6">
        <h2 className="font-heading font-semibold text-xl mb-4">Today's Queue</h2>
        <p className="text-gray-600">No pending items in queue.</p>
      </div>
    </div>
  )
}