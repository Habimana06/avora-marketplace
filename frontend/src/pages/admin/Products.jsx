import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../../lib/api';
import { formatRWF } from '../../lib/currency';

const statusColors = {
  PENDING: 'bg-orange-100 text-orange-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('all');

  const { data: allProducts, isLoading: loadingAll } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => (await api.get('/admin/products')).data.products || [],
  });

  const { data: pendingProducts, isLoading: loadingPending } = useQuery({
    queryKey: ['admin-products-pending'],
    queryFn: async () => (await api.get('/admin/products/pending')).data.products || [],
    enabled: tab === 'pending',
  });

  const approve = useMutation({
    mutationFn: (id) => api.put(`/admin/products/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products-pending'] });
    },
  });

  const reject = useMutation({
    mutationFn: (id) => api.put(`/admin/products/${id}/reject`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products-pending'] });
    },
  });

  const products = tab === 'pending' ? pendingProducts : allProducts;
  const isLoading = tab === 'pending' ? loadingPending : loadingAll;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Products</h1>
        <p className="text-gray-600">Manage catalog and approve workshop submissions.</p>
      </div>

      <div className="flex gap-2 border-b border-gray-100">
        {[
          ['all', 'All Products'],
          ['pending', `Pending Approval${pendingProducts?.length ? ` (${pendingProducts.length})` : ''}`],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === key ? 'border-gold text-gold' : 'border-transparent text-gray-500 hover:text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Approval</th>
                <th className="px-6 py-4">Active</th>
                {tab === 'pending' && <th className="px-6 py-4">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {(products || []).map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-gray-500">{product.sku}</td>
                  <td className="px-6 py-4">{formatRWF(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 uppercase tracking-wider ${statusColors[product.approvalStatus] || 'bg-gray-100'}`}>
                      {product.approvalStatus || 'APPROVED'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 ${product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {tab === 'pending' && (
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => approve.mutate(product.id)}
                          disabled={approve.isPending}
                          className="text-emerald-600 hover:underline text-xs uppercase tracking-wider"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => reject.mutate(product.id)}
                          disabled={reject.isPending}
                          className="text-error hover:underline text-xs uppercase tracking-wider"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {(!products || products.length === 0) && (
            <p className="px-6 py-12 text-center text-gray-500">
              {tab === 'pending' ? 'No products awaiting approval.' : 'No products found.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
