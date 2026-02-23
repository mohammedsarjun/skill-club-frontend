"use client";

import { authApi } from "@/api/authApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/slices/authSlice";
import NotificationCenter from "../Notification";
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
import { useEffect, useRef, useState, useCallback } from "react";
import AdminActionApi from "@/api/action/AdminActionApi";
import { INotification } from "@/types/interfaces/notification.interface";
import { useNotification } from "@/hooks/useNotification";

export default function AdminHeader() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    const response = await AdminActionApi.getNotifications();
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

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );

    await AdminActionApi.markNotificationAsRead(id);
  };

  const handleNotificationClick = (notification: INotification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
    setIsNotificationOpen(false);
  };

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

          {/* <nav className="hidden lg:flex items-center gap-8">
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
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav> */}

          {/* <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen((p) => !p)}
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>

              <div className="relative group">
                <button className="flex items-center gap-1 text-gray-900 hover:text-blue-600">
                  <ChevronDown size={16} />
                </button>
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                  <div className="py-2">
                    <button
                      onClick={() => router.push("/admin/profile")}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <button
                      onClick={() => router.push("/account/settings")}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t mt-2 pt-2"
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
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div> */}
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t py-4 space-y-2">
            <button
              onClick={() => setIsDashboardOpen(!isDashboardOpen)}
              className="w-full px-4 py-2.5 flex justify-between"
            >
              Dashboard
              <ChevronDown
                size={16}
                className={isDashboardOpen ? "rotate-180" : ""}
              />
            </button>

            {isDashboardOpen &&
              dashboardItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.onClick();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-6 py-2 text-sm flex items-center gap-2"
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}

            <div className="border-t pt-2">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-red-600 flex items-center gap-2"
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
