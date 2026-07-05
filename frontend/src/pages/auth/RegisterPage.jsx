import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../lib/api'
import { getRoleHomePath, persistSession } from '../../lib/auth'
import AvoraLogo from '../../components/AvoraLogo'

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  phone: z.string().optional(),
})

export default function RegisterPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/register', data)
      persistSession(queryClient, res.data)
      navigate(getRoleHomePath(res.data.user.role), { replace: true })
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <AvoraLogo to="/" size="md" />
        </div>
        <h1 className="font-heading font-bold text-3xl mb-8 text-center">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input 
                type="text" 
                placeholder="First Name"
                className="w-full px-6 py-4 border border-gray-200 text-sm font-medium outline-none focus:border-primary"
                {...register('firstName')}
              />
              {errors.firstName && <p className="text-error text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Last Name"
                className="w-full px-6 py-4 border border-gray-200 text-sm font-medium outline-none focus:border-primary"
                {...register('lastName')}
              />
              {errors.lastName && <p className="text-error text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <input 
              type="email" 
              placeholder="Email"
              className="w-full px-6 py-4 border border-gray-200 text-sm font-medium outline-none focus:border-primary"
              {...register('email')}
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password"
              className="w-full px-6 py-4 border border-gray-200 text-sm font-medium outline-none focus:border-primary"
              {...register('password')}
            />
            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <input 
              type="tel" 
              placeholder="Phone (optional)"
              className="w-full px-6 py-4 border border-gray-200 text-sm font-medium outline-none focus:border-primary"
              {...register('phone')}
            />
          </div>
          <button type="submit" className="w-full btn-primary">Create Account</button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-500">
          Registration creates a Customer account. Shop, wishlist, and orders access.
        </p>
        <p className="text-center mt-2 text-sm">
          Already have an account? <Link to="/login" className="text-gold font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
