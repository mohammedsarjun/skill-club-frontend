import React from "react";
import ClientHeader from "@/components/client/Header";
import FreelancerHeader from "@/components/freelancer/Header";
import AuthGuard from "@/components/guards/AuthGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  
  return (
    <AuthGuard>
      <div className="bg-gray-50 min-h-screen">
        <ClientHeader />
        {children}
      </div>
    </AuthGuard>
  );
}