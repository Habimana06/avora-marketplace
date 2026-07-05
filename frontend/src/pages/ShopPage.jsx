import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../lib/api'

export default function ShopPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products')
      return res.data
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="font-heading font-bold text-4xl mb-2">All Products</h1>
        <p className="text-gray-600 mb-12">Premium luxury fashion curated for the modern connoisseur.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {(data?.products || []).map((product) => (
            <motion.div
              key={product.id}
              className="group cursor-pointer"
              whileHover={{ y: -5 }}
            >
              <Link to={`/product/${product.slug}`}>
                <div className="aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
                  <img 
                    src={product.images?.[0] || '/placeholder.jpg'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {product.collection?.name || product.category?.name}
                </p>
                <p className="font-bold text-xl">₣ {Number(product.price).toLocaleString()}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}