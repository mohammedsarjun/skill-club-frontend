"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { clientActionApi } from "@/api/action/ClientActionApi";
import { IClientDashboard } from "@/types/interfaces/IClientDashboard";
import StatCards from "./components/StatCards";
import RecentJobs from "./components/RecentJobs";
import RecentMessages from "./components/RecentMessages";
import NotificationsSection from "./components/NotificationsSection";
import ActiveContracts from "./components/ActiveContracts";
import SavedFreelancers from "./components/SavedFreelancers";

function ClientDashboard() {
  const [dashboardData, setDashboardData] = useState<IClientDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const response = await clientActionApi.getDashboardData();
    if (response.success) {
      setDashboardData(response.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Failed to load dashboard data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-1">
              {greeting}
            </h1>
            <p className="text-gray-500">Welcome back to your dashboard</p>
          </div>

          <button
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            style={{ backgroundColor: "#108A00" }}
            onClick={() => router.push("/client/jobs/create")}
          >
            <FaPlus className="w-5 h-5" />
            Post Job
          </button>
        </div>

        {/* Stats Cards */}
        <StatCards stats={dashboardData.stats} />

        {/* Active Contracts Section */}
        <div className="mb-10">
          <ActiveContracts contracts={dashboardData.recentActiveContracts} />
        </div>

        {/* Recent Jobs Section */}
        <RecentJobs jobs={dashboardData.recentJobs} />

        {/* Saved Freelancers Section */}
        <div className="mb-10">
          <SavedFreelancers freelancers={dashboardData.savedFreelancers} />
        </div>

        {/* Bottom Section: Notifications and Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NotificationsSection />
          <RecentMessages messages={dashboardData.recentMessages} />
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;
