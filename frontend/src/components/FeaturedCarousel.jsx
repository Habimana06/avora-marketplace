import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProductCard from './ProductCard';

export default function FeaturedCarousel({ products }) {
  const [index, setIndex] = useState(0);
  const visibleCount = 3;

  useEffect(() => {
    if (products.length <= visibleCount) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [products.length]);

  if (!products.length) return null;

  const visible = Array.from(
    { length: Math.min(visibleCount, products.length) },
    (_, i) => products[(index + i) % products.length],
  );

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={visible.map((p) => p.id).join('-')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </AnimatePresence>

      {products.length > visibleCount && (
        <div className="flex justify-center gap-2 mt-8">
          {products.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1 transition-all duration-300 ${
                i === index ? 'w-8 bg-gold' : 'w-3 bg-gray-300'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
