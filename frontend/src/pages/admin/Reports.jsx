import { motion } from 'framer-motion'

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Reports</h1>
        <p className="text-gray-600">Generate and export reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Sales Report', icon: '📊', desc: 'Monthly sales data' },
          { label: 'Inventory Report', icon: '📦', desc: 'Stock levels' },
          { label: 'User Report', icon: '👥', desc: 'User activity' },
          { label: 'Production Report', icon: '🧵', desc: 'Workshop output' },
        ].map((report) => (
          <motion.div 
            key={report.label}
            className="card-premium p-6 text-center"
            whileHover={{ y: -2 }}
          >
            <span className="text-4xl mb-4 block">{report.icon}</span>
            <h3 className="font-heading font-semibold text-lg mb-2">{report.label}</h3>
            <p className="text-sm text-gray-600 mb-4">{report.desc}</p>
            <button className="btn-primary text-xs">Export CSV</button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}