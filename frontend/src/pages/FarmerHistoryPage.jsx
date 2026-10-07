import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { diseaseService } from '../services/diseaseService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Scan, Calendar, Award } from 'lucide-react';

export const FarmerHistoryPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await diseaseService.getHistory(user.profileId);
        setHistory(data);
      } catch (err) {
        console.error('Failed to load disease history:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.profileId) {
      fetchHistory();
    }
  }, [user]);

  if (loading) return <LoadingSpinner label="Fetching disease detection logs..." />;

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">AI Detection History</h1>
        <p className="text-slate-500 text-sm mt-1">Archived crop disease scans diagnosed by MobileNetV2.</p>
      </div>

      {history.length === 0 ? (
        <EmptyState
          title="No Past Scans Logged"
          description="Your disease scan history will be saved here automatically when you upload crop leaf photos."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Crop</th>
                <th className="py-3.5 px-4">Diagnosed Condition</th>
                <th className="py-3.5 px-4">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(h.createdAt).toLocaleDateString()} {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{h.crop}</td>
                  <td className="py-3.5 px-4 text-emerald-800 font-semibold">{h.disease}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                      {(h.confidence * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FarmerHistoryPage;
