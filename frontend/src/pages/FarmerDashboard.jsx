import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatusBadge } from '../components/StatusBadge';
import { Package, Clock, CheckCircle2, Scan, Plus, ArrowRight, Sparkles, MapPin, Phone } from 'lucide-react';

export const FarmerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, requestsRes] = await Promise.all([
          api.get(`/farmer/dashboard-stats/${user.profileId}`),
          api.get(`/requests/farmer/${user.profileId}`)
        ]);
        setStats(statsRes.data);
        setRequests(requestsRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.profileId) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) return <LoadingSpinner label="Loading Farmer Dashboard..." />;

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Smart Farming Hub
          </span>
          <h1 className="text-3xl font-extrabold">Welcome back, {user.name}!</h1>
          <p className="text-emerald-100 text-sm mt-1 max-w-2xl">
            Monitor crop health using MobileNetV2 deep learning model, view grounded RAG advisories, and manage buyer pickup requests.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <Link
              to="/farmer/disease-detection"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 text-slate-900 font-bold text-sm shadow-md hover:bg-emerald-300 transition-colors"
            >
              <Scan className="w-4 h-4" /> Scan Crop Disease
            </Link>
            <Link
              to="/farmer/products/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Produce Listing
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Products</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{stats?.totalProducts || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Requests</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{stats?.pendingRequests || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Accepted Requests</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{stats?.acceptedRequests || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Disease Predictions</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{stats?.totalAiPredictions || 0}</h3>
          </div>
        </div>
      </div>

      {/* Recent Buyer Purchase Requests */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Purchase Requests</h3>
            <p className="text-xs text-slate-500">Direct buyer requests for your listed produce</p>
          </div>
          <Link to="/farmer/requests" className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1">
            View All Requests <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {requests.length === 0 ? (
          <p className="text-sm text-slate-500 italic py-4">No purchase requests received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">Product</th>
                  <th className="py-3 px-4">Buyer Name</th>
                  <th className="py-3 px-4">Requested Qty</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {requests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{req.productName}</td>
                    <td className="py-3 px-4">{req.buyerName}</td>
                    <td className="py-3 px-4">{req.requestedQuantity} {req.productUnit}</td>
                    <td className="py-3 px-4"><StatusBadge status={req.status} /></td>
                    <td className="py-3 px-4 text-right">
                      <Link to="/farmer/requests" className="text-xs font-bold text-emerald-600 hover:underline">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
