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


          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <LogOut size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span>Sign Out</span>
            </button>
          </div>
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
