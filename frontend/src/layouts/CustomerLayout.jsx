import { Outlet, Link, NavLink } from 'react-router-dom';
import AvoraLogo from '../components/AvoraLogo';
import SiteFooter from '../components/SiteFooter';
import UserMenu from '../components/UserMenu';
import { useCart } from '../context/CartContext';

const navItems = [
  { to: '/shop', label: 'Shop' },
  { to: '/collections', label: 'Collections' },
  { to: '/customer/wishlist', label: 'Wishlist' },
];

const linkClass = ({ isActive }) =>
  `text-sm font-medium tracking-wide transition-colors ${
    isActive ? 'text-gold' : 'text-primary hover:text-gold'
  }`;

function CartLink() {
  const { itemCount } = useCart();

  return (
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
  );
}

export default function CustomerLayout({ user }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <AvoraLogo to="/" size="md" variant="inline" wordSide="right" showTagline={false} />

          <div className="hidden lg:flex items-center gap-8">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <CartLink />
            <UserMenu user={user} />
          </div>
        </nav>

        <div className="lg:hidden border-t border-gray-100 px-4 py-3 flex gap-5 overflow-x-auto">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={`${linkClass} whitespace-nowrap`}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  );
}
