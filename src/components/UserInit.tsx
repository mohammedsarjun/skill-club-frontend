"use client";

import { authApi } from "@/api/authApi";
import { adminAuthApi } from "@/api/adminAuthApi";
import { setUser } from "@/store/slices/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { setSessionCookie, buildSessionData, clearSessionCookie } from "@/utils/session-cookie";

export default function ClientInit() {
  const dispatch = useDispatch();
  const pathname = usePathname();

  useEffect(() => {
    const guestPaths = ["/","/login", "/signup", "/otp", "/forgot-password", "/reset-password"];
    const isGuestRoute = guestPaths.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    );

    if (isGuestRoute) {
      dispatch(setUser(null));
      return;
    }

    async function fetchUser() {
      const isAdminRoute = pathname.startsWith("/admin");

      if (isAdminRoute) {
        const response = await adminAuthApi.me();
        if (response.success) {
          const userData = {
            userId: response.data.userId,
            firstName: response.data.firstName || "Admin",
            lastName: response.data.lastName || "",
            roles: response.data.roles || ["admin"],
            activeRole: response.data.activeRole || "admin",
            isOnboardingCompleted: true,
            isFreelancerOnboarded: false,
            isClientOnboarded: false,
            isFreelancerBlocked: false,
            isClientBlocked: false,
          };
          dispatch(setUser(userData));
          setSessionCookie(buildSessionData(userData));
        } else {
          dispatch(setUser(null));
          clearSessionCookie();
        }
        return;
      }

      const response = await authApi.me();
      if (response.success) {
        dispatch(setUser(response.data));
        setSessionCookie(buildSessionData(response.data));
      } else {
        dispatch(setUser(null));
        clearSessionCookie();
      }
    }
    fetchUser();
  }, []);

  return null;
}
