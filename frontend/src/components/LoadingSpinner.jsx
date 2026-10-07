import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ label = "Loading AgriAI AI Services..." }) => (
  <div className="flex flex-col items-center justify-center p-12 space-y-3">
    <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
    <p className="text-sm font-medium text-slate-600">{label}</p>
  </div>
);

export default LoadingSpinner;
