import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export default function WishlistButton({ productId, inline = false, className = '' }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [animating, setAnimating] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await api.get('/auth/me');
        return res.data?.user ?? null;
      } catch {
        return null;
      }
    },
  });

  const { data: wishlistItems } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist');
      return res.data.items;
    },
    enabled: user?.role === 'CUSTOMER',
  });

  const isWishlisted = wishlistItems?.some((item) => item.productId === productId);

  const toggle = useMutation({
    mutationFn: async (adding) => {
      if (adding) {
        await api.post(`/wishlist/${productId}`);
      } else {
        await api.delete(`/wishlist/${productId}`);
      }
    },
    onMutate: async () => {
      const willAdd = !isWishlisted;
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });
      const previous = queryClient.getQueryData(['wishlist']);

      queryClient.setQueryData(['wishlist'], (old) => {
        const items = old || [];
        if (willAdd) {
          return [...items, { productId, product: { id: productId } }];
        }
        return items.filter((item) => item.productId !== productId);
      });

      setAnimating(true);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['wishlist'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      setTimeout(() => setAnimating(false), 350);
    },
  });

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (user?.role !== 'CUSTOMER') {
      navigate('/login');
      return;
    }

    toggle.mutate(!isWishlisted);
  };

  const baseClass = inline
    ? `p-1 hover:scale-110 transition-transform ${animating ? 'scale-125' : ''}`
    : `absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all ${animating ? 'scale-125' : 'scale-100'}`;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={toggle.isPending}
      className={`${baseClass} ${className}`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={isWishlisted}
    >
      <svg
        className={`w-5 h-5 transition-colors duration-200 ${
          isWishlisted ? 'fill-error text-error' : 'fill-none text-primary hover:text-error'
        }`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
