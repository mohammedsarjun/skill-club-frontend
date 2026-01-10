'use client';

import { AlertTriangle, Clock } from 'lucide-react';

interface DisputeStatusBannerProps {
  status: 'cancelled';
  hasActiveDispute?: boolean;
  raisedBy?: 'client' | 'freelancer';
}

export const DisputeStatusBanner = ({ status, hasActiveDispute, raisedBy }: DisputeStatusBannerProps) => {
  if (status !== 'cancelled' || !hasActiveDispute) {
    return null;
  }

  return (
    <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-1">Contract in Dispute</h3>
          <p className="text-sm text-amber-800 mb-2">
            This contract has been cancelled and a dispute has been raised by the {raisedBy === 'client' ? 'client' : 'freelancer'}. 
            The admin team is currently reviewing the case to determine the appropriate resolution.
          </p>
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <Clock className="w-4 h-4" />
            <span>You will be notified once the dispute is resolved.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
