"use client";
import React from "react";
import AuthHeader from "@/components/common/AuthHeader";
import AuthGuard from "@/components/ClientAuthGaurd";
import ClientHeader from "@/components/client/Header";
import VerifyUser from "@/components/verifyUser";
import { usePreventBackAfterLogout } from "@/custom-hooks/usePreventBackAfterLogout";
import ClientAuthGuard from "@/components/ClientAuthGaurd";
export default function Layout({ children, params }: { children: React.ReactNode; params?: any }) {

  return (
    <ClientAuthGuard>
    <div className="bg-gray-50 min-h-screen">
      <ClientHeader />
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
    </ClientAuthGuard>
  );
}
