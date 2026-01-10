"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * ClientOnboardingGuard
 * 
 * Protects client onboarding routes.
 * Only allows access if user is authenticated but NOT yet onboarded as client.
 * Redirects to profile if already onboarded.
 */
export default function ClientOnboardingGuard({
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

    // Already onboarded as client → redirect to profile
    if (user.isClientOnboarded) {
      router.replace("/client/profile");
      return;
    }

    // Blocked client → redirect to blocked page
    if (user.isClientBlocked) {
      router.replace("/client/blocked");
      return;
    }
  }, [router]);

  return <>{children}</>;
}
