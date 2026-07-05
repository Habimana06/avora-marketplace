export const ROLE_HOME = {
  GUEST: '/',
  CUSTOMER: '/',
  WORKSHOP: '/workshop',
  ADMINISTRATOR: '/admin',
};

export function getRoleHomePath(role) {
  return ROLE_HOME[role] || '/';
}

export function persistSession(queryClient, data) {
  if (data?.accessToken) {
    localStorage.setItem('token', data.accessToken);
  }
  if (data?.user) {
    queryClient.setQueryData(['me'], data.user);
  }
}

export function clearSession(queryClient) {
  localStorage.removeItem('token');
  queryClient.setQueryData(['me'], null);
  queryClient.removeQueries();
}
