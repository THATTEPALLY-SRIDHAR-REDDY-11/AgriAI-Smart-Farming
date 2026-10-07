import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorAlert = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700 text-sm my-4">
      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-red-800">Notice</h4>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorAlert;
