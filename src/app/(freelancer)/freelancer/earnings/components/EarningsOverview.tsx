"use client"
import { IFreelancerEarningsOverview } from '@/types/interfaces/IFreelancerEarnings';

interface Props {
  data: IFreelancerEarningsOverview;
  onWithdraw?: () => void;
}

export default function EarningsOverview({ data, onWithdraw }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-sm text-gray-500">Available Balance</div>
        <div className="text-2xl font-bold mt-2">${data.available.toFixed(2)}</div>
        <button onClick={onWithdraw} className="mt-4 inline-block bg-[#14A800] text-white px-4 py-2 rounded">Withdraw</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-sm text-gray-500">Pending Withdraw</div>
        <div className="text-2xl font-bold mt-2">${data.pending.toFixed(2)}</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-sm text-gray-500">Total Earnings</div>
        <div className="text-2xl font-bold mt-2">${data.totalEarnings.toFixed(2)}</div>
      </div>
    </div>
  );
}

