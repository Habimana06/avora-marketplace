export const ROLE_HOME = {
  CUSTOMER: '/customer',
  WORKSHOP: '/workshop',
  DELIVERY: '/delivery',
  ADMINISTRATOR: '/admin',
};

export const ROLE_LABELS = {
  CUSTOMER: 'Customer',
  WORKSHOP: 'Workshop',
  DELIVERY: 'Delivery',
  ADMINISTRATOR: 'Administrator',
};

export function getRoleHomePath(role) {
  return ROLE_HOME[role] || '/';
}

export function persistSession(queryClient, { user, accessToken, refreshToken }) {
  localStorage.setItem('token', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
  queryClient.setQueryData(['me'], user);
}

export function clearSession(queryClient) {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  queryClient.setQueryData(['me'], null);
  queryClient.clear();
}
