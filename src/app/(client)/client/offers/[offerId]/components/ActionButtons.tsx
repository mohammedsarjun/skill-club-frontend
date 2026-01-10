import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface ActionButtonsProps {
  status: string;
  daysUntilExpiry: number;
  onAccept: () => void;
  onReject: () => void;
}

export function ActionButtons({
  status,
  daysUntilExpiry,
  onAccept,
  onReject,
}: ActionButtonsProps) {
  if (status !== 'pending') return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800 font-medium">
          Offer expires in {daysUntilExpiry} days
        </p>
      </div>
      <button
        onClick={onAccept}
        className="w-full bg-[#108A00] text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-[#0d7000] transition-colors mb-3 shadow-lg shadow-[#108A00]/20 flex items-center justify-center gap-2"
      >
        <FaCheckCircle />
        Accept Offer
      </button>
      <button
        onClick={onReject}
        className="w-full flex items-center justify-center gap-2 border-2 border-red-500 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
      >
        <FaTimesCircle />
        Decline Offer
      </button>
    </div>
  );
}
