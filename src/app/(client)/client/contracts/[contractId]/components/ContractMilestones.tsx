interface ContractMilestone {
  milestoneId: string;
  title: string;
  amount: number;
  expectedDelivery: string;
  status: 'pending_funding' | 'funded' | 'under_review' | 'submitted' | 'approved' | 'paid';
}

interface ContractMilestonesProps {
  milestones: ContractMilestone[];
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
}

export const ContractMilestones = ({
  milestones,
  formatDate,
  formatCurrency,
}: ContractMilestonesProps) => {
  if (!milestones || milestones.length === 0) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'funded':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'submitted':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'paid':
        return 'bg-teal-100 text-teal-700 border-teal-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Milestones</h2>
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.milestoneId}
            className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {index + 1}. {milestone.title}
                </h3>
              </div>
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                  milestone.status
                )}`}
              >
                {milestone.status.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Due: <span className="font-medium text-gray-900">{formatDate(milestone.expectedDelivery)}</span>
              </span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(milestone.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
