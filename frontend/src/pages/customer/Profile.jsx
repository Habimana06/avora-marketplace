import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { clearSession } from '../../lib/auth';

export default function CustomerProfile({ user: userProp }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data?.user ?? null;
    },
    initialData: userProp,
  });

  const { data: orders } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => (await api.get('/orders/my-orders')).data.orders,
    enabled: !!user,
  });

  const { data: wishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => (await api.get('/wishlist')).data.items,
    enabled: !!user,
  });

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    clearSession(queryClient);
    navigate('/', { replace: true });
    window.location.reload();
  };

  if (!user) return null;

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  const quickLinks = [
    { to: '/customer/orders', label: 'Order History', desc: `${orders?.length || 0} orders` },
    { to: '/customer/wishlist', label: 'Wishlist', desc: `${wishlist?.length || 0} saved items` },
    { to: '/cart', label: 'Shopping Cart', desc: 'View your bag' },
    { to: '/shop', label: 'Continue Shopping', desc: 'Browse collections' },
  ];

  return (
    <div className="bg-[#F7F5F2] min-h-screen">
      <div className="bg-primary text-white px-6 py-16">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full border-2 border-gold flex items-center justify-center font-heading font-bold text-3xl text-gold shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left flex-1">
            <p className="text-gold text-xs tracking-[0.35em] uppercase mb-2">AVORA Member</p>
            <h1 className="font-heading font-bold text-3xl mb-1">{user.firstName} {user.lastName}</h1>
            <p className="text-white/60 text-sm">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="px-6 py-2.5 border border-white/30 text-sm font-medium hover:bg-white hover:text-primary transition-colors shrink-0"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 -mt-8">
          <div className="bg-white border border-gray-100 p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-gold">{user.loyaltyPoints ?? 0}</p>
            <p className="text-xs tracking-widest uppercase text-gray-500 mt-1">Loyalty Points</p>
          </div>
          <div className="bg-white border border-gray-100 p-6 text-center shadow-sm">
            <p className="text-3xl font-bold">{orders?.length || 0}</p>
            <p className="text-xs tracking-widest uppercase text-gray-500 mt-1">Orders</p>
          </div>
          <div className="bg-white border border-gray-100 p-6 text-center shadow-sm">
            <p className="text-3xl font-bold">{wishlist?.length || 0}</p>
            <p className="text-xs tracking-widest uppercase text-gray-500 mt-1">Wishlist Items</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-100 p-8">
            <h2 className="font-heading font-semibold text-lg mb-6 pb-4 border-b border-gray-100">
              Account Details
            </h2>
            <dl className="space-y-5">
              {[
                ['Full Name', `${user.firstName} ${user.lastName}`],
                ['Email', user.email],
                ['Phone', user.phone || 'Not set'],
                ['Member Since', new Date(user.createdAt || Date.now()).toLocaleDateString('en-RW', { year: 'numeric', month: 'long' })],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 text-sm">
                  <dt className="text-gray-500 shrink-0">{label}</dt>
                  <dd className="font-medium text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white border border-gray-100 p-8">
            <h2 className="font-heading font-semibold text-lg mb-6 pb-4 border-b border-gray-100">
              Quick Access
            </h2>
            <div className="space-y-1">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center justify-between py-4 border-b border-gray-50 hover:text-gold transition-colors group"
                >
                  <span className="font-medium text-sm">{link.label}</span>
                  <span className="text-xs text-gray-400 group-hover:text-gold">{link.desc} →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
