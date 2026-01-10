"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GuestGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkUser = () => {
      console.log("🔹 GuestGuard check running...");
      console.log("Current localStorage keys:", Object.keys(localStorage));
      console.log("User data:", localStorage.getItem("user"));

      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!)
        : null;

      setTimeout(() => {
        if (user.activeRole === "admin") router.replace("/admin/jobs");
        else if (user.activeRole === "freelancer")
          router.replace("/freelancer/profile");
        else if (user.activeRole === "client") router.replace("/client");
      }, 0); // short delay lets the router hydrate
    };

    // Run once on mount
    checkUser();

    // Handle browser back/forward navigation
    window.addEventListener("popstate", checkUser);

    // Handle page restored from cache (bfcache)
    document.addEventListener("visibilitychange", checkUser);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("popstate", checkUser);
      document.removeEventListener("visibilitychange", checkUser);
    };
  }, [router]);

  return <>{children}</>;
}
