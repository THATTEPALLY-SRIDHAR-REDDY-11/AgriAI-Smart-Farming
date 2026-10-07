import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { ErrorAlert } from '../components/ErrorAlert';
import { Check, X, PackageCheck, User, Phone, MapPin, MessageSquare } from 'lucide-react';

export const FarmerRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      const data = await requestService.getFarmerRequests(user.profileId);
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

  const handleUpdateStatus = async (requestId, status) => {
    try {
      await requestService.updateStatus(requestId, status);
      fetchRequests();
    } catch (err) {
      setError('Failed to update request status.');
    }
  };

  if (loading) return <LoadingSpinner label="Fetching buyer purchase requests..." />;

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Buyer Purchase Requests</h1>
        <p className="text-slate-500 text-sm mt-1">Review buyer order requests and mark produce ready for direct farm pickup.</p>
      </div>

      <ErrorAlert message={error} />

      {requests.length === 0 ? (
        <EmptyState
          title="No Purchase Requests Yet"
          description="When buyers request your produce, their purchase details and contact information will appear here."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{req.productName}</h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-xs text-slate-500">
                    Request ID #{req.id} • Submitted on {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Requested Amount</span>
                  <span className="text-xl font-extrabold text-emerald-700">
                    {req.requestedQuantity} {req.productUnit} (₹{(req.requestedQuantity * req.productPrice).toFixed(2)})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" /> Buyer: {req.buyerName}
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" /> {req.buyerPhone || 'Not provided'}
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" /> {req.buyerLocation || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                    <MessageSquare className="w-4 h-4 text-emerald-600" /> Buyer Note:
                  </p>
                  <p className="text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                    "{req.message || 'No additional message.'}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-end gap-3 pt-2">
                {req.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-red-200 transition-colors"
                    >
                      <X className="w-4 h-4" /> Decline Request
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-200 transition-colors"
                    >
                      <Check className="w-4 h-4" /> Accept Request
                    </button>
                  </>
                )}

                {req.status === 'ACCEPTED' && (
                  <button
                    onClick={() => handleUpdateStatus(req.id, 'READY_FOR_PICKUP')}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-teal-200 transition-colors"
                  >
                    <PackageCheck className="w-4 h-4" /> Mark Produce Ready for Pickup
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

export default FarmerRequestsPage;
