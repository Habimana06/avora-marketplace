import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatRWF } from '../lib/currency';
import WishlistButton from './WishlistButton';

export default function ProductCard({ product }) {
  const image = product.images?.[0];

  return (
    <motion.div className="group" whileHover={{ y: -6 }} transition={{ duration: 0.35 }}>
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
          {product.isNew && (
            <span className="absolute top-4 left-4 bg-primary text-white text-[10px] tracking-widest uppercase px-3 py-1">
              New
            </span>
          )}
          {product.isFeatured && (
            <span className="absolute top-4 right-4 bg-gold text-primary text-[10px] tracking-widest uppercase px-3 py-1">
              Featured
            </span>
          )}
        </div>
        <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {product.collection?.name || product.category?.name} • Made in Rwanda
        </p>
      </Link>
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-lg">{formatRWF(product.price)}</p>
        <WishlistButton productId={product.id} inline />
      </div>
    </motion.div>
  );
}
