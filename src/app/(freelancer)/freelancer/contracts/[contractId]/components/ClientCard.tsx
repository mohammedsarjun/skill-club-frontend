interface ClientCardProps {
  client?: {
    clientId: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    logo?: string;
    country?: string;
  };
  onViewProfile: () => void;
}

export const ClientCard = ({ client, onViewProfile }: ClientCardProps) => {
  if (!client) return null;

  const displayName = client.companyName || `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Client';
  const initials = client.companyName
    ? client.companyName[0]?.toUpperCase()
    : `${client.firstName?.[0] || ''}${client.lastName?.[0] || ''}`.toUpperCase() || 'C';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Client</h3>
      <div className="flex items-center gap-4 mb-4">
        {client.logo ? (
          <img
            src={client.logo}
            alt={displayName}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold">
            {initials}
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{displayName}</h4>
          {!client.companyName && client.firstName && client.lastName && (
            <p className="text-sm text-gray-600">Individual</p>
          )}
          {client.country && (
            <p className="text-sm text-gray-600">{client.country}</p>
          )}
        </div>
      </div>
      <button
        onClick={onViewProfile}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        View Profile
      </button>
    </div>
  );
};
