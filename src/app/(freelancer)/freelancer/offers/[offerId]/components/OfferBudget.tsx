interface OfferBudgetProps {
  paymentType: string;
  hourlyRate?: number;
  estimatedHoursPerWeek?: number;
  budget?: number;
  totalMilestones?: number;
  currency: string;
  formatCurrency: (amount: number, currency: string) => string;
}

export function OfferBudget({
  paymentType,
  hourlyRate,
  estimatedHoursPerWeek,
  budget,
  totalMilestones,
  currency,
  formatCurrency,
}: OfferBudgetProps) {
  const getAmount = () => {
    if (paymentType === 'hourly') {
      return formatCurrency(hourlyRate!, currency);
    } else if (paymentType === 'fixed_with_milestones') {
      return formatCurrency(totalMilestones || 0, currency);
    }
    return formatCurrency(budget || 0, currency);
  };

  return (
    <div className="bg-gradient-to-r from-[#108A00]/10 to-green-50 rounded-lg p-6 border border-[#108A00]/20">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-600 mb-1">
            {paymentType === 'hourly' ? 'Hourly Rate' : 'Total Budget'}
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {getAmount()}
            {paymentType === 'hourly' && <span className="text-lg">/hr</span>}
          </div>
        </div>
        {estimatedHoursPerWeek && (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600">Hours per week</div>
            <div className="text-2xl font-bold text-gray-900">
              {estimatedHoursPerWeek}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
