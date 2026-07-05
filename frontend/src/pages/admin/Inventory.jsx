import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function AdminInventory() {
  const { data } = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/products')
      return res.data.products || []
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Inventory</h1>
        <p className="text-gray-600">Stock management.</p>
      </div>

      <div className="card-premium">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-sm font-medium text-gray-600">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 text-sm">
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">{product.sku}</td>
                  <td className="px-6 py-4">{product.inventory?.quantity || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      product.inventory?.quantity > 10 ? 'bg-emerald/20 text-emerald' :
                      product.inventory?.quantity > 0 ? 'bg-gold/20 text-gold' :
                      'bg-error/20 text-error'
                    }`}>
                      {product.inventory?.quantity > 10 ? 'In Stock' : product.inventory?.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
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