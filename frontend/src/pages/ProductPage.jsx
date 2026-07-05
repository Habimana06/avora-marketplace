import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { formatRWF } from '../lib/currency';
import { useCart } from '../context/CartContext';
import WishlistButton from '../components/WishlistButton';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';

export default function ProductPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`);
      return res.data;
    },
  });

  const { data: relatedData } = useQuery({
    queryKey: ['products', 'related', data?.product?.collectionId],
    queryFn: async () => {
      const collection = data?.product?.collection?.slug;
      const res = await api.get('/products', {
        params: collection ? { collection } : {},
      });
      return res.data.products.filter((p) => p.slug !== slug).slice(0, 4);
    },
    enabled: !!data?.product,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const product = data?.product;
  const sizes = product?.sizes || ['S', 'M', 'L', 'XL'];
  const colors = product?.colors || ['#0D0D0D', '#B8892D', '#0F5E4B'];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size.');
      return;
    }
    if (!selectedColor) {
      setError('Please select a color.');
      return;
    }
    setError('');
    addItem(product, { size: selectedSize, color: selectedColor });
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
            {product?.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex flex-col lg:py-8">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">
              {product?.collection?.name || product?.category?.name}
            </p>
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">{product?.name}</h1>
            <p className="text-sm text-gray-500 mb-6">Made in Rwanda • SKU {product?.sku}</p>

            <div className="flex items-center justify-between gap-4 mb-8 pb-8 border-b border-gray-100">
              <p className="text-3xl font-bold">{formatRWF(product?.price)}</p>
              {product?.id && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Wishlist</span>
                  <WishlistButton productId={product.id} inline />
                </div>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-xs tracking-widest uppercase text-gray-500 mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => { setSelectedSize(size); setError(''); }}
                    className={`min-w-[3rem] px-4 py-3 border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-xs tracking-widest uppercase text-gray-500 mb-3">Color</h3>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => { setSelectedColor(color); setError(''); }}
                    className={`w-9 h-9 border-2 transition-all ${
                      selectedColor === color ? 'border-primary scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
            </div>

            {error && (
              <p className="text-error text-sm mb-4" role="alert">{error}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button type="button" onClick={handleAddToCart} className="flex-1 btn-gold">
                Add to Cart
              </button>
              <Link to="/cart" className="flex-1 btn-primary text-center">View Cart</Link>
            </div>

            <div className="space-y-6 border-t border-gray-100 pt-8">
              <div>
                <h3 className="font-heading font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{product?.description}</p>
              </div>
              {product?.fabric && (
                <div>
                  <h3 className="font-heading font-semibold mb-2">Fabric</h3>
                  <p className="text-gray-600 text-sm">{product.fabric}</p>
                </div>
              )}
              {product?.care && (
                <div>
                  <h3 className="font-heading font-semibold mb-2">Care</h3>
                  <p className="text-gray-600 text-sm">{product.care}</p>
                </div>
              )}
              {product?.shipping && (
                <div>
                  <h3 className="font-heading font-semibold mb-2">Shipping</h3>
                  <p className="text-gray-600 text-sm">{product.shipping}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {relatedData?.length > 0 && (
        <section className="border-t border-gray-100 py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <h2 className="font-heading font-bold text-2xl md:text-3xl mb-2">You May Also Like</h2>
              <p className="text-gray-600 mb-12">More from the same collection.</p>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedData.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 0.08}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
