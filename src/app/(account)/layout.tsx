"use client";
import React from "react";
import AuthHeader from "@/components/common/AuthHeader";
import AuthGuard from "@/components/ClientAuthGaurd";
import ClientHeader from "@/components/client/Header";
import { usePreventBackAfterLogout } from "@/custom-hooks/usePreventBackAfterLogout";


export default function Layout({ children, params }: { children: React.ReactNode; params?: any }) {
  usePreventBackAfterLogout();

  return (

      <div className="bg-gray-50 min-h-screen">
          <ClientHeader />
          {children}
      </div>

    
  );
}