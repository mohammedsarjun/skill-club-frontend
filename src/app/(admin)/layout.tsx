"use client";

import AdminHeader from "@/components/admin/Header";
import AdminRouteGuard from "@/components/guards/AdminRouteGuard";
import AdminGuestGuard from "@/components/guards/AdminGuestGuard";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes("/admin/login") || pathname?.includes("/admin/auth");

  return (
    <>
      {isAuthPage ? (
        <AdminGuestGuard>
          <main className="bg-gray-50 min-h-screen">
            <div className="max-w-8xl px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </AdminGuestGuard>
      ) : (
        <AdminRouteGuard>
          <AdminHeader />
          <main className="bg-gray-50 min-h-screen">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </AdminRouteGuard>
      )}
    </>
  );
}
