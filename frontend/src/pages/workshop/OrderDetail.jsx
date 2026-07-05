import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { formatRWF } from '../../lib/currency';

export default function WorkshopOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['workshop-order', orderId],
    queryFn: async () => (await api.get(`/workshop/orders/${orderId}`)).data.order,
  });

  const updateStatus = useMutation({
    mutationFn: async (status) => {
      await api.put(`/workshop/production/${orderId}`, { status, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshop-order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['workshop-queue'] });
      queryClient.invalidateQueries({ queryKey: ['workshop-stats'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 mb-4">Order not found.</p>
        <Link to="/workshop/queue" className="text-gold">Back to Queue</Link>
      </div>
    );
  }

  const order = data;
  const mainItem = order.items?.[0];

  return (
    <div className="space-y-6 max-w-4xl">
      <button type="button" onClick={() => navigate('/workshop/queue')} className="text-sm text-gray-500 hover:text-gold">
        ← Back to Queue
      </button>

      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-3xl mb-1">{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className="px-4 py-2 bg-gold/10 text-gold text-sm uppercase tracking-wider h-fit">
          {order.production?.status?.replace(/_/g, ' ') || 'Pending'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="font-heading font-semibold mb-4">Product</h2>
          {mainItem?.product?.images?.[0] && (
            <img src={mainItem.product.images[0]} alt="" className="w-full aspect-square object-cover mb-4 bg-gray-100" />
          )}
          <p className="font-semibold">{mainItem?.product?.name}</p>
          <p className="text-sm text-gray-500 mt-1">Size {mainItem?.size} · Color {mainItem?.color}</p>
          <p className="font-bold mt-2">{formatRWF(mainItem?.price)} × {mainItem?.quantity}</p>
          <p className="text-sm text-gray-600 mt-3">{mainItem?.product?.description}</p>
          {mainItem?.product?.fabric && <p className="text-xs text-gray-400 mt-2">Fabric: {mainItem.product.fabric}</p>}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 p-6">
            <h2 className="font-heading font-semibold mb-4">Customer</h2>
            <p className="text-sm">{order.user?.firstName} {order.user?.lastName}</p>
            <p className="text-sm text-gray-500">{order.user?.email}</p>
            <p className="text-sm text-gray-500">{order.user?.phone || 'No phone'}</p>
          </div>
          <div className="bg-white border border-gray-100 p-6">
            <h2 className="font-heading font-semibold mb-4">Delivery Address</h2>
            <p className="text-sm">{order.address?.street}</p>
            <p className="text-sm text-gray-500">{order.address?.city}, {order.address?.country}</p>
          </div>
          <div className="bg-white border border-gray-100 p-6">
            <h2 className="font-heading font-semibold mb-4">Payment</h2>
            <p className="text-sm">Method: {order.payment?.method?.replace(/_/g, ' ')}</p>
            <p className="font-bold mt-1">{formatRWF(order.total)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-6">
        <h2 className="font-heading font-semibold mb-4">Update Production Status</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Production notes..."
          className="w-full border border-gray-200 px-4 py-3 text-sm mb-4 focus:border-primary outline-none"
          rows={3}
        />
        <div className="flex flex-wrap gap-2">
          {['PENDING', 'IN_PROGRESS', 'QUALITY_CHECK', 'COMPLETED'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => updateStatus.mutate(s)}
              disabled={updateStatus.isPending}
              className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${
                order.production?.status === s
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-200 hover:border-gold'
              }`}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
