import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { clearSession } from '../../lib/auth';

export default function WorkshopProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get('/auth/me')).data?.user ?? null,
  });

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    clearSession(queryClient);
    navigate('/', { replace: true });
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-heading font-bold text-3xl mb-2">Workshop Profile</h1>
      <div className="bg-white border border-gray-100 p-8">
        <dl className="space-y-5">
          {[
            ['Name', `${user.firstName} ${user.lastName}`],
            ['Email', user.email],
            ['Phone', user.phone || 'Not set'],
            ['Role', user.role],
            ['Member Since', new Date(user.createdAt).toLocaleDateString()],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 text-sm border-b border-gray-50 pb-4">
              <dt className="text-gray-500">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <button type="button" onClick={handleLogout} className="mt-8 w-full border border-error text-error py-3 text-sm hover:bg-error hover:text-white transition-colors">
          Logout
        </button>
      </div>
    </div>
  );
}
