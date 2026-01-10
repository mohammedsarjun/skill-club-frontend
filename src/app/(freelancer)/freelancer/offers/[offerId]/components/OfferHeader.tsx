import { FaArrowLeft } from 'react-icons/fa';

interface OfferHeaderProps {
  onGoBack: () => void;
}

export function OfferHeader({ onGoBack }: OfferHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#108A00] transition-colors"
        >
          <FaArrowLeft />
          <span className="font-medium">Back to Offers</span>
        </button>
      </div>
    </div>
  );
}
