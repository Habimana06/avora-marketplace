import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AvoraLogo from '../components/AvoraLogo'

export default function HomePage() {
  return (
    <div className="bg-white">
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AvoraLogo to={null} size="hero" subtitle="African Luxury" />
          </motion.div>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Luxury fashion crafted with African heritage. Precision engineering meets timeless design.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/shop" className="inline-block btn-gold">
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-16 text-center">Executive Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                className="card-premium"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-[3/4] bg-gray-100 mb-4" />
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-2">Product Name</h3>
                  <p className="text-sm text-gray-600 mb-3">Collection Name • Made in Rwanda</p>
                  <p className="font-bold text-xl">₣ 120,000</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-16 text-center">Made in Rwanda Story</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600 leading-relaxed">
              Every AVORA piece tells a story of heritage, craftsmanship, and innovation. 
              From the heart of Rwanda, we create garments that embody the spirit of African luxury.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}