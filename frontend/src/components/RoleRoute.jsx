import { Navigate } from 'react-router-dom';
import { getRoleHomePath } from './auth';

export function RoleRoute({ user, role, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={getRoleHomePath(user.role)} replace />;
  }

  return children;
}
