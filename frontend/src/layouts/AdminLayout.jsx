import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const sidebarItems = [
  { path: '/admin', label: 'Dashboard', icon: '👑', end: true },
  { path: '/admin/sales', label: 'Sales', icon: '💰' },
  { path: '/admin/orders', label: 'Orders', icon: '🛒' },
  { path: '/admin/products', label: 'Products', icon: '📦' },
  { path: '/admin/inventory', label: 'Inventory', icon: '📋' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/coupons', label: 'Coupons', icon: '🎫' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { path: '/admin/payments', label: 'Payments', icon: '💳' },
  { path: '/admin/reports', label: 'Reports', icon: '📄' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout')
    } catch {
      // ignore
    }
    localStorage.removeItem('token')
    queryClient.clear()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-royal text-white flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-royal/50">
          <div className="flex flex-col items-center">
            <span className="font-heading font-bold text-xl tracking-tight">AVORA</span>
            <span className="text-xs uppercase tracking-wider opacity-60 mt-1">Administrator</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-royal/80 text-white' : 'hover:bg-royal/50'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-royal/50">
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:opacity-80 transition-colors">
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-4">
          <h2 className="font-heading font-semibold text-lg">Administrator</h2>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}