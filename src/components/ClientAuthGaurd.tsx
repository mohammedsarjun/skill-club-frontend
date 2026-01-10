"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import { setUser } from "@/store/slices/authSlice";
import { userApi } from "@/api/userApi";
import toast from "react-hot-toast";

export default function ClientAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const guestRoutes = [
    "/login",
    "/signup",
    "/admin/login",
    "/otp",
    "/forgot-password",
    "/reset-password",
    "/",
  ];
  const onboardingPaths = [
    "/onboarding/role",
    "/onboarding/client",
    "/onboarding/freelancer",
  ];

  console.log(localStorage.getItem("user"))

  const user = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")!):null;
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyClient = async () => {
      try {
        let currentUser = user;
        console.log(currentUser);
        // No user → force login
        if (!currentUser) {
          router.replace("/login");
          return;
        }

        if (!currentUser.roles.includes("client")) {
          router.replace("/onboarding/client");
          return;
        }

        if (currentUser.activeRole == "freelancer") {
          router.replace("/freelancer/profile");
          return;
        }

        if (currentUser.activeRole == "admin") {
          router.replace("/admin/jobs");
          return;
        }

        if (currentUser.isClientBlocked) {
          router.replace("/client/blocked");
          return;
        }
      } catch (err) {
        // error → send to login
        router.replace("/login");
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    verifyClient();
  }, [user, pathname, router, dispatch]);

  return <>{children}</>;

  if (checking) return <p>Loading...</p>;
  if (!authorized) return null; // 🚫 block unauthorized content completely

  return <>{children}</>;
}
