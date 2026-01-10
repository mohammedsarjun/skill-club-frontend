import { FaCalendar, FaFileAlt } from 'react-icons/fa';

interface Milestone {
  title: string;
  amount: number;
  expectedDelivery: string;
}

interface OfferMilestonesProps {
  milestones: Milestone[];
  currency: string;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number, currency: string) => string;
}

export function OfferMilestones({
  milestones,
  currency,
  formatDate,
  formatCurrency,
}: OfferMilestonesProps) {
  if (!milestones || milestones.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FaFileAlt className="text-[#108A00]" />
        Project Milestones
      </h2>
      <div className="space-y-4">
        {milestones.map((milestone, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg p-4 hover:border-[#108A00] transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">
                {idx + 1}. {milestone.title}
              </h3>
              <span className="text-lg font-bold text-[#108A00]">
                {formatCurrency(milestone.amount, currency)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaCalendar className="text-gray-400" size={12} />
              <span>Expected Delivery: {formatDate(milestone.expectedDelivery)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
