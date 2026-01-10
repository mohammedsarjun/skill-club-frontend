import { IClientFinanceStats } from "@/types/interfaces/IClientFinance";
import { DollarSign, RefreshCw, Wallet } from "lucide-react";

interface FinanceStatsProps {
  stats: IClientFinanceStats;
}

export default function FinanceStats({ stats }: FinanceStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Total Spent</span>
          <DollarSign className="w-5 h-5 text-red-500" />
        </div>
        <p className="text-3xl font-bold text-gray-900">
          ₹{stats.totalSpent.toFixed(2)}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Total Refunded</span>
          <RefreshCw className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-3xl font-bold text-gray-900">
          ₹{stats.totalRefunded.toFixed(2)}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Available Balance</span>
          <Wallet className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-3xl font-bold text-gray-900">
          ₹{stats.availableBalance.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
