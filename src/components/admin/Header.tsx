"use client";
import { authApi } from "@/api/authApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/slices/authSlice";
import {
  User,
  ChevronDown,
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  BarChart3,
  Users,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

export default function AdminHeader() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await authApi.logout();
      if (response.success) {
        dispatch(clearUser());
        localStorage.removeItem("user");
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const dashboardItems = [
    { label: "Dashboard", icon: BarChart3, onClick: () => router.push("/admin") },
    { label: "Users", icon: Users, onClick: () => router.push("/admin/users") },
    { label: "Jobs", icon: Briefcase, onClick: () => router.push("/admin/jobs") },
    { label: "Reports", icon: AlertCircle, onClick: () => router.push("/admin/reports") },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Image
            onClick={() => router.push("/admin")}
            src="/images/site logo.png"
            alt="Site Logo"
            width={150}
            height={50}
            className="object-contain cursor-pointer"
          />

          <nav className="hidden lg:flex items-center gap-8">
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-900 hover:text-blue-600 transition-colors font-medium">
                <span>Dashboard</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {dashboardItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow">
                <User size={20} className="text-white" />
              </div>

              <div className="relative group">
                <button className="flex items-center gap-1 text-gray-900 hover:text-blue-600 transition-colors">
                  <ChevronDown size={16} />
                </button>
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <button
                      onClick={() => router.push("/admin/profile")}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <button
                      onClick={() => router.push("/account/settings")}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-gray-200 mt-2 pt-2"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
            <button
              onClick={() => setIsDashboardOpen(!isDashboardOpen)}
              className="w-full text-left px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-between"
            >
              Dashboard
              <ChevronDown
                size={16}
                className={`transition-transform ${isDashboardOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isDashboardOpen && (
              <div className="pl-4 space-y-1">
                {dashboardItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.onClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <button
                onClick={() => {
                  router.push("/admin/profile");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
              >
                <User size={16} />
                Profile
              </button>
              <button
                onClick={() => {
                  router.push("/account/settings");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
              >
                <Settings size={16} />
                Settings
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
