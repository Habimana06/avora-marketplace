import { Outlet, Link } from 'react-router-dom'
import AvoraLogo from '../components/AvoraLogo'

export default function GuestLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <AvoraLogo to="/" size="md" />
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-gold transition-colors">Home</Link>
            <Link to="/shop" className="text-sm font-medium hover:text-gold transition-colors">Shop</Link>
            <Link to="/collections" className="text-sm font-medium hover:text-gold transition-colors">Collections</Link>
            <Link to="/about" className="text-sm font-medium hover:text-gold transition-colors">About</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:text-gold transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.5-5.5M9 15v6m6-6v6M3 9V5a2 2 0 012-2h14a2 2 0 012 2v4M3 9v12a2 2 0 002 2h18a2 2 0 002-2V9" />
              </svg>
            </button>
            <Link to="/login" className="px-6 py-2 text-sm font-semibold border border-primary hover:bg-primary hover:text-white transition-all">
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-20 flex-1">
        <Outlet />
      </main>

      <footer className="bg-primary text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <AvoraLogo to="/" size="sm" className="text-white [&_span]:text-white [&_span:last-child]:text-white/60" />
            <p className="text-sm opacity-80">Luxury fashion crafted with African heritage.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="/shop" className="hover:opacity-100">All Products</a></li>
              <li><a href="/collections" className="hover:opacity-100">Collections</a></li>
              <li><a href="/new" className="hover:opacity-100">New Arrivals</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="/contact" className="hover:opacity-100">Contact</a></li>
              <li><a href="/shipping" className="hover:opacity-100">Shipping</a></li>
              <li><a href="/returns" className="hover:opacity-100">Returns</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm opacity-80 mb-4">Subscribe for updates and exclusive offers.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 px-4 py-2 text-primary text-sm outline-none"
              />
              <button className="px-4 py-2 bg-gold text-primary font-semibold">→</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}