import { Outlet, Link, NavLink } from 'react-router-dom';
import AvoraLogo from '../components/AvoraLogo';
import SiteFooter from '../components/SiteFooter';
import { useCart } from '../context/CartContext';

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-gold' : 'hover:text-gold'}`;

export default function GuestLayout() {
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <AvoraLogo to="/" size="md" variant="inline" wordSide="right" showTagline={false} />

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/shop" className={linkClass}>Shop</NavLink>
            <NavLink to="/collections" className={linkClass}>Collections</NavLink>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="p-2.5 hover:text-gold transition-colors relative"
              aria-label={`Shopping cart${itemCount ? `, ${itemCount} items` : ''}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-gold text-primary text-[10px] font-bold flex items-center justify-center rounded-full">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
            <Link to="/login" className="px-6 py-2 text-sm font-semibold border border-primary hover:bg-primary hover:text-white transition-all">
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-20 flex-1">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  );
}
