import { Navigate } from 'react-router-dom'

export default function RoleRoute({ user, role, children }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (user.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}