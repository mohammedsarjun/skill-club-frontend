import { FaCalendarAlt, FaDollarSign, FaMoneyBillWave, FaPercent, FaLock, FaUndo } from 'react-icons/fa';

interface ContractMetricsProps {
  startDate: string;
  endDate: string;
  paymentType: 'fixed' | 'fixed_with_milestones' | 'hourly';
  totalFunded: number;
  totalPaidToFreelancer: number;
  totalCommissionPaid: number;
  totalAmountHeld: number;
  totalRefund: number;
  availableContractBalance: number;
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
}

export const ContractMetrics = ({
  startDate,
  endDate,
  paymentType,
  totalFunded,
  totalPaidToFreelancer,
  totalCommissionPaid,
  totalAmountHeld,
  totalRefund,
  availableContractBalance,
  formatDate,
  formatCurrency,
}: ContractMetricsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      <div className="flex items-start">
        <FaCalendarAlt className="text-blue-600 mt-1 mr-3" />
        <div>
          <p className="text-sm text-gray-500 mb-1">Start Date</p>
          <p className="font-semibold text-gray-900">{formatDate(startDate)}</p>
        </div>
      </div>
      <div className="flex items-start">
        <FaCalendarAlt className="text-blue-600 mt-1 mr-3" />
        <div>
          <p className="text-sm text-gray-500 mb-1">End Date</p>
          <p className="font-semibold text-gray-900">{formatDate(endDate)}</p>
        </div>
      </div>
      <div className="flex items-start">
        <FaDollarSign className="text-green-600 mt-1 mr-3" />
        <div>
          <p className="text-sm text-gray-500 mb-1">Payment Type</p>
          <p className="font-semibold text-gray-900 capitalize">{paymentType.replace(/_/g, ' ')}</p>
        </div>
      </div>
      <div className="flex items-start">
        <FaDollarSign className="text-purple-600 mt-1 mr-3" />
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Funded</p>
          <p className="font-semibold text-gray-900">{formatCurrency(totalFunded)}</p>
        </div>
      </div>
      <div className="flex items-start">
        <FaMoneyBillWave className="text-blue-600 mt-1 mr-3" />
        <div>
          <p className="text-sm text-gray-500 mb-1">Paid to Freelancer</p>
          <p className="font-semibold text-gray-900">{formatCurrency(totalPaidToFreelancer)}</p>
        </div>
      </div>
      <div className="flex items-start">
        <FaPercent className="text-orange-600 mt-1 mr-3" />
        <div>
          <p className="text-sm text-gray-500 mb-1">Commission Paid</p>
          <p className="font-semibold text-gray-900">{formatCurrency(totalCommissionPaid)}</p>
        </div>
      </div>
      <div className="flex items-start">
        <FaLock className="text-yellow-600 mt-1 mr-3" />
        <div>
          <p className="text-sm text-gray-500 mb-1">Amount Held</p>
          <p className="font-semibold text-gray-900">{formatCurrency(totalAmountHeld)}</p>
        </div>
      </div>
      <div className="flex items-start">
        <FaUndo className="text-red-600 mt-1 mr-3" />
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Refund</p>
          <p className="font-semibold text-gray-900">{formatCurrency(totalRefund)}</p>
        </div>
      </div>
      <div className="flex items-start">
        <FaDollarSign className="text-teal-600 mt-1 mr-3" />
        <div>
          <p className="text-sm text-gray-500 mb-1">Available Balance</p>
          <p className="font-semibold text-gray-900">{formatCurrency(availableContractBalance)}</p>
        </div>
      </div>
    </div>
  );
};
