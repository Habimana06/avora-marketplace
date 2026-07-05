import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { clearSession } from '../lib/auth';
import api from '../lib/api';

const sidebarItems = [
  { path: '/workshop', label: 'Dashboard', end: true },
  { path: '/workshop/queue', label: 'Production Queue' },
  { path: '/workshop/products', label: 'My Products' },
  { path: '/workshop/products/new', label: 'Add Product' },
  { path: '/workshop/completed', label: 'Completed' },
  { path: '/workshop/analytics', label: 'Analytics' },
  { path: '/workshop/reports', label: 'Reports' },
  { path: '/workshop/calendar', label: 'Calendar' },
  { path: '/workshop/profile', label: 'Profile' },
];

export default function WorkshopLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get('/auth/me')).data?.user ?? null,
  });

  const handleLogout = () => {
    clearSession(queryClient);
    navigate('/', { replace: true });
    window.location.reload();
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 text-sm font-medium transition-colors border-l-2 ${
      isActive ? 'border-gold text-gold bg-white/5' : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-primary text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <p className="font-heading font-bold text-xl tracking-wide">AVORA</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold mt-1">Workshop Portal</p>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/50 mb-2 truncate">{user?.email}</p>
          <button type="button" onClick={handleLogout} className="text-sm text-white/70 hover:text-gold transition-colors">
            Sign Out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-6 py-4">
          <h2 className="font-heading font-semibold text-lg text-primary">Workshop Management</h2>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
