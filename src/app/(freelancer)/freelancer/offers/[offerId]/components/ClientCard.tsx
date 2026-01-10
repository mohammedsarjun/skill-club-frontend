import { FaUser, FaStar, FaMapMarkerAlt, FaChartLine } from 'react-icons/fa';

interface ClientInfo {
  companyName: string;
  rating: number;
  country: string;
  totalJobsPosted: number;
}

interface ClientCardProps {
  client: ClientInfo;
  onViewProfile: () => void;
}

export function ClientCard({ client, onViewProfile }: ClientCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FaUser className="text-[#108A00]" />
        About the Client
      </h3>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-600 mb-1">Client Name</div>
          <div className="font-semibold text-gray-900">{client.companyName}</div>
        </div>

        <div className="flex items-center gap-4 py-3 border-y border-gray-100">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span className="font-bold text-gray-900">{client.rating}</span>
          </div>
          <div className="text-sm text-gray-600">Client Rating</div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">Location</div>
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <FaMapMarkerAlt className="text-gray-400" size={14} />
            {client.country}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">Jobs Posted</div>
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <FaChartLine className="text-gray-400" size={14} />
            {client.totalJobsPosted} jobs
          </div>
        </div>
      </div>
    </div>
  );
}
