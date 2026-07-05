import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '../lib/api'

export default function ProductPage() {
  const { slug } = useParams()
  
  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`)
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

  const product = data?.product

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="aspect-[3/4] bg-gray-100" />

        <div className="flex flex-col">
          <h1 className="font-heading font-bold text-4xl mb-2">{product?.name}</h1>
          <p className="text-lg text-gray-600 mb-6">
            {product?.collection?.name || product?.category?.name} • Made in Rwanda
          </p>
          <p className="text-3xl font-bold mb-8">₣ {Number(product?.price).toLocaleString()}</p>

          <div className="mb-8">
            <h3 className="font-semibold mb-3">Select Size</h3>
            <div className="flex space-x-2">
              {(product?.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
                <button 
                  key={size}
                  className="w-12 h-12 border border-gray-300 font-medium hover:border-primary transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-3">Select Color</h3>
            <div className="flex space-x-2">
              {(product?.colors || ['#000000', '#B8892D', '#0F5E4B']).map((color, i) => (
                <button 
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button className="btn-gold mb-8">Add to Cart</button>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product?.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}