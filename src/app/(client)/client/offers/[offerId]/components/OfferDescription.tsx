import { FaFileAlt } from 'react-icons/fa';

interface OfferDescriptionProps {
  description: string;
}

export function OfferDescription({ description }: OfferDescriptionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FaFileAlt className="text-[#108A00]" />
        Offer Description
      </h2>
      <div className="prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
        {description}
      </div>
    </div>
  );
}
