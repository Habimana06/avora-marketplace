import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function AdminCoupons() {
  const { data } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/coupons')
      return res.data.coupons || []
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Coupons</h1>
        <p className="text-gray-600">Discount code management.</p>
      </div>

      <div className="card-premium">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-sm font-medium text-gray-600">
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Used</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((coupon) => (
                <tr key={coupon.id} className="border-b border-gray-100 text-sm">
                  <td className="px-6 py-4 font-medium">{coupon.code}</td>
                  <td className="px-6 py-4">{coupon.discountValue}%</td>
                  <td className="px-6 py-4">{coupon.usedCount || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${coupon.isActive ? 'bg-emerald/20 text-emerald' : 'bg-gray-100 text-gray-600'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}