import React from "react";
import ClientHeader from "@/components/client/Header";
import ClientRouteGuard from "@/components/guards/ClientRouteGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientRouteGuard>
      <div className="bg-gray-50 min-h-screen">
        <ClientHeader />
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </ClientRouteGuard>
  );
}
