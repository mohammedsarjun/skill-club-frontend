import React from 'react';
import { DollarSign, Clock, TrendingUp } from 'lucide-react';
import { IFreelancerEarningsOverview } from '@/types/interfaces/IFreelancerEarnings';

interface EarningsOverviewProps {
  data: IFreelancerEarningsOverview;
}

const EarningsOverview: React.FC<EarningsOverviewProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Available Balance</span>
          <DollarSign className="h-5 w-5 text-green-600" />
        </div>
        <div className="text-2xl font-bold text-gray-900">
          ₹{data.available.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Pending Clearance</span>
          <Clock className="h-5 w-5 text-yellow-600" />
        </div>
        <div className="text-2xl font-bold text-gray-900">
          ₹{data.pending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Total Earnings</span>
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>
        <div className="text-2xl font-bold text-gray-900">
          ₹{data.totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
};

export default EarningsOverview;
