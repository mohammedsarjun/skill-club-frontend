import React from "react";
import FreelancerHeader from "@/components/freelancer/Header";
import FreelancerRouteGuard from "@/components/guards/FreelancerRouteGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <FreelancerRouteGuard>
      <div className="bg-gray-50 min-h-screen">
        <FreelancerHeader />
        {children}
      </div>
    </FreelancerRouteGuard>
  );
}
