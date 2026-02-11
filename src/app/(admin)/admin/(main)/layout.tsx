"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaUser,
  FaBars,
  FaHome,
  FaUsers,
  FaCog,
  FaBookOpen,
  FaBriefcase,
  FaFileContract,
  FaChartLine,
  FaMoneyCheckAlt,
  FaStar,
  FaGavel,
  FaLayerGroup,
} from "react-icons/fa";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearUser } from "@/store/slices/authSlice";
import { adminAuthApi } from "@/api/adminAuthApi";
import { clearSessionCookie } from "@/utils/session-cookie";

type LayoutProps = {
  children: ReactNode;
};

function AdminLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname(); // ✅ get current path
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await adminAuthApi.logout();
      dispatch(clearUser());
      clearSessionCookie();
      localStorage.removeItem("user");
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Helper function to style active link
  const linkClasses = (path: string) =>
    `group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      pathname === path
        ? "bg-gray-900 text-white"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    }`;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile sidebar toggle (use global AdminHeader for topbar) */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <FaBars className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`
            fixed lg:static inset-y-0 left-0  w-64 bg-white text-gray-900 h-full shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:transform-none
            ${
              sidebarOpen
                    ? "translate-x-0 z-40"
                    : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          <div className="p-6">
            <div className="hidden lg:flex items-center space-x-2 mb-8">
              <FaBars className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Navigation
              </span>
            </div>

            <nav className="space-y-2">
              <Link href="/admin" className={linkClasses("/admin")}>
                <FaHome className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>

              <Link
                href="/admin/categories-skills"
                className={linkClasses("/admin/categories-skills")}
              >
                <FaLayerGroup className="w-5 h-5" />
                <span className="font-medium">Categories</span>
              </Link>

              <Link
                href="/admin/contracts"
                onClick={() => setSidebarOpen(false)}
                className={`${linkClasses("/admin/contracts")} w-full text-left`}
              >
                <FaFileContract className="w-5 h-5" />
                <span className="font-medium">Contracts</span>
              </Link>

              <Link
                href="/admin/jobs"
                className={linkClasses("/admin/skills")}
              >
                <FaBriefcase className="w-5 h-5" />
                <span className="font-medium">Jobs</span>
              </Link>

              <Link href="/admin/users" className={linkClasses("/admin/users")}>
                <FaUsers className="w-5 h-5" />
                <span className="font-medium">User Management</span>
              </Link>

                 <Link
                href="/admin/revenue"
                className={linkClasses("/admin/revenue")}
              >
                <FaChartLine className="w-5 h-5" />
                <span className="font-medium">Revenue</span>
              </Link>

                <Link href="/admin/withdrawals" className={linkClasses("/admin/withdrawals")}>
                <FaMoneyCheckAlt className="w-5 h-5" />
                <span className="font-medium">Withdrawals</span>
              </Link>


              <Link
                href="/admin/reviews"
                className={linkClasses("/admin/reviews")}
              >
                <FaStar className="w-5 h-5" />
                <span className="font-medium">Reviews</span>
              </Link>

                <Link
                href="/admin/disputes"
                className={linkClasses("/admin/disputes")}
              >
                <FaGavel className="w-5 h-5" />
                <span className="font-medium">Disputes</span>
              </Link>

              <Link
                href="/admin/settings"
                className={linkClasses("/admin/settings")}
              >
                <FaCog className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-30 lg:hidden transition-opacity duration-200"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 lg:ml-0">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminPageLayout({ children }: LayoutProps) {
  return (
    <AdminLayout>{children}</AdminLayout>
  );
}
