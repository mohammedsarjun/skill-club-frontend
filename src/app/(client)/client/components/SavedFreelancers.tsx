import { ISavedFreelancer } from "@/types/interfaces/IClientDashboard";
import { FaHeart, FaGlobe, FaClock, FaArrowRight, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface SavedFreelancersProps {
  freelancers: ISavedFreelancer[];
}

export default function SavedFreelancers({ freelancers }: SavedFreelancersProps) {
  const router = useRouter();

  if (freelancers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        <div className="text-gray-400 mb-4">
          <FaHeart className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Saved Talents
        </h3>
        <p className="text-gray-500 mb-4">
          Save your favorite freelancers to easily find them later.
        </p>
        <button
          onClick={() => router.push("/client/freelancers")}
          className="px-6 py-2 bg-[#108A00] text-white rounded-lg hover:bg-[#0d6e00] transition-colors"
        >
          Browse Freelancers
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Talents You Like
          </h2>
          <button
            onClick={() => router.push("/client/saved-freelancers")}
            className="text-sm font-medium text-[#108A00] hover:text-[#0d6e00] flex items-center gap-2 transition-colors"
          >
            View All
            <FaArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {freelancers.map((saved) => (
          <div
            key={saved._id}
            onClick={() => router.push(`/client/freelancers/${saved.freelancer._id}/profile`)}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-[#108A00] transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                {saved.freelancer.logo ? (
                  <img
                    src={saved.freelancer.logo}
                    alt={saved.freelancer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {saved.freelancer.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate group-hover:text-[#108A00] transition-colors">
                  {saved.freelancer.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 truncate">
                  {saved.freelancer.professionalRole || "Freelancer"}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {saved.freelancer.country && (
                    <div className="flex items-center gap-1">
                      <FaGlobe className="w-3 h-3" />
                      <span>{saved.freelancer.country}</span>
                    </div>
                  )}
                  {saved.freelancer.hourlyRate && (
                    <div className="flex items-center gap-1 font-medium text-gray-700">
                      <span>₹{saved.freelancer.hourlyRate}/hr</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {saved.freelancer.skills && saved.freelancer.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {saved.freelancer.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {saved.freelancer.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                    +{saved.freelancer.skills.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FaClock className="w-3 h-3" />
                <span>Saved {saved.savedAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaHeart className="w-4 h-4 text-red-500" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
