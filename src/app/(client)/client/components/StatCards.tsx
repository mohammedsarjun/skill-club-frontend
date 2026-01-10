import { IClientDashboardStats } from "@/types/interfaces/IClientDashboard";
import {
  FaPlus,
  FaBriefcase,
  FaFileAlt,
  FaDollarSign,
  FaClock,
} from "react-icons/fa";

interface StatCardProps {
  stats: IClientDashboardStats;
}

export default function StatCards({ stats }: StatCardProps) {
  const statItems = [
    {
      label: "Active Jobs",
      value: stats.activeJobs.toString(),
      icon: FaBriefcase,
      color: "bg-emerald-50",
    },
    {
      label: "Posted Jobs",
      value: stats.postedJobs.toString(),
      icon: FaFileAlt,
      color: "bg-blue-50",
    },
    {
      label: "Total Spend",
      value: `₹${stats.totalSpend.toLocaleString()}`,
      icon: FaDollarSign,
      color: "bg-purple-50",
    },
    {
      label: "Applications Pending",
      value: stats.pendingProposals.toString(),
      icon: FaClock,
      color: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.color} p-3 rounded-xl`}>
              <stat.icon className="w-6 h-6" style={{ color: "#108A00" }} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {stat.value}
          </h3>
          <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
