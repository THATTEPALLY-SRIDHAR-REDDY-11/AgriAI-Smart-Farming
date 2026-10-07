import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatusBadge } from '../components/StatusBadge';
import { ShoppingBag, Clock, CheckCircle2, CheckCheck, ArrowRight, Store } from 'lucide-react';

export const BuyerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, requestsRes] = await Promise.all([
          api.get(`/buyer/dashboard-stats/${user.profileId}`),
          api.get(`/requests/buyer/${user.profileId}`)
        ]);
        setStats(statsRes.data);
        setRequests(requestsRes.data);
      } catch (err) {
        console.error('Failed to load buyer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.profileId) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) return <LoadingSpinner label="Loading Buyer Dashboard..." />;

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-3xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-extrabold">Welcome back, {user.name}!</h1>
        <p className="text-blue-100 text-sm mt-1 max-w-2xl">
          Browse fresh farm produce directly from local farmers, place purchase requests, and pick up fresh produce.
        </p>

        <div className="mt-6">
          <Link
            to="/buyer/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-400 text-slate-900 font-bold text-sm shadow-md hover:bg-blue-300 transition-colors"
          >
            <Store className="w-5 h-5" /> Browse Produce Marketplace
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Produce</p>
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
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <CheckCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Completed Purchases</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{stats?.completedPurchases || 0}</h3>
          </div>
        </div>
      </div>

      {/* Active Buyer Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Your Active Purchase Requests</h3>
            <p className="text-xs text-slate-500">Track farmer responses and pickup readiness</p>
          </div>
          <Link to="/buyer/requests" className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1">
            View All Requests <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {requests.length === 0 ? (
          <p className="text-sm text-slate-500 italic py-4">You have not submitted any purchase requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">Product</th>
                  <th className="py-3 px-4">Farmer</th>
                  <th className="py-3 px-4">Requested Qty</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {requests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{req.productName}</td>
                    <td className="py-3 px-4">{req.farmerName}</td>
                    <td className="py-3 px-4">{req.requestedQuantity} {req.productUnit}</td>
                    <td className="py-3 px-4"><StatusBadge status={req.status} /></td>
                    <td className="py-3 px-4 text-right">
                      <Link to="/buyer/requests" className="text-xs font-bold text-blue-600 hover:underline">
                        Details
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

export default BuyerDashboard;
