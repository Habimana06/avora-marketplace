import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../lib/api'
import { getRoleHomePath, persistSession } from '../../lib/auth'
import AvoraLogo from '../../components/AvoraLogo'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data)
      persistSession(queryClient, res.data)
      navigate(getRoleHomePath(res.data.user.role), { replace: true })
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <AvoraLogo to="/" size="md" />
        </div>
        <h1 className="font-heading font-bold text-3xl mb-8 text-center">Sign In</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <button type="submit" className="w-full btn-primary">Sign In</button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">
          Staff accounts are assigned by an administrator.
        </p>
        <p className="text-center mt-2 text-sm">
          Don't have an account? <Link to="/register" className="text-gold font-medium">Register</Link>
        </p>
      </div>
    </div>
  )
}
