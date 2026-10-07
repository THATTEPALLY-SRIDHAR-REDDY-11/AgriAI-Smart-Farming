import React from 'react';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({ title = "No items found", description = "There are no entries to display right now.", action }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm my-6">
    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
      <PackageOpen className="w-8 h-8" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
    {action}
  </div>
);

export default EmptyState;
