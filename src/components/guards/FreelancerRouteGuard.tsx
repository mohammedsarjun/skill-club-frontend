"use client";

import { ReactNode, useEffect, useCallback, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface FreelancerRouteGuardProps {
  children: ReactNode;
}

export default function FreelancerRouteGuard({ children }: FreelancerRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
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

    if (user.activeRole !== "freelancer") {
      if (user.activeRole === "client") {
        router.replace("/client");
      } else {
        router.replace("/login");
      }
      setAuthorized(false);
      return;
    }

    if (!user.isFreelancerOnboarded) {
      router.replace("/onboarding/freelancer/0");
      setAuthorized(false);
      return;
    }

    if (user.isFreelancerBlocked && pathname !== "/freelancer/blocked") {
      router.replace("/freelancer/blocked");
      setAuthorized(false);
      return;
    }

    if (!user.isFreelancerBlocked && pathname === "/freelancer/blocked") {
      router.replace("/freelancer/profile");
      setAuthorized(false);
      return;
    }

    setAuthorized(true);
  }, [isLoading, user, router, pathname]);

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
