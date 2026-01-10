"use client";
import React, { useEffect } from "react";
import AuthHeader from "@/components/common/AuthHeader";
import { usePreventBackAfterLogout } from "@/custom-hooks/usePreventBackAfterLogout";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import GuestGuard from "@/components/GuestGaurd";

export default function Layout({ children, params }: { children: React.ReactNode; params?: any }) {
  return (
    <GuestGuard>
      <div className="bg-gray-50 min-h-screen">
        <AuthHeader />
        {children}
      </div>
    </GuestGuard>
  );
}
