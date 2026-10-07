import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { Package, Plus, MapPin, Phone, Tag } from 'lucide-react';

export const FarmerProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getFarmerProducts(user.profileId);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch farmer products:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.profileId) {
      fetchProducts();
    }
  }, [user]);

  if (loading) return <LoadingSpinner label="Fetching produce listings..." />;

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Marketplace Listings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your agricultural produce available for direct buyer pickup.</p>
        </div>
        <Link
          to="/farmer/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-200 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Produce Listing
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="No Produce Listed Yet"
          description="Start selling your harvest directly to local buyers with zero commission."
          action={
            <Link
              to="/farmer/products/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-200 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Produce Listing
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <img
                src={p.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80"}
                alt={p.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      <Tag className="w-3 h-3" /> {p.category}
                    </span>
                    <StatusBadge status={p.status} />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">{p.name}</h3>
                  <p className="text-slate-600 text-sm mt-1 line-clamp-2">{p.description}</p>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-900">Price: ₹{p.price} / {p.unit}</span>
                    <span className="font-semibold text-slate-600">Stock: {p.quantity} {p.unit}</span>
                  </div>
                  <p className="flex items-center gap-1 text-slate-600"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {p.location}</p>
                  <p className="flex items-center gap-1 text-slate-600"><Phone className="w-3.5 h-3.5 text-slate-400" /> {p.contact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerProductsPage;
