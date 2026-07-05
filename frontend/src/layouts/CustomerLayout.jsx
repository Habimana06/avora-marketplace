import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { clearSession } from '../lib/auth'
import AvoraLogo from '../components/AvoraLogo'

export default function CustomerLayout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // ignore
    }
    clearSession(queryClient)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <AvoraLogo to="/" size="md" />
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-gold transition-colors">Home</Link>
            <Link to="/shop" className="text-sm font-medium hover:text-gold transition-colors">Shop</Link>
            <Link to="/collections" className="text-sm font-medium hover:text-gold transition-colors">Collections</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/customer" className="text-sm font-medium hover:text-gold transition-colors">Dashboard</Link>
            <Link to="/cart" className="relative p-2 hover:text-gold transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.187 1.707.707 1.707H17m0 0a3 3 0 100-6 3 3 0 1006z" />
              </svg>
            </Link>
            <button onClick={handleLogout} className="text-sm font-medium hover:text-gold transition-colors">
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}