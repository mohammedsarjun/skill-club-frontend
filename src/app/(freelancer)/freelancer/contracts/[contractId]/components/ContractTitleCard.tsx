interface ContractTitleCardProps {
  contractId: string;
  title: string;
  status: 'pending_funding' | 'active' | 'completed' | 'cancelled' | 'refunded';
  offerType?: 'direct' | 'proposal';
  jobTitle?: string;
}

export const ContractTitleCard = ({
  contractId,
  title,
  status,
  offerType,
  jobTitle,
}: ContractTitleCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending_funding':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatStatus = (s: string) => s.replace(/_/g, ' ').toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <span
              className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor()}`}
            >
              {formatStatus(status)}
            </span>
          </div>
          <p className="text-gray-600 text-lg mb-1">{contractId}</p>
          {jobTitle && (
            <p className="text-sm text-gray-500">
              Related Job: <span className="font-medium text-gray-700">{jobTitle}</span>
            </p>
          )}
          {offerType && (
            <p className="text-sm text-gray-500 mt-1">
              Type: <span className="capitalize font-medium text-gray-700">{offerType}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
