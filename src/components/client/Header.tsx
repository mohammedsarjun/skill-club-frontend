"use client";

import { authApi } from "@/api/authApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/slices/authSlice";
import NotificationCenter from "../Notification";
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

import { clearSessionCookie, setSessionCookie, buildSessionData } from "@/utils/session-cookie";
import { useEffect, useRef, useState, useCallback } from "react";
import { clientActionApi } from "@/api/action/ClientActionApi";
import { INotification } from "@/types/interfaces/INotification";
import { useNotification } from "@/hooks/useNotification";

export default function ClientHeader() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHireOpen, setIsHireOpen] = useState(false);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    const response = await clientActionApi.getNotifications();
    if (response.success) {
      setNotifications(response.data.notifications);
    }
  }, []);

  useNotification({
    onNotification: () => {
      fetchNotifications();
    },
  });

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n
      )
    );
    
    await clientActionApi.markNotificationAsRead(notificationId);
  };

  const handleNotificationClick = (notification: INotification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
    setIsNotificationOpen(false);
  };

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

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
              <button className="flex items-center gap-1 text-gray-900 hover:text-blue-600 font-medium">
                Hire Talent <ChevronDown size={16} />
              </button>

              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {hireTalentItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="w-full px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2"
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
              className="text-gray-900 hover:text-blue-600 font-medium"
            >
              Contracts
            </button>

            <button
              onClick={() => router.push("/client/finance")}
              className="text-gray-900 hover:text-blue-600 font-medium"
            >
              Finance
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen((prev) => !prev)}
                className="relative p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-green-500 rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-[420px] z-50">
                  <NotificationCenter
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onNotificationClick={handleNotificationClick}
                  />
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>

              <div className="relative group">
                <button className="text-gray-900 hover:text-blue-600">
                  <ChevronDown size={16} />
                </button>

                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button
                    onClick={() => router.push("/client/profile")}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex gap-2"
                  >
                    <User size={16} /> Profile
                  </button>

                  <button
                    onClick={() => router.push("/account/settings")}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex gap-2"
                  >
                    <Settings size={16} /> Settings
                  </button>

                  <button
                    onClick={handleSwitchAccount}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex gap-2 border-t"
                  >
                    <GitBranch size={16} /> Switch to Freelancer
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex gap-2 border-t"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t py-4 space-y-2">
            <button
              onClick={() => setIsHireOpen(!isHireOpen)}
              className="w-full px-4 py-2.5 flex justify-between text-gray-900 font-medium"
            >
              Hire Talent
              <ChevronDown
                size={16}
                className={isHireOpen ? "rotate-180" : ""}
              />
            </button>

            {isHireOpen &&
              hireTalentItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.onClick();
                      setIsMenuOpen(false);
                      setIsHireOpen(false);
                    }}
                    className="w-full px-6 py-2 text-sm flex items-center gap-2 text-gray-700"
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}

            <button
              onClick={() => {
                router.push("/client/contracts");
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-gray-900 font-medium"
            >
              Contracts
            </button>

            <button
              onClick={() => {
                router.push("/client/finance");
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-gray-900 font-medium"
            >
              Finance
            </button>

            <div className="border-t pt-2 mt-2 space-y-1">
              <button
                onClick={() => {
                  router.push("/client/profile");
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={() => {
                  router.push("/account/settings");
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <Settings size={16} />
                Settings
              </button>

              <button
                onClick={() => {
                  handleSwitchAccount();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <GitBranch size={16} />
                Switch to Freelancer
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
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
