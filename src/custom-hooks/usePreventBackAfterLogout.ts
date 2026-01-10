"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function usePreventBackAfterLogout() {
  // const router = useRouter();
  // const pathname = usePathname();
  // const user = useSelector((state: RootState) => state.auth.user);
  // const [isHydrated, setIsHydrated] = useState(false);

  // const GUEST_ROUTES = [
  //   "/login",
  //   "/signup",
  //   "/admin/login",
  //   "/otp",
  //   "/forgot-password",
  //   "/reset-password",
  //   "/",
  // ];

  // const DASHBOARD_ROUTES: Record<string, string> = {
  //   admin: "/admin/categories-skills",
  //   client: "/client",
  //   freelancer: "/freelancer/profile",
  // };

  // // ✅ Hydrate once
  // useEffect(() => {
  //   setIsHydrated(true);
  // }, []);

  // useEffect(() => {
  //   if (!isHydrated) return;

  //   // --- CASE 1: Logged out → Protected route
  //   if (!user && !GUEST_ROUTES.includes(pathname)) {
  //     console.log("User not found — redirecting to login");
  //     router.replace("/login");
  //     return;
  //   }

  //   // --- CASE 2: Logged in → Guest route
  //   if (user && GUEST_ROUTES.includes(pathname)) {
  //     console.log("User already logged in — redirecting to dashboard");
  //     router.replace(DASHBOARD_ROUTES[user.activeRole] || "/");
  //     return;
  //   }

  //   // --- CASE 3: Admin restriction → /account + onboarding routes
  //   if (user?.activeRole === "admin") {
  //     if (
  //       pathname.startsWith("/account") ||
  //       pathname.startsWith("/onboarding")
  //     ) {
  //       console.log("Admin cannot access account or onboarding routes");
  //       router.replace(DASHBOARD_ROUTES.admin);
  //       return;
  //     }
  //   }

  //   // --- CASE 4: Freelancer restriction → onboarding/freelancer
  //   if (
  //     user?.activeRole === "freelancer" &&
  //     user.freelancerProfile !== null &&
  //     pathname.startsWith("/onboarding/freelancer")
  //   ) {
  //     console.log("Freelancer already onboarded — redirecting");
  //     router.replace(DASHBOARD_ROUTES.freelancer);
  //     return;
  //   }

  //   // --- CASE 5: Client restriction → onboarding/client
  //   if (
  //     user?.activeRole === "client" &&
  //     user.clientProfile !== null &&
  //     pathname.startsWith("/onboarding/client")
  //   ) {
  //     console.log("Client already onboarded — redirecting");
  //     router.replace(DASHBOARD_ROUTES.client);
  //     return;
  //   }

  //   // --- CASE 6: Browser back/forward navigation
  //   const handlePopState = () => {
  //     console.log("Back/forward navigation detected");
  //     if (!user) {
  //       window.location.reload();
  //     }
  //   };

  //   window.addEventListener("popstate", handlePopState);
  //   return () => window.removeEventListener("popstate", handlePopState);
  // }, [isHydrated, user, pathname, router]);
}
