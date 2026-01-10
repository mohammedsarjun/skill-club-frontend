"use client";

import AdminAuthGuard from "@/components/AdminAuthGaurd";
import AdminHeader from "@/components/admin/Header";
import { usePathname } from "next/navigation";
import { usePreventBackAfterLogout } from "@/custom-hooks/usePreventBackAfterLogout";

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: any;
}) {
  const pathname = usePathname();

  // Do not render admin header/auth guard on login page (guest pages)
  const isAuthPage = pathname?.includes("/admin/login") || pathname?.includes("/admin/auth");

  return (
    <>
      {isAuthPage ? (
        <main className="bg-gray-50 min-h-screen">
          <div className="max-w-8xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      ) : (
        <AdminAuthGuard>
          <AdminHeader />
          <main className="bg-gray-50 min-h-screen">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </AdminAuthGuard>
      )}
    </>
  );
}
