import React from "react";
import AuthHeader from "@/components/common/AuthHeader";
import AuthGuard from "@/components/guards/AuthGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <AuthHeader />
        {children}
      </div>
    </AuthGuard>
  );
}
