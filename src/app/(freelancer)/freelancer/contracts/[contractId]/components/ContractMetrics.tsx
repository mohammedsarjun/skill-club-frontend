import { FaCalendarAlt, FaDollarSign } from 'react-icons/fa';

interface ContractMetricsProps {
  startDate: string;
  endDate: string;
  paymentType: 'fixed' | 'fixed_with_milestones' | 'hourly';
  fundedAmount: number;
  totalPaid: number;
  balance: number;
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
}

export const ContractMetrics = ({
  startDate,
  endDate,
  paymentType,
  fundedAmount,
  totalPaid,
  balance,
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
          <p className="text-sm text-gray-500 mb-1">Funded</p>
          <p className="font-semibold text-gray-900">{formatCurrency(fundedAmount)}</p>
        </div>
      </div>
      <div className="flex items-start">
        <FaDollarSign className="text-blue-600 mt-1 mr-3" />
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Paid</p>
          <p className="font-semibold text-gray-900">{formatCurrency(totalPaid)}</p>
        </div>
      </div>
      <div className="flex items-start">
        <FaDollarSign className="text-orange-600 mt-1 mr-3" />
        <div>
          <p className="text-sm text-gray-500 mb-1">Balance</p>
          <p className="font-semibold text-gray-900">{formatCurrency(balance)}</p>
        </div>
      </div>
    </div>
  );
};
