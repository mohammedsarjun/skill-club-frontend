interface ContractBudgetProps {
  paymentType: 'fixed' | 'fixed_with_milestones' | 'hourly';
  hourlyRate?: number;
  estimatedHoursPerWeek?: number;
  budget?: number;
  totalMilestones: number;
  formatCurrency: (amount: number) => string;
}

export const ContractBudget = ({
  paymentType,
  hourlyRate,
  estimatedHoursPerWeek,
  budget,
  totalMilestones,
  formatCurrency,
}: ContractBudgetProps) => {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Budget Details</h2>
      <div className="space-y-4">
        {paymentType === 'hourly' && (
          <>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Hourly Rate</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(hourlyRate || 0)}/hr
              </span>
            </div>
            {estimatedHoursPerWeek && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimated Hours Per Week</span>
                <span className="text-lg font-semibold text-gray-900">
                  {estimatedHoursPerWeek} hrs
                </span>
              </div>
            )}
          </>
        )}
        {paymentType === 'fixed' && (
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">Fixed Budget</span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(budget || 0)}
            </span>
          </div>
        )}
        {paymentType === 'fixed_with_milestones' && (
          <>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Total Budget</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(budget || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Milestones Amount</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalMilestones)}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};
