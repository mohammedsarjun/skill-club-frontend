"use client";

import { authApi } from "@/api/authApi";
import { userApi } from "@/api/userApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "@/store/slices/authSlice";
import NotificationCenter from "../Notification";
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings,
  GitBranch,
} from "lucide-react";

import { clearSessionCookie, setSessionCookie, buildSessionData } from "@/utils/session-cookie";
import { useEffect, useRef, useState, useCallback } from "react";
import { freelancerActionApi } from "@/api/action/FreelancerActionApi";
import { INotification } from "@/types/interfaces/notification.interface";
import { useNotification } from "@/hooks/useNotification";

export default function FreelancerHeader() {
  const router = useRouter();
  const dispatch = useDispatch();

  const user =
    typeof window !== "undefined" && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : null;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWorkOpen, setIsWorkOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const notificationRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    const response = await freelancerActionApi.getNotifications();
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      router.push("/client/profile");
    } else {
      router.push("/onboarding/client");
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n)),
    );

    await freelancerActionApi.markNotificationAsRead(notificationId);
  };

  const handleNotificationClick = (notification: INotification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    setIsNotificationOpen(false);
  };

  const navigationItems = [
    { label: "Find Jobs", onClick: () => router.push("/freelancer/jobs") },
    {
      label: "Saved Jobs",
      onClick: () => router.push("/freelancer/saved-jobs"),
    },
    { label: "Proposals", onClick: () => router.push("/freelancer/proposals") },
    { label: "Offers", onClick: () => router.push("/freelancer/offers") },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Image
            onClick={() => router.push("/freelancer")}
            src="/images/site logo.png"
            alt="Site Logo"
            width={150}
            height={50}
            className="object-contain cursor-pointer"
          />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-900 hover:text-blue-600 font-medium">
                Find Work <ChevronDown size={16} />
              </button>

              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {navigationItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.push("/freelancer/contracts")}
              className="text-gray-900 hover:text-blue-600 font-medium"
            >
              Contracts
            </button>

            <button
              onClick={() => router.push("/freelancer/earnings")}
              className="text-gray-900 hover:text-blue-600 font-medium"
            >
              Earnings
            </button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen((prev) => !prev)}
                className="relative p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
              >
                <Bell size={20} />
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-green-500 rounded-full">
                    {notifications.filter((n) => !n.isRead).length > 99 ? '99+' : notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-96 z-50">
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
                    onClick={() => router.push("/freelancer/profile")}
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
                    <GitBranch size={16} /> Switch to Client
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

            {/* Mobile Menu Button */}
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
              onClick={() => setIsWorkOpen(!isWorkOpen)}
              className="w-full px-4 py-2.5 flex justify-between text-gray-900 font-medium"
            >
              Find Work
              <ChevronDown
                size={16}
                className={isWorkOpen ? "rotate-180" : ""}
              />
            </button>

            {isWorkOpen &&
              navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick();
                    setIsMenuOpen(false);
                    setIsWorkOpen(false);
                  }}
                  className="w-full px-6 py-2 text-sm text-left text-gray-700"
                >
                  {item.label}
                </button>
              ))}

            <button
              onClick={() => {
                router.push("/freelancer/contracts");
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-gray-900 font-medium"
            >
              Contracts
            </button>

            <button
              onClick={() => {
                router.push("/freelancer/earnings");
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-gray-900 font-medium"
            >
              Earnings
            </button>

            <div className="border-t pt-2 mt-2 space-y-1">
              <button
                onClick={() => {
                  router.push("/freelancer/profile");
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
                Switch to Client
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
