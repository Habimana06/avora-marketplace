import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

export default function WorkshopProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    description: '',
    fabric: '',
    care: '',
    shipping: '',
    price: '',
    comparePrice: '',
    sku: '',
    images: '',
    colors: '#0D0D0D,#B8892D',
    sizes: 'S,M,L,XL',
    categoryId: '',
    collectionId: '',
    quantity: '10',
  });

  const { data: meta } = useQuery({
    queryKey: ['workshop-meta'],
    queryFn: async () => (await api.get('/workshop/meta/categories')).data,
  });

  const { data: existing } = useQuery({
    queryKey: ['workshop-product', id],
    queryFn: async () => (await api.get(`/workshop/products/${id}`)).data.product,
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name || '',
        description: existing.description || '',
        fabric: existing.fabric || '',
        care: existing.care || '',
        shipping: existing.shipping || '',
        price: String(existing.price || ''),
        comparePrice: existing.comparePrice ? String(existing.comparePrice) : '',
        sku: existing.sku || '',
        images: (existing.images || []).join('\n'),
        colors: (existing.colors || []).join(','),
        sizes: (existing.sizes || []).join(','),
        categoryId: existing.categoryId || '',
        collectionId: existing.collectionId || '',
        quantity: String(existing.inventory?.quantity ?? 0),
      });
    }
  }, [existing]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        description: form.description,
        fabric: form.fabric,
        care: form.care,
        shipping: form.shipping,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
        sku: form.sku,
        images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        categoryId: form.categoryId,
        collectionId: form.collectionId || null,
        quantity: Number(form.quantity),
      };

      if (isEdit) {
        return api.put(`/workshop/products/${id}`, payload);
      }
      return api.post('/workshop/products', payload);
    },
    onSuccess: () => navigate('/workshop/products'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    save.mutate();
  };

  const inputClass = 'w-full border border-gray-200 px-4 py-3 text-sm focus:border-primary outline-none';

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link to="/workshop/products" className="text-sm text-gray-500 hover:text-gold">← Back to Products</Link>
        <h1 className="font-heading font-bold text-3xl mt-2">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <p className="text-gray-600 text-sm mt-1">Submitted products need admin approval before going live.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-8 space-y-4">
        {[
          ['name', 'Product Name', 'text'],
          ['description', 'Description', 'textarea'],
          ['fabric', 'Fabric', 'text'],
          ['care', 'Care Instructions', 'text'],
          ['shipping', 'Shipping Info', 'text'],
          ['price', 'Price (RWF)', 'number'],
          ['comparePrice', 'Compare Price (optional)', 'number'],
          ['sku', 'SKU (optional)', 'text'],
          ['images', 'Image URLs (one per line)', 'textarea'],
          ['colors', 'Colors (comma-separated hex)', 'text'],
          ['sizes', 'Sizes (comma-separated)', 'text'],
          ['quantity', 'Stock Quantity', 'number'],
        ].map(([key, label, type]) => (
          <div key={key}>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">{label}</label>
            {type === 'textarea' ? (
              <textarea
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={inputClass}
                rows={key === 'images' ? 3 : 4}
                required={['name', 'description', 'price'].includes(key)}
              />
            ) : (
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={inputClass}
                required={['name', 'description', 'price', 'quantity'].includes(key)}
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className={inputClass}
            required
          >
            <option value="">Select category</option>
            {meta?.categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Collection (optional)</label>
          <select
            value={form.collectionId}
            onChange={(e) => setForm({ ...form, collectionId: e.target.value })}
            className={inputClass}
          >
            <option value="">None</option>
            {meta?.collections?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={save.isPending} className="w-full btn-gold disabled:opacity-60">
          {save.isPending ? 'Saving…' : isEdit ? 'Update & Resubmit for Approval' : 'Submit for Approval'}
        </button>
      </form>
    </div>
  );
}
