import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export default function AdminUsers() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/users')
      return res.data.users || []
    },
  })

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }) => {
      await axios.put(`/api/admin/users/${userId}/role`, { role })
    },
    onSuccess: () => queryClient.invalidateQueries(['admin-users']),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Users</h1>
        <p className="text-gray-600">Manage user accounts and roles.</p>
      </div>

      <div className="card-premium">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-sm font-medium text-gray-600">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 text-sm">
                  <td className="px-6 py-4 font-medium">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole.mutate({ userId: user.id, role: e.target.value })}
                      className="border border-gray-200 px-2 py-1 text-xs outline-none focus:border-royal"
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="WORKSHOP">Workshop</option>
                      <option value="DELIVERY">Delivery</option>
                      <option value="ADMINISTRATOR">Administrator</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!data || data.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-600">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}