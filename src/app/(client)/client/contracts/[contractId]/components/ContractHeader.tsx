import { FaArrowLeft } from 'react-icons/fa';

interface ContractHeaderProps {
  onGoBack: () => void;
}

export const ContractHeader = ({ onGoBack }: ContractHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <button
          onClick={onGoBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Contracts
        </button>
      </div>
    </div>
  );
};
