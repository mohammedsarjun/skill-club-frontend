import React from 'react';
import { FaExclamationTriangle, FaDollarSign } from 'react-icons/fa';

interface HourlyContractHeldWarningProps {
  requiredAmount: number;
  hourlyRate: number;
  estimatedHoursPerWeek: number;
  currentBalance: number;
  currency: string;
  onFundContract: () => void;
}

const HourlyContractHeldWarning: React.FC<HourlyContractHeldWarningProps> = ({
  requiredAmount,
  hourlyRate,
  estimatedHoursPerWeek,
  currentBalance,
  currency,
  onFundContract,
}) => {
  const getCurrencySymbol = (curr: string): string => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
    };
    return symbols[curr] || curr;
  };

  const formatAmount = (amount: number): string => {
    return `${getCurrencySymbol(currency)}${amount.toFixed(2)}`;
  };

  const weeklyRequired = hourlyRate * estimatedHoursPerWeek;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6 rounded-r-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaExclamationTriangle className="h-6 w-6 text-yellow-400" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Contract On Hold - Insufficient Balance
          </h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>
              Your contract is currently on hold because the balance is insufficient to cover the estimated weekly hours.
            </p>
            <div className="bg-white bg-opacity-50 p-4 rounded-md mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Hourly Rate:</span>
                <span>{formatAmount(hourlyRate)}/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Estimated Hours/Week:</span>
                <span>{estimatedHoursPerWeek} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Required Weekly Amount:</span>
                <span className="font-semibold">{formatAmount(weeklyRequired)}</span>
              </div>
              <div className="border-t border-yellow-300 my-2"></div>
              <div className="flex justify-between">
                <span className="font-medium">Current Balance:</span>
                <span>{formatAmount(currentBalance)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span className="font-semibold">Amount Needed:</span>
                <span className="font-bold">{formatAmount(requiredAmount)}</span>
              </div>
            </div>
            <p className="mt-3 font-medium">
              Please fund at least {formatAmount(requiredAmount)} to activate the contract.
            </p>
          </div>
          <div className="mt-4">
            <button
              onClick={onFundContract}
              className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              <FaDollarSign className="mr-2" />
              Fund Contract Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlyContractHeldWarning;
