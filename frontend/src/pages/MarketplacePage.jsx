import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Search, Filter, MapPin, Tag, ArrowRight, Store } from 'lucide-react';

export const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getMarketplace({
        query: searchQuery || undefined,
        category: selectedCategory || undefined,
        location: locationFilter || undefined
      });
      setProducts(data);
    } catch (err) {
      console.error('Failed to load marketplace products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Direct Farm Marketplace</h1>
        <p className="text-slate-500 text-sm mt-1">Browse fresh produce listed by verified farmers for direct pickup.</p>
      </div>

      {/* Search & Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tomatoes, potatoes, wheat..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          >
            <option value="">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Grains">Grains & Pulses</option>
            <option value="Organic">Organic Produce</option>
          </select>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Location e.g. Hyderabad"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-200 transition-colors"
          >
            Filter
          </button>
        </div>
      </form>

      {/* Product Cards Grid */}
      {loading ? (
        <LoadingSpinner label="Loading fresh produce listings..." />
      ) : products.length === 0 ? (
        <EmptyState
          title="No Produce Found"
          description="Try adjusting your search query, category, or location filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all group">
              <div className="relative">
                <img
                  src={p.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80"}
                  alt={p.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                  {p.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">{p.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">Farmer: {p.farmerName}</p>
                  <p className="text-slate-600 text-sm mt-2 line-clamp-2">{p.description}</p>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-2xl font-extrabold text-emerald-700">₹{p.price}</span>
                      <span className="text-xs text-slate-500 font-semibold"> / {p.unit}</span>
                    </div>
                    <span className="text-xs text-slate-600 font-medium">Available: {p.quantity} {p.unit}</span>
                  </div>

                  <p className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {p.location}</p>

                  <Link
                    to={`/buyer/products/${p.id}`}
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    View Details & Send Request <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
