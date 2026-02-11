"use client";

import { ReactNode, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getAuthRedirectPath } from "@/utils/auth-redirect";

interface GuestGuardProps {
  children: ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const verify = useCallback(() => {
    if (!isLoading && user) {
      const redirectPath = getAuthRedirectPath(user);
      router.replace(redirectPath);
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    verify();
  }, [verify]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) verify();
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [verify]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return null;

  return <>{children}</>;
}
