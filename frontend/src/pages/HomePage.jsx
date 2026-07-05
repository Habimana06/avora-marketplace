import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import HeroCarousel from '../components/HeroCarousel';
import ScrollReveal from '../components/ScrollReveal';
import ProductCard from '../components/ProductCard';
import FeaturedCarousel from '../components/FeaturedCarousel';
import AvoraLogo from '../components/AvoraLogo';
import api from '../lib/api';

const productDesignFeatures = [
  { icon: '01', title: 'Precision Pattern Cutting', text: 'Every garment is mapped to millimetre accuracy before a single stitch.' },
  { icon: '02', title: 'Hand-Finished Seams', text: 'Artisan tailors finish each piece by hand for a flawless drape and fit.' },
  { icon: '03', title: 'Premium Fabric Selection', text: 'Italian wool, mulberry silk, and technical blends sourced for longevity.' },
  { icon: '04', title: 'Complimentary Alterations', text: 'Free hemming and fit adjustments on every AVORA purchase in Rwanda.' },
];

const showcaseImage = 'https://images.unsplash.com/photo-1558171813-4c088754af7f?w=900&q=80';

export default function HomePage() {
  const { data } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { featured: 'true' } });
      return res.data;
    },
  });

  const { data: allData } = useQuery({
    queryKey: ['products', 'new'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { sort: 'newest' } });
      return res.data;
    },
  });

  const featured = data?.products || [];
  const showcaseProducts = data?.products?.slice(0, 4) || [];
  const newest = allData?.products?.slice(0, 4) || [];

  return (
    <div className="bg-white">
      <HeroCarousel />

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-gold text-xs tracking-[0.35em] uppercase mb-3">Curated Selection</p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Featured Products</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Signature pieces from the AVORA atelier — designed in Rwanda, priced in RWF.
              </p>
            </div>
          </ScrollReveal>

          {featured.length > 0 ? (
            <ScrollReveal>
              <FeaturedCarousel products={featured} />
            </ScrollReveal>
          ) : (
            <p className="text-center text-gray-500">Featured products coming soon.</p>
          )}
        </div>
      </section>

      {showcaseProducts.length > 0 && (
        <section className="py-24 px-6 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <p className="text-gold text-xs tracking-[0.35em] uppercase mb-3">Atelier Picks</p>
              <h2 className="font-heading font-bold text-3xl mb-8">Shop the Collection</h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {showcaseProducts.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 0.06}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 px-6 bg-[#F7F5F2]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <ScrollReveal>
            <AvoraLogo to={null} size="lg" variant="inline" wordSide="right" className="mb-8" />
            <h2 className="font-heading font-bold text-3xl mb-3">Why AVORA</h2>
            <p className="text-gray-600 mb-8 max-w-lg">
              From sketch to final stitch — every AVORA piece is engineered for fit, feel, and lasting quality.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {productDesignFeatures.map((f) => (
                <div key={f.title} className="bg-white p-5 border-l-2 border-gold hover:shadow-md transition-shadow duration-300">
                  <span className="text-gold font-heading font-bold text-xs tracking-widest mb-2 block">{f.icon}</span>
                  <h3 className="font-heading font-bold text-sm mb-1.5">{f.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="relative aspect-[4/5] w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto overflow-hidden">
              <img src={showcaseImage} alt="AVORA craftsmanship" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-heading font-bold text-3xl md:text-4xl mb-2">New Arrivals</h2>
                <p className="text-gray-600">The latest from the AVORA atelier.</p>
              </div>
              <Link to="/shop" className="text-sm font-semibold tracking-widest uppercase hover:text-gold transition-colors">
                View All →
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newest.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 0.08}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
