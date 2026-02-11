import React from "react";
import AuthHeader from "@/components/common/AuthHeader";
import GuestGuard from "@/components/guards/GuestGuard";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <GuestGuard>
        <AuthHeader />
        {children}
      </GuestGuard>
    </div>
  );
}
