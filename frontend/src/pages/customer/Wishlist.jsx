import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import api from '../../lib/api';

export default function CustomerWishlist() {
  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist');
      return res.data.items;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-heading font-bold text-4xl mb-2">Wishlist</h1>
      <p className="text-gray-600 mb-12">Pieces you have saved for later.</p>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : data?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map(({ product }) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-gray-100">
          <p className="text-gray-600 mb-6">Your wishlist is empty.</p>
          <Link to="/shop" className="btn-primary inline-block">Browse Shop</Link>
        </div>
      )}
    </div>
  );
}
