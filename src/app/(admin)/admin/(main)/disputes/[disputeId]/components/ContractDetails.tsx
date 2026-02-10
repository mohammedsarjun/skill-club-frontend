"use client";

import { DollarSign } from 'lucide-react';

interface ContractDetailsProps {
  contract: {
    contractId: string;
    title: string;
    description: string;
    paymentType: string;
    budget?: number;
    hourlyRate?: number;
    status: string;
    expectedStartDate: string;
    expectedEndDate: string;
    fundedAmount: number;
    totalPaid: number;
    balance: number;
  };
}

export function ContractDetails({ contract }: ContractDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Contract Details</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Contract ID</label>
            <p className="text-gray-900 font-medium">{contract.contractId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Payment Type</label>
            <p className="text-gray-900 font-medium capitalize">{contract.paymentType.replace(/_/g, ' ')}</p>
          </div>
          {contract.budget && (
            <div>
              <label className="text-sm font-medium text-gray-500">Total Budget</label>
              <p className="text-gray-900 font-medium">${contract.budget.toLocaleString()}</p>
            </div>
          )}
          {contract.hourlyRate && (
            <div>
              <label className="text-sm font-medium text-gray-500">Hourly Rate</label>
              <p className="text-gray-900 font-medium">${contract.hourlyRate}/hr</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <p className="text-gray-900 font-medium capitalize">{contract.status}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Start Date</label>
            <p className="text-gray-900 font-medium">{new Date(contract.expectedStartDate).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">End Date</label>
            <p className="text-gray-900 font-medium">{new Date(contract.expectedEndDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-500 block mb-2">Description</label>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-900">{contract.description}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Financial Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700 mb-1">Funded Amount</p>
            <p className="text-2xl font-bold text-blue-900">${contract.fundedAmount.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700 mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-green-900">${contract.totalPaid.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-700 mb-1">Balance</p>
            <p className="text-2xl font-bold text-purple-900">${contract.balance.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
