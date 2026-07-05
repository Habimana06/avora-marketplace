import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import ShopFilters from '../components/ShopFilters';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';
import api from '../lib/api';

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    sort: searchParams.get('sort') || 'newest',
    category: searchParams.get('category') || '',
    collection: searchParams.get('collection') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
  });

  const queryParams = useMemo(() => {
    const params = {};
    if (filters.sort) params.sort = filters.sort;
    if (filters.category) params.category = filters.category;
    if (filters.collection) params.collection = filters.collection;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.search) params.search = filters.search;
    return params;
  }, [filters]);

  const { data, isLoading } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: async () => {
      const res = await api.get('/products', { params: queryParams });
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <ScrollReveal>
          <h1 className="font-heading font-bold text-4xl mb-2">Shop</h1>
          <p className="text-gray-600 mb-12">Premium luxury fashion curated for the modern connoisseur.</p>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-12">
          <ShopFilters filters={filters} onChange={setFilters} />

          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-8">{data?.count ?? 0} products</p>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {(data?.products || []).map((product, i) => (
                  <ScrollReveal key={product.id} delay={(i % 3) * 0.08}>
                    <ProductCard product={product} />
                  </ScrollReveal>
                ))}
              </div>
            )}

            {!isLoading && !data?.products?.length && (
              <p className="text-center text-gray-500 py-20">No products match your filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
