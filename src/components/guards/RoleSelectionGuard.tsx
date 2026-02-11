"use client";

import { ReactNode, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getAuthRedirectPath } from "@/utils/auth-redirect";

interface RoleSelectionGuardProps {
  children: ReactNode;
}

export default function RoleSelectionGuard({ children }: RoleSelectionGuardProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const [authorized, setAuthorized] = useState(false);

  const verify = useCallback(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      setAuthorized(false);
      return;
    }

    if (user.roles && user.roles.length > 0) {
      const redirectPath = getAuthRedirectPath(user);
      router.replace(redirectPath);
      setAuthorized(false);
      return;
    }

    setAuthorized(true);
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

  if (!authorized) return null;

  return <>{children}</>;
}
