import { FaBriefcase, FaFileAlt } from 'react-icons/fa';

interface OfferTitleCardProps {
  title: string;
  offerType: 'direct' | 'proposal';
  status: string;
  jobTitle?: string;
  proposalId?: string;
}

export function OfferTitleCard({
  title,
  offerType,
  status,
  jobTitle,
  proposalId,
}: OfferTitleCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold ${
            offerType === 'proposal'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {offerType === 'proposal' ? 'From Proposal' : 'Direct Offer'}
        </span>
        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold ${
            status === 'pending'
              ? 'bg-yellow-100 text-yellow-700'
              : status === 'accepted'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      {jobTitle && (
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <FaBriefcase className="text-gray-400" />
          <span className="text-sm">Related Job: {jobTitle}</span>
        </div>
      )}
      {proposalId && (
        <div className="flex items-center gap-2 text-gray-600">
          <FaFileAlt className="text-gray-400" />
          <span className="text-sm">Proposal ID: {proposalId}</span>
        </div>
      )}
    </div>
  );
}
