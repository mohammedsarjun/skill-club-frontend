"use client";
import React from "react";
import AuthHeader from "@/components/common/AuthHeader";
import AuthGuard from "@/components/ClientAuthGaurd";
import FreelancerHeader from "@/components/freelancer/Header";
import VerifyUser from "@/components/verifyUser";
import { usePreventBackAfterLogout } from "@/custom-hooks/usePreventBackAfterLogout";
import FreelancerAuthGuard from "@/components/FreelancerAuthGaurd";
export default function Layout({ children, params }: { children: React.ReactNode; params?: any }) {

  return (
    <FreelancerAuthGuard>
      <div className="bg-gray-50 min-h-screen">
        <FreelancerHeader></FreelancerHeader>
        {children}
      </div>
    </FreelancerAuthGuard>
  );
}
