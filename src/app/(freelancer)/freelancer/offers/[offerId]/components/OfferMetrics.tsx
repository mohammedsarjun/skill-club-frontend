import { FaCalendar, FaClock, FaDollarSign } from 'react-icons/fa';

interface OfferMetricsProps {
  startDate: string;
  endDate: string;
  paymentType: string;
  daysUntilExpiry: number;
  formatDate: (date: string) => string;
}

export function OfferMetrics({
  startDate,
  endDate,
  paymentType,
  daysUntilExpiry,
  formatDate,
}: OfferMetricsProps) {
  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'fixed':
        return 'Fixed Price';
      case 'fixed_with_milestones':
        return 'Fixed with Milestones';
      case 'hourly':
        return 'Hourly Rate';
      default:
        return type;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex items-center gap-2 text-gray-600">
        <FaCalendar className="text-gray-400" />
        <div>
          <div className="text-xs text-gray-500">Start Date</div>
          <div className="font-semibold text-gray-900">{formatDate(startDate)}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <FaClock className="text-gray-400" />
        <div>
          <div className="text-xs text-gray-500">End Date</div>
          <div className="font-semibold text-gray-900">{formatDate(endDate)}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <FaDollarSign className="text-gray-400" />
        <div>
          <div className="text-xs text-gray-500">Payment Type</div>
          <div className="font-semibold text-gray-900 text-sm">
            {getPaymentTypeLabel(paymentType)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <FaClock className="text-gray-400" />
        <div>
          <div className="text-xs text-gray-500">Expires In</div>
          <div className="font-semibold text-gray-900">{daysUntilExpiry} days</div>
        </div>
      </div>
    </div>
  );
}
