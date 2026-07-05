import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import api from '../lib/api';

export default function CollectionsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const res = await api.get('/products/meta/filters');
      return res.data.collections;
    },
  });

  const images = {
    executive: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    sports: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    heritage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <ScrollReveal>
          <h1 className="font-heading font-bold text-4xl mb-2">Collections</h1>
          <p className="text-gray-600 mb-16">Explore AVORA curated collections.</p>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(data || []).map((col, i) => (
              <ScrollReveal key={col.id} delay={i * 0.1}>
                <Link to={`/shop?collection=${col.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden mb-4 bg-gray-100">
                    <img
                      src={images[col.slug] || images.executive}
                      alt={col.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h2 className="font-heading font-bold text-2xl mb-2 group-hover:text-gold transition-colors">
                    {col.name}
                  </h2>
                  <p className="text-gray-600 text-sm">{col.description}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
