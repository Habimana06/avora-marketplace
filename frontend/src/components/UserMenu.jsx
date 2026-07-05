import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { clearSession } from '../lib/auth';

export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore logout API errors
    }
    clearSession(queryClient);
    navigate('/', { replace: true });
    window.location.reload();
  };

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center font-heading font-semibold text-sm hover:border-gold hover:text-gold transition-colors"
        aria-label="Account menu"
        aria-expanded={open}
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 shadow-lg py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <Link
            to="/customer/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm hover:bg-gray-50 hover:text-gold transition-colors"
          >
            My Profile
          </Link>
          <Link
            to="/customer/orders"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm hover:bg-gray-50 hover:text-gold transition-colors"
          >
            Order History
          </Link>
          <Link
            to="/customer/wishlist"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm hover:bg-gray-50 hover:text-gold transition-colors"
          >
            Wishlist
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 text-error transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
