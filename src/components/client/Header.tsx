"use client";
import { authApi } from "@/api/authApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/slices/authSlice";
import {
  User,
  ChevronDown,
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  GitBranch,
  Briefcase,
  Plus,
  Users,
  Save,
} from "lucide-react";
import { userApi } from "@/api/userApi";
import { useState } from "react";
import { clearSessionCookie, setSessionCookie, buildSessionData } from "@/utils/session-cookie";

export default function ClientHeader() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHireOpen, setIsHireOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await authApi.logout();
      if (response.success) {
        dispatch(clearUser());
        clearSessionCookie();
        localStorage.removeItem("user");
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleSwitchAccount = async () => {
    const response = await userApi.switchAccount();

    if (response.success) {
      dispatch(setUser(response.data));
      localStorage.setItem("user", JSON.stringify(response.data));
      setSessionCookie(buildSessionData(response.data));
      router.push("/freelancer/profile");
    } else {
      router.push("/onboarding/freelancer/0");
    }
  };

  const hireTalentItems = [
    { label: "Browse Jobs", icon: Briefcase, onClick: () => router.push("/client/jobs") },
    { label: "Post a Job", icon: Plus, onClick: () => router.push("/client/jobs/create") },
    { label: "Offers", icon: Briefcase, onClick: () => router.push("/client/offers") },
    { label: "Find Talent", icon: Users, onClick: () => router.push("/client/freelancers") },
    { label: "Saved Talent", icon: Save, onClick: () => router.push("/client/saved-freelancer") },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Image
            onClick={() => router.push("/client")}
            src="/images/site logo.png"
            alt="Site Logo"
            width={150}
            height={50}
            className="object-contain cursor-pointer"
          />

          <nav className="hidden lg:flex items-center gap-8">
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-900 hover:text-blue-600 transition-colors font-medium">
                <span>Hire Talent</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {hireTalentItems.map((item) => {
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

            <button
              onClick={() => router.push("/client/contracts")}
              className="text-gray-900 hover:text-blue-600 transition-colors font-medium"
            >
              Contracts
            </button>

             <button
              onClick={() => router.push("/client/finance")}
              className="text-gray-900 hover:text-blue-600 transition-colors font-medium"
            >
              Finance
            </button>
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
                      onClick={() => router.push("/client/profile")}
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
                      onClick={handleSwitchAccount}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2 border-t border-gray-200 mt-2 pt-2"
                    >
                      <GitBranch size={16} />
                      Switch to Freelancer
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
              onClick={() => setIsHireOpen(!isHireOpen)}
              className="w-full text-left px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-between"
            >
              Hire Talent
              <ChevronDown
                size={16}
                className={`transition-transform ${isHireOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isHireOpen && (
              <div className="pl-4 space-y-1">
                {hireTalentItems.map((item) => {
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
            <button
              onClick={() => {
                router.push("/client/contracts");
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              Contracts
            </button>

              <button
              onClick={() => {
                router.push("/client/finance");
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              Finance
            </button>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <button
                onClick={() => {
                  router.push("/client/profile");
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
                  handleSwitchAccount();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
              >
                <GitBranch size={16} />
                Switch to Freelancer
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
