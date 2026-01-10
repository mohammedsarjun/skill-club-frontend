"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * FreelancerOnboardingGuard
 * 
 * Protects freelancer onboarding routes.
 * Only allows access if user is authenticated but NOT yet onboarded as freelancer.
 * Redirects to profile if already onboarded.
 */
export default function FreelancerOnboardingGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null;

    // Not logged in → redirect to login
    if (!user) {
      router.replace("/login");
      return;
    }

    // Already onboarded as freelancer → redirect to profile
    if (user.isFreelancerOnboarded) {
      router.replace("/freelancer/profile");
      return;
    }

    // Blocked freelancer → redirect to blocked page
    if (user.isFreelancerBlocked) {
      router.replace("/freelancer/blocked");
      return;
    }
  }, [router]);

  return <>{children}</>;
}
