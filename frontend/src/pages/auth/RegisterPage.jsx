import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { getRoleHomePath, persistSession } from '../../lib/auth';
import AvoraLogo from '../../components/AvoraLogo';

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  phone: z.string().optional(),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      persistSession(queryClient, res.data);
      navigate(getRoleHomePath(res.data.user.role), { replace: true });
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div
        className="hidden lg:block relative bg-primary bg-cover bg-center order-last lg:order-first"
        style={{
          backgroundImage: 'linear-gradient(rgba(13,13,13,0.5), rgba(13,13,13,0.85)), url(https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&q=80)',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white text-center">
          <AvoraLogo to="/" size="lg" variant="stacked" dark />
          <p className="mt-10 text-white/70 max-w-sm leading-relaxed">
            Join AVORA and discover luxury fashion crafted with African heritage. Shop, wishlist, and track orders in RWF.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 bg-[#F7F5F2]">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-10">
            <AvoraLogo to="/" size="md" variant="stacked" />
          </div>

          <Link to="/" className="inline-block text-xs tracking-widest uppercase text-gray-500 hover:text-gold mb-8 transition-colors">
            ← Back to home
          </Link>

          <h1 className="font-heading font-bold text-3xl mb-2">Create account</h1>
          <p className="text-gray-600 mb-10">Join the AVORA community</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">First name</label>
                <input
                  type="text"
                  className="w-full px-5 py-4 bg-white border border-gray-200 text-sm outline-none focus:border-primary"
                  {...register('firstName')}
                />
                {errors.firstName && <p className="text-error text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Last name</label>
                <input
                  type="text"
                  className="w-full px-5 py-4 bg-white border border-gray-200 text-sm outline-none focus:border-primary"
                  {...register('lastName')}
                />
                {errors.lastName && <p className="text-error text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-5 py-4 bg-white border border-gray-200 text-sm outline-none focus:border-primary"
                {...register('email')}
              />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Password</label>
              <input
                type="password"
                className="w-full px-5 py-4 bg-white border border-gray-200 text-sm outline-none focus:border-primary"
                {...register('password')}
              />
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Phone (optional)</label>
              <input
                type="tel"
                className="w-full px-5 py-4 bg-white border border-gray-200 text-sm outline-none focus:border-primary"
                {...register('phone')}
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full btn-primary mt-2">
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-gold font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
