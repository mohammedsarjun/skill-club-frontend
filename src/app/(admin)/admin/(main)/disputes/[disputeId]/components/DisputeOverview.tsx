"use client";

import { AlertCircle, Info } from 'lucide-react';

interface DisputeOverviewProps {
  dispute: {
    disputeId: string;
    scope: string;
    contractType: string;
    reasonCode: string;
    description: string;
    createdAt: string;
    raisedBy: string;
  };
  contract: {
    client: {
      firstName: string;
      lastName: string;
      companyName?: string;
    };
    freelancer: {
      firstName: string;
      lastName: string;
    };
  };
}

export function DisputeOverview({ dispute, contract }: DisputeOverviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Dispute Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Dispute Scope</label>
            <p className="text-gray-900 font-medium capitalize">{dispute.scope}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Contract Type</label>
            <p className="text-gray-900 font-medium">{dispute.contractType.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Reason Code</label>
            <p className="text-gray-900 font-medium">{dispute.reasonCode.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Created At</label>
            <p className="text-gray-900 font-medium">{new Date(dispute.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-500 block mb-2">Description</label>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-900">{dispute.description}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Parties Involved</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Client</span>
            </div>
            <p className="text-blue-900 font-semibold">
              {contract.client.companyName || `${contract.client.firstName} ${contract.client.lastName}`}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Freelancer</span>
            </div>
            <p className="text-green-900 font-semibold">
              {`${contract.freelancer.firstName} ${contract.freelancer.lastName}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
