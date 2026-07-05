import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { formatRWF } from '../../lib/currency';

const statusColors = {
  PENDING: 'bg-orange-100 text-orange-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function WorkshopProducts() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['workshop-products', search, status],
    queryFn: async () => {
      const res = await api.get('/workshop/products', { params: { search, status } });
      return res.data.products;
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id) => api.delete(`/workshop/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workshop-products'] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-4 items-end">
        <div>
          <h1 className="font-heading font-bold text-3xl mb-2">My Products</h1>
          <p className="text-gray-600">Products require admin approval before publishing to the shop.</p>
        </div>
        <Link to="/workshop/products/new" className="btn-gold text-sm px-6 py-2.5">+ Add Product</Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search by name, SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 px-4 py-2 text-sm flex-1 min-w-[200px] focus:border-primary outline-none"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-200 px-4 py-2 text-sm focus:border-primary outline-none"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending Approval</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
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
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(products || []).map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt="" className="w-10 h-10 object-cover bg-gray-100" />
                      )}
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{p.sku}</td>
                  <td className="px-6 py-4">{formatRWF(p.price)}</td>
                  <td className="px-6 py-4">{p.inventory?.quantity ?? 0}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 uppercase tracking-wider ${statusColors[p.approvalStatus] || ''}`}>
                      {p.approvalStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link to={`/workshop/products/${p.id}/edit`} className="text-gold hover:underline">Edit</Link>
                      <button
                        type="button"
                        onClick={() => deleteProduct.mutate(p.id)}
                        className="text-error hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!products || products.length === 0) && (
            <p className="px-6 py-12 text-center text-gray-500">No products yet. Create your first design.</p>
          )}
        </div>
      )}
    </div>
  );
}
