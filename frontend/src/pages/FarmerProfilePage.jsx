import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Tractor, MapPin, Phone } from 'lucide-react';

export const FarmerProfilePage = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Farmer Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Your registered farmer account and farm details.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-emerald-200">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">{user.name}</h2>
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Tractor className="w-3.5 h-3.5" /> Registered Farmer
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Mail className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</p>
              <p className="font-semibold text-slate-800">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Shield className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Account ID</p>
              <p className="font-semibold text-slate-800">#{user.id} (Profile #{user.profileId})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfilePage;
