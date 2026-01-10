interface FreelancerCardProps {
  freelancer?: {
    freelancerId: string;
    firstName?: string;
    lastName?: string;
    logo?: string;
    country?: string;
    rating?: number;
  };
  onViewProfile: () => void;
}

export const FreelancerCard = ({ freelancer, onViewProfile }: FreelancerCardProps) => {
  if (!freelancer) return null;

  const fullName = `${freelancer.firstName || ''} ${freelancer.lastName || ''}`.trim() || 'Freelancer';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Freelancer</h3>
      <div className="flex items-center gap-4 mb-4">
        {freelancer.logo ? (
          <img
            src={freelancer.logo}
            alt={fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
            {fullName[0]?.toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{fullName}</h4>
          {freelancer.country && (
            <p className="text-sm text-gray-600">{freelancer.country}</p>
          )}
          {freelancer.rating !== undefined && (
            <p className="text-sm text-yellow-600 font-medium">
              ⭐ {freelancer.rating.toFixed(1)}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onViewProfile}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        View Profile
      </button>
    </div>
  );
};
