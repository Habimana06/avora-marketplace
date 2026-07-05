import { motion } from 'framer-motion'

export default function AdminAnalytics() {
  const data = [
    { label: 'Monthly Revenue', value: '₣ 2.4M', color: 'text-gold' },
    { label: 'Orders', value: '156', color: 'text-royal' },
    { label: 'Conversion', value: '3.2%', color: 'text-emerald' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Analytics</h1>
        <p className="text-gray-600">Platform insights and metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((stat) => (
          <motion.div key={stat.label} className="card-premium p-6 text-center" whileHover={{ y: -2 }}>
            <p className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}