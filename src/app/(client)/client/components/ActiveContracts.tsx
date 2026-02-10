import { IRecentActiveContract } from "@/types/interfaces/IClientDashboard";
import { FaUserCircle, FaGlobe, FaCalendar, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface ActiveContractsProps {
  contracts: IRecentActiveContract[];
}

export default function ActiveContracts({ contracts }: ActiveContractsProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "held":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
  };

  if (contracts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        <div className="text-gray-400 mb-4">
          <FaUserCircle className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Active Contracts
        </h3>
        <p className="text-gray-500">
          Your active contracts will appear here once you hire a freelancer.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Recent Active Contracts
          </h2>
          <button
            onClick={() => router.push("/client/contracts")}
            className="text-sm font-medium text-[#108A00] hover:text-[#0d6e00] flex items-center gap-2 transition-colors"
          >
            View All
            <FaArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {contracts.map((contract) => (
          <div
            key={contract._id}
            onClick={() => router.push(`/client/contracts/${contract._id}`)}
            className="p-6 hover:bg-gray-50 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {contract.freelancer.logo ? (
                  <img
                    src={contract.freelancer.logo}
                    alt={contract.freelancer.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                    {contract.freelancer.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#108A00] transition-colors">
                      {contract.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {contract.freelancer.name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}
                  >
                    {getStatusLabel(contract.status)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                  {contract.freelancer.country && (
                    <div className="flex items-center gap-1">
                      <FaGlobe className="w-3 h-3" />
                      <span>{contract.freelancer.country}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <FaCalendar className="w-3 h-3" />
                    <span>Started: {contract.startDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">
                      Budget: ₹{contract.budget.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {contract.contractType === "milestone" ? "Milestone-based" : "Fixed Price"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
