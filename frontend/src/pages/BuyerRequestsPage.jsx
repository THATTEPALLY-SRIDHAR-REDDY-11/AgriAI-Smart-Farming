import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { ErrorAlert } from '../components/ErrorAlert';
import { Phone, MapPin, CheckCheck, Package, Calendar } from 'lucide-react';

export const BuyerRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      const data = await requestService.getBuyerRequests(user.profileId);
      setRequests(data);
    } catch (err) {
      setError('Failed to load purchase requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.profileId) {
      fetchRequests();
    }
  }, [user]);

  const handleMarkCompleted = async (requestId) => {
    try {
      await requestService.updateStatus(requestId, 'COMPLETED');
      fetchRequests();
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  if (loading) return <LoadingSpinner label="Fetching your purchase requests..." />;

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">My Purchase Requests & Pickups</h1>
        <p className="text-slate-500 text-sm mt-1">Track request status, access farmer pickup locations, and mark orders completed.</p>
      </div>

      <ErrorAlert message={error} />

      {requests.length === 0 ? (
        <EmptyState
          title="No Requests Submitted"
          description="Browse the produce marketplace and send purchase requests to local farmers."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-slate-900">{req.productName}</h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-xs text-slate-500">
                    Request ID #{req.id} • Submitted on {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Total Quantity</span>
                  <span className="text-xl font-extrabold text-emerald-700">
                    {req.requestedQuantity} {req.productUnit} (₹{(req.requestedQuantity * req.productPrice).toFixed(2)})
                  </span>
                </div>
              </div>

              {/* Farmer Contact & Pickup Info Card (Visible once ACCEPTED or READY_FOR_PICKUP) */}
              {(req.status === 'ACCEPTED' || req.status === 'READY_FOR_PICKUP' || req.status === 'COMPLETED') ? (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">Farmer Contact & Pickup Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                    <p className="flex items-center gap-2 font-semibold">
                      <Phone className="w-4 h-4 text-emerald-600" /> Phone: {req.farmerPhone || 'Contact farmer'}
                    </p>
                    <p className="flex items-center gap-2 font-semibold">
                      <MapPin className="w-4 h-4 text-emerald-600" /> Pickup Location: {req.farmerLocation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500">
                  Farmer contact and direct pickup location will be displayed once the farmer accepts your purchase request.
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                {(req.status === 'READY_FOR_PICKUP' || req.status === 'ACCEPTED') && (
                  <button
                    onClick={() => handleMarkCompleted(req.id)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-200 transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" /> Mark Purchase as Picked Up & Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerRequestsPage;
