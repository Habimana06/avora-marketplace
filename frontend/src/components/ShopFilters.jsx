import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { formatRWF } from '../lib/currency';

export default function ShopFilters({ filters, onChange }) {
  const { data: meta } = useQuery({
    queryKey: ['shop-filters'],
    queryFn: async () => {
      const res = await api.get('/products/meta/filters');
      return res.data;
    },
  });

  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-28 space-y-8 border border-gray-100 p-6 bg-white">
        <div>
          <h3 className="font-heading font-semibold text-sm tracking-widest uppercase mb-4">Sort</h3>
          <select
            value={filters.sort}
            onChange={(e) => set('sort', e.target.value)}
            className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary bg-white"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-sm tracking-widest uppercase mb-4">Category</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={!filters.category}
                onChange={() => set('category', '')}
              />
              All
            </label>
            {(meta?.categories || []).map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat.slug}
                  onChange={() => set('category', cat.slug)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-sm tracking-widest uppercase mb-4">Collection</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="collection"
                checked={!filters.collection}
                onChange={() => set('collection', '')}
              />
              All
            </label>
            {(meta?.collections || []).map((col) => (
              <label key={col.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="collection"
                  checked={filters.collection === col.slug}
                  onChange={() => set('collection', col.slug)}
                />
                {col.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-sm tracking-widest uppercase mb-4">Price (RWF)</h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => set('minPrice', e.target.value)}
              className="border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => set('maxPrice', e.target.value)}
              className="border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <p className="text-xs text-gray-500">
            Range: {formatRWF(meta?.priceRange?.min || 0)} – {formatRWF(meta?.priceRange?.max || 0)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChange({ sort: 'newest', category: '', collection: '', minPrice: '', maxPrice: '', search: '' })}
          className="w-full text-sm font-semibold tracking-wider uppercase border border-primary py-3 hover:bg-primary hover:text-white transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </aside>
  );
}
