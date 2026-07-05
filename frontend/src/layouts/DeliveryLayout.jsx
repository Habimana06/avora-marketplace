import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { clearSession } from '../lib/auth'
import AvoraLogo from '../components/AvoraLogo'

const sidebarItems = [
  { path: '/delivery', label: 'Dashboard', icon: '🚚' },
  { path: '/delivery/assigned', label: 'Assigned Deliveries', icon: '📍' },
]

export default function DeliveryLayout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } catch { /* ignore */ }
    clearSession(queryClient)
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-emerald text-white flex flex-col">
        <div className="p-6 border-b border-emerald/50">
          <AvoraLogo to="/delivery" size="sm" subtitle="Delivery" className="text-white [&_span]:text-white [&_span:last-child]:text-white/50" />
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-emerald/80 transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald/50">
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm hover:opacity-80 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-4">
          <h2 className="font-heading font-semibold text-lg">Delivery</h2>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}